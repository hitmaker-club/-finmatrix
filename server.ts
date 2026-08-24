/**
 * Server Entry Point: Express REST API & Vite Integration
 * Bind Host: 0.0.0.0, Port: 3000
 */

import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { createServer as createViteServer } from 'vite';

import { db, DIAGNOSTIC_MODULES_REGISTRY } from './server/services/db.js';
import { logger } from './server/services/logger.js';
import { getAccountFromToken, canAccess, verifyProfileAccess } from './server/services/auth.js';
import { computeFinancialMatrix, ALGORITHM_VERSION } from './server/engine/math.js';
import { generateLayer2Analysis, PROMPT_VERSION } from './server/engine/ai.js';
import { SOCIONICS_SCREENS } from './server/engine/socionics_data.js';
import { evaluateSocionicsTest } from './server/engine/socionics_engine.js';
import { generateIntegrativeAnalysis } from './server/engine/integrative_ai.js';
import { runAutomatedDiagnosticsTestSuite } from './server/engine/tests.js';
import { DiagnosticAnalysisRecord, PersonProfile } from './src/types/domain.js';
import { FullIntegrativeAnalysisRecord, SocionicsTestResult } from './src/types/socionics.js';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

// Prevent stale caching on mobile / PWA clients
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET' && !req.path.startsWith('/assets/')) {
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    res.setHeader('Pragma', 'no-cache');
    res.setHeader('Expires', '0');
  }
  next();
});

// Request logging middleware
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (req.path.startsWith('/api')) {
      logger.debug('Application', `${req.method} ${req.path} ${res.statusCode} in ${duration}ms`, { ip: req.ip });
    }
  });
  next();
});

// Auth helper middleware
function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const account = getAccountFromToken(authHeader);
  if (!account) {
    return res.status(401).json({ error: 'Unauthorized: Valid Bearer token required.' });
  }
  (req as any).account = account;
  next();
}

function optionalAuthenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;
  const account = getAccountFromToken(authHeader);
  (req as any).account = account || null;
  next();
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const account = (req as any).account;
  if (!account || account.role !== 'ADMIN') {
    logger.warn('Security', `Unauthorized Admin endpoint access attempt by account ${account?.id || 'anonymous'}`);
    return res.status(403).json({ error: 'Forbidden: Administrator privileges required.' });
  }
  next();
}

// ==========================================
// 1. AUTH & SESSION ROUTES
// ==========================================

app.get('/api/auth/me', optionalAuthenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  if (!account) {
    return res.json({
      account: null,
      token: null,
      subscription: null,
      permissions: {
        canRunMatrix: true,
        canRunAI: true,
        canCreateProfile: false,
        canAccessAdmin: false,
      },
    });
  }
  const subscription = db.subscriptions.get(account.id);
  res.json({
    account,
    token: account.token,
    subscription,
    permissions: {
      canRunMatrix: canAccess(account, 'RUN_FINANCIAL_MATRIX').allowed,
      canRunAI: canAccess(account, 'RUN_AI_DEEP_DIVE').allowed,
      canCreateProfile: canAccess(account, 'CREATE_PROFILE').allowed,
      canAccessAdmin: canAccess(account, 'ADMIN_CONSOLE').allowed,
    },
  });
});

app.post('/api/auth/register', (req: Request, res: Response) => {
  const { email, password, name, referralCode } = req.body;
  if (!email || !name) {
    return res.status(400).json({ error: 'Имя и email обязательны для регистрации.' });
  }

  try {
    const result = db.registerAccount({ email, password, name, referralCode });
    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Укажите email для входа.' });
  }

  try {
    const result = db.authenticateUser(email, password);
    res.json(result);
  } catch (err: any) {
    res.status(401).json({ error: err.message });
  }
});

app.post('/api/auth/google', (req: Request, res: Response) => {
  const { email, name, avatarUrl } = req.body;
  if (!email) {
    return res.status(400).json({ error: 'Email Google-аккаунта обязателен.' });
  }

  try {
    const result = db.authenticateGoogleUser({ email, name, avatarUrl });
    res.json(result);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
});

app.post('/api/auth/logout', authenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  logger.info('Authentication', `User logged out: ${account?.email}`);
  res.json({ success: true, message: 'Logged out successfully.' });
});

app.post('/api/auth/update-settings', authenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  const { theme, locale, notificationsEnabled, name } = req.body;
  if (name) account.name = name;
  if (theme || locale || notificationsEnabled !== undefined) {
    account.settings = {
      ...account.settings,
      ...(theme ? { theme } : {}),
      ...(locale ? { locale } : {}),
      ...(notificationsEnabled !== undefined ? { notificationsEnabled } : {}),
    };
  }
  db.accounts.set(account.id, account);
  res.json({ account });
});

app.post('/api/auth/switch-account', authenticate, (req: Request, res: Response) => {
  const currentAccount = (req as any).account;
  const sub = db.subscriptions.get(currentAccount.id);
  const isMasterDesAdmin = currentAccount && (
    currentAccount.id === 'acc_desadmin' ||
    currentAccount.email.toLowerCase() === 'desadmin' ||
    currentAccount.name.toLowerCase() === 'desadmin'
  );
  const hasAdminCapability = isMasterDesAdmin || currentAccount.role === 'ADMIN' || sub?.features?.includes('ADMIN_CONSOLE') || sub?.tier === 'ENTERPRISE';

  if (!hasAdminCapability) {
    return res.status(403).json({ error: 'Переключение роли доступно только пользователям с правами администратора.' });
  }

  const { targetRole } = req.body; // 'USER' | 'ADMIN'
  currentAccount.role = targetRole === 'ADMIN' ? 'ADMIN' : 'USER';
  db.accounts.set(currentAccount.id, currentAccount);
  logger.info('Application', `User ${currentAccount.email} switched active role view mode to ${currentAccount.role}`);
  res.json({ account: currentAccount });
});

// ==========================================
// 2. PERSON PROFILES (RLAC ENFORCED)
// ==========================================

app.get('/api/profiles', optionalAuthenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  if (!account) {
    return res.json({ profiles: [] });
  }
  const profiles = Array.from(db.profiles.values()).filter(p => p.accountId === account.id);
  res.json({ profiles });
});

app.post('/api/profiles', authenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  const accessCheck = canAccess(account, 'CREATE_PROFILE');
  if (!accessCheck.allowed) {
    return res.status(403).json({ error: accessCheck.reason });
  }

  const { relationType, firstName, lastName, birthDate, motherBirthDate, fatherBirthDate, occupation, monthlyIncomeBracket, financialGoals, notes } = req.body;

  if (!firstName || !birthDate) {
    return res.status(400).json({ error: 'First name and date of birth are required.' });
  }

  const profileId = 'prof_' + Math.random().toString(36).substring(2, 9);
  const newProfile: PersonProfile = {
    id: profileId,
    accountId: account.id,
    relationType: relationType || 'other',
    firstName,
    lastName: lastName || '',
    birthDate,
    motherBirthDate,
    fatherBirthDate,
    occupation,
    monthlyIncomeBracket,
    financialGoals,
    notes,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  db.profiles.set(profileId, newProfile);
  logger.info('Diagnostic', `Created profile ${profileId} (${firstName} ${lastName}, ${relationType}) for account ${account.id}`);
  res.status(201).json({ profile: newProfile });
});

app.put('/api/profiles/:id', authenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  try {
    const existing = verifyProfileAccess(account, req.params.id);
    const updated: PersonProfile = {
      ...existing,
      ...req.body,
      id: existing.id,
      accountId: existing.accountId,
      updatedAt: new Date().toISOString(),
    };
    db.profiles.set(existing.id, updated);
    logger.info('Diagnostic', `Updated profile ${existing.id} for account ${account.id}`);
    res.json({ profile: updated });
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
});

app.delete('/api/profiles/:id', authenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  try {
    const existing = verifyProfileAccess(account, req.params.id);
    db.profiles.delete(existing.id);
    logger.info('Diagnostic', `Deleted profile ${existing.id} for account ${account.id}`);
    res.json({ success: true, message: 'Profile deleted.' });
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
});

// ==========================================
// 3. DIAGNOSTIC MODULES & ENGINE
// ==========================================

app.get('/api/diagnostics/modules', (req: Request, res: Response) => {
  res.json({ modules: DIAGNOSTIC_MODULES_REGISTRY });
});

// Layer 1 Deterministic Calculation (Fast, Math-only, 0 AI)
app.post('/api/diagnostics/financial-matrix/calculate', optionalAuthenticate, (req: Request, res: Response) => {
  const { userBirthDate, motherBirthDate, fatherBirthDate } = req.body;
  if (!userBirthDate) {
    return res.status(400).json({ error: 'User birth date (DD.MM.YYYY or YYYY-MM-DD) is required.' });
  }

  try {
    const layer1Output = computeFinancialMatrix({
      userBirthDate,
      motherBirthDate,
      fatherBirthDate,
    });
    res.json({ layer1: layer1Output });
  } catch (err: any) {
    logger.error('Diagnostic', `Math calculation error: ${err.message}`);
    res.status(400).json({ error: err.message });
  }
});

// Layer 2 AI Synthesis (Cross-analysis with systems theory & behavioral economics)
app.post('/api/diagnostics/financial-matrix/analyze', optionalAuthenticate, async (req: Request, res: Response) => {
  const account = (req as any).account;
  if (account) {
    const accessCheck = canAccess(account, 'RUN_AI_DEEP_DIVE');
    if (!accessCheck.allowed) {
      return res.status(403).json({ error: accessCheck.reason });
    }
  }

  const { profileId, userBirthDate, motherBirthDate, fatherBirthDate } = req.body;
  const startTime = Date.now();

  try {
    let profile: PersonProfile;
    if (profileId && account) {
      profile = verifyProfileAccess(account, profileId);
    } else {
      // Ephemeral profile for ad-hoc calculation
      profile = {
        id: 'ephemeral_' + Math.random().toString(36).substring(2, 7),
        accountId: account?.id || 'guest',
        relationType: 'self',
        firstName: req.body.firstName || account?.name || 'Subject',
        lastName: req.body.lastName || '',
        birthDate: userBirthDate,
        motherBirthDate,
        fatherBirthDate,
        occupation: req.body.occupation,
        financialGoals: req.body.financialGoals,
        notes: req.body.notes,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    }

    // 1. Layer 1 Deterministic Math
    const layer1 = computeFinancialMatrix({
      userBirthDate: profile.birthDate,
      motherBirthDate: profile.motherBirthDate,
      fatherBirthDate: profile.fatherBirthDate,
    });

    // 2. Layer 2 AI Synthesis (Fault tolerant & Multilingual)
    const lang = (req.body.lang || (account?.settings?.locale?.startsWith('es') ? 'es' : account?.settings?.locale?.startsWith('en') ? 'en' : 'ru')) as 'ru' | 'en' | 'es';
    const layer2 = await generateLayer2Analysis(profile, layer1, lang);

    const recordId = 'diag_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const durationMs = Date.now() - startTime;

    const analysisRecord: DiagnosticAnalysisRecord = {
      id: recordId,
      accountId: account?.id || 'guest',
      profileId: profile.id,
      profileName: `${profile.firstName} ${profile.lastName}`.trim(),
      relationType: profile.relationType,
      moduleType: 'financial_matrix',
      algorithmVersion: ALGORITHM_VERSION,
      promptVersion: PROMPT_VERSION,
      status: 'COMPLETED',
      layer1,
      layer2,
      durationMs,
      createdAt: new Date().toISOString(),
    };

    if (account) {
      db.analyses.set(recordId, analysisRecord);
      logger.info('Diagnostic', `Diagnostic analysis ${recordId} completed and stored for profile ${profile.id} in ${durationMs}ms`);
    }

    res.json({ analysis: analysisRecord });
  } catch (err: any) {
    logger.error('Diagnostic', `Analysis synthesis pipeline failed: ${err.message}`, { error: err.stack });
    res.status(500).json({ error: `Diagnostic pipeline failed: ${err.message}` });
  }
});

// History of runs
app.get('/api/diagnostics/history', optionalAuthenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  if (!account) {
    return res.json({ history: [] });
  }
  const history = Array.from(db.analyses.values())
    .filter(a => a.accountId === account.id)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ history });
});

app.get('/api/diagnostics/history/:id', authenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  const record = db.analyses.get(req.params.id);
  if (!record || (record.accountId !== account.id && account.role !== 'ADMIN')) {
    return res.status(404).json({ error: 'Analysis record not found.' });
  }
  res.json({ analysis: record });
});

app.delete('/api/diagnostics/history/:id', authenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  const record = db.analyses.get(req.params.id);
  if (!record || (record.accountId !== account.id && account.role !== 'ADMIN')) {
    return res.status(404).json({ error: 'Analysis record not found.' });
  }
  db.analyses.delete(req.params.id);
  res.json({ success: true, message: 'Record deleted.' });
});

// ==========================================
// 3.1 SOCIONICS DIAGNOSTIC MODULE
// ==========================================

// Get all 30 psychometric screens (multilingual)
app.get('/api/diagnostics/socionics/screens', (req: Request, res: Response) => {
  res.json({ screens: SOCIONICS_SCREENS });
});

// Evaluate submitted answers
app.post('/api/diagnostics/socionics/evaluate', optionalAuthenticate, (req: Request, res: Response) => {
  const { answers, profileId, profileName } = req.body;
  if (!answers || typeof answers !== 'object') {
    return res.status(400).json({ error: 'Answers dictionary is required (keys 1..30 with values A..E).' });
  }

  try {
    const result = evaluateSocionicsTest(answers);
    if (profileId) {
      result.profileId = profileId;
    }
    if (profileName) {
      result.profileName = profileName;
    }

    const account = (req as any).account;
    if (account) {
      db.socionicsResults.set(result.id, { ...result, accountId: account.id });
    } else {
      db.socionicsResults.set(result.id, { ...result, accountId: 'guest' });
    }

    logger.info('Diagnostic', `Evaluated test ${result.id}: Sociotype ${result.sociotype.primary} (${result.quadra.classic} Quadra)`);
    res.json({ result });
  } catch (err: any) {
    logger.error('Diagnostic', `Evaluation failed: ${err.message}`);
    res.status(500).json({ error: `Socionics evaluation failed: ${err.message}` });
  }
});

// Get saved socionics results history
app.get('/api/diagnostics/socionics/history', optionalAuthenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  if (!account) {
    return res.json({ history: [] });
  }
  const history = Array.from(db.socionicsResults.values())
    .filter((r: any) => r.accountId === account.id)
    .sort((a: any, b: any) => new Date(b.completedAt).getTime() - new Date(a.completedAt).getTime());
  res.json({ history });
});

// Get specific socionics result
app.get('/api/diagnostics/socionics/results/:id', optionalAuthenticate, (req: Request, res: Response) => {
  const result = db.socionicsResults.get(req.params.id);
  if (!result) {
    return res.status(404).json({ error: 'Socionics test result not found.' });
  }
  res.json({ result });
});

// ==========================================
// 3.2 4-LAYER INTEGRATIVE BEHAVIORAL ANALYSIS
// ==========================================

app.post('/api/diagnostics/integrative/analyze', optionalAuthenticate, async (req: Request, res: Response) => {
  const account = (req as any).account;
  if (account) {
    const accessCheck = canAccess(account, 'RUN_AI_DEEP_DIVE');
    if (!accessCheck.allowed) {
      return res.status(403).json({ error: accessCheck.reason });
    }
  }

  const {
    profileId,
    subjectName,
    birthDate,
    motherBirthDate,
    fatherBirthDate,
    socionicsResultId,
    socionicsAnswers,
    lang,
  } = req.body;

  const startTime = Date.now();

  try {
    let finalProfileName = subjectName || 'Client';
    let finalBirthDate = birthDate;
    let finalMotherBirthDate = motherBirthDate;
    let finalFatherBirthDate = fatherBirthDate;

    if (profileId && account) {
      const p = verifyProfileAccess(account, profileId);
      finalProfileName = `${p.firstName} ${p.lastName}`.trim();
      finalBirthDate = p.birthDate;
      finalMotherBirthDate = p.motherBirthDate;
      finalFatherBirthDate = p.fatherBirthDate;
    }

    if (!finalBirthDate) {
      return res.status(400).json({ error: 'Subject birth date is required for integrative analysis.' });
    }

    // 1. Compute Layer 1 Financial Matrix
    const layer1 = computeFinancialMatrix({
      userBirthDate: finalBirthDate,
      motherBirthDate: finalMotherBirthDate,
      fatherBirthDate: finalFatherBirthDate,
    });

    // 2. Resolve Socionics Result
    let socResult: SocionicsTestResult;
    if (socionicsResultId && db.socionicsResults.has(socionicsResultId)) {
      socResult = db.socionicsResults.get(socionicsResultId);
    } else if (socionicsAnswers && typeof socionicsAnswers === 'object') {
      socResult = evaluateSocionicsTest(socionicsAnswers);
      socResult.profileName = finalProfileName;
      if (account) db.socionicsResults.set(socResult.id, { ...socResult, accountId: account.id });
    } else {
      // Create representative socionics baseline if not provided
      socResult = evaluateSocionicsTest({
        1: 'A', 2: 'B', 3: 'A', 4: 'C', 5: 'A', 6: 'C', 7: 'A', 8: 'A', 9: 'A', 10: 'C',
        11: 'A', 12: 'A', 13: 'A', 14: 'A', 15: 'A', 16: 'A', 17: 'A', 18: 'A', 19: 'A', 20: 'A',
        21: 'A', 22: 'A', 23: 'A', 24: 'A', 25: 'A', 26: 'A', 27: 'A', 28: 'A', 29: 'A', 30: 'A',
      });
      socResult.profileName = finalProfileName;
    }

    // 3. Resolve preferred language
    const preferredLang = (lang || (account?.settings?.locale?.startsWith('es') ? 'es' : account?.settings?.locale?.startsWith('en') ? 'en' : 'ru')) as 'ru' | 'en' | 'es';

    // 4. Generate Layer 2 Matrix behavioral report as input
    const dummyProfile: PersonProfile = {
      id: profileId || 'tmp_profile',
      accountId: account?.id || 'guest',
      relationType: 'self',
      firstName: finalProfileName,
      lastName: '',
      birthDate: finalBirthDate,
      motherBirthDate: finalMotherBirthDate,
      fatherBirthDate: finalFatherBirthDate,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const layer2 = await generateLayer2Analysis(dummyProfile, layer1, preferredLang);

    // 5. Generate the 4-Layer Integrative Report
    const integrativeReport = await generateIntegrativeAnalysis({
      subjectName: finalProfileName,
      birthDate: finalBirthDate,
      layer1Matrix: layer1,
      layer2Matrix: layer2,
      socionicsResult: socResult,
      lang: preferredLang,
    });

    const fullRecord: FullIntegrativeAnalysisRecord = {
      id: `int_rec_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      accountId: account?.id || 'guest',
      profileId: profileId || 'standalone',
      profileName: finalProfileName,
      createdAt: new Date().toISOString(),
      layer1Matrix: layer1,
      layer2Matrix: layer2,
      socionicsResult: socResult,
      integrativeReport,
      durationMs: Date.now() - startTime,
      status: 'COMPLETED',
    };

    db.integrativeReports.set(fullRecord.id, fullRecord);

    logger.info('AI', `Generated 4-layer report ${fullRecord.id} for ${finalProfileName} in ${fullRecord.durationMs}ms`);
    res.json({ record: fullRecord });
  } catch (err: any) {
    logger.error('AI', `Integrative pipeline error: ${err.message}`, { stack: err.stack });
    res.status(500).json({ error: `Integrative pipeline failed: ${err.message}` });
  }
});

app.get('/api/diagnostics/integrative/history', optionalAuthenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  if (!account) {
    return res.json({ history: [] });
  }
  const history = Array.from(db.integrativeReports.values())
    .filter((r: any) => r.accountId === account.id)
    .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  res.json({ history });
});

app.get('/api/diagnostics/integrative/:id', optionalAuthenticate, (req: Request, res: Response) => {
  const record = db.integrativeReports.get(req.params.id);
  if (!record) {
    return res.status(404).json({ error: 'Integrative analysis record not found.' });
  }
  res.json({ record });
});

// ==========================================
// 4. SUBSCRIPTIONS & REFERRALS
// ==========================================

app.get('/api/subscriptions/current', authenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  const sub = db.subscriptions.get(account.id);
  res.json({ subscription: sub });
});

app.post('/api/subscriptions/upgrade', authenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  const { tier } = req.body; // 'PRO_MONTHLY' | 'ENTERPRISE'
  const sub = db.subscriptions.get(account.id);
  if (!sub) return res.status(404).json({ error: 'Subscription not found.' });

  sub.tier = tier || 'PRO_MONTHLY';
  sub.status = 'active';
  sub.maxProfiles = tier === 'ENTERPRISE' ? 100 : 25;
  sub.features = ['RUN_FINANCIAL_MATRIX', 'RUN_AI_DEEP_DIVE', 'CREATE_PROFILE', 'EXPORT_REPORT', 'UNLIMITED_PROFILES'];
  
  const newEndDate = new Date();
  newEndDate.setMonth(newEndDate.getMonth() + 1);
  sub.endDate = newEndDate.toISOString();

  db.subscriptions.set(account.id, sub);
  account.subscriptionTier = tier;
  db.accounts.set(account.id, account);

  logger.info('Subscription', `Account ${account.id} upgraded to tier ${tier}`);
  res.json({ subscription: sub });
});

app.get('/api/referrals/stats', optionalAuthenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  if (!account) {
    return res.json({ stats: null });
  }
  const history = Array.from(db.referrals.values()).filter(r => r.referrerAccountId === account.id);
  const convertedCount = history.filter(r => r.status === 'CONVERTED').length;
  const sub = db.subscriptions.get(account.id);

  const stats = {
    referralCode: account.referralCode,
    referralLink: `${process.env.APP_URL || 'https://diagnostic.io'}?ref=${account.referralCode}`,
    totalInvites: history.length,
    convertedCount,
    rewardMonthsEarned: Math.floor(convertedCount / 5),
    conversionsTowardsNextMonth: convertedCount % 5,
    appliedMonths: sub?.referralCreditsApplied || 0,
    history,
  };
  res.json({ stats });
});

app.post('/api/referrals/simulate-conversion', authenticate, (req: Request, res: Response) => {
  const account = (req as any).account;
  const { refereeEmail } = req.body;
  const refId = 'ref_' + Math.random().toString(36).substring(2, 9);
  
  const newRef = {
    id: refId,
    referrerAccountId: account.id,
    refereeAccountId: 'acc_referee_' + Math.random().toString(36).substring(2, 6),
    refereeEmail: refereeEmail || `colleague_${Date.now()}@firm.com`,
    status: 'CONVERTED' as const,
    convertedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  };

  db.referrals.set(refId, newRef);
  const rewardResult = db.checkAndApplyReferralRewards(account.id);

  logger.info('Referral', `Simulated referral conversion for referrer ${account.id}`, { rewardResult });
  res.json({ referral: newRef, rewardResult });
});

// ==========================================
// 5. ADMIN CONSOLE & AUDIT (RBAC PROTECTED)
// ==========================================

app.get('/api/admin/metrics', authenticate, requireAdmin, (req: Request, res: Response) => {
  const totalAccounts = db.accounts.size;
  const totalProfiles = db.profiles.size;
  const totalAnalyses = db.analyses.size;
  const totalReferrals = db.referrals.size;
  const proSubscribers = Array.from(db.subscriptions.values()).filter(s => s.status === 'active').length;

  res.json({
    metrics: {
      totalAccounts,
      totalProfiles,
      totalAnalyses,
      totalReferrals,
      proSubscribers,
      activeModules: DIAGNOSTIC_MODULES_REGISTRY.filter(m => m.status === 'ACTIVE').length,
      systemUptimeSeconds: Math.floor(process.uptime()),
      memoryUsageMB: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
    },
  });
});

app.get('/api/admin/accounts', authenticate, requireAdmin, (req: Request, res: Response) => {
  const accounts = Array.from(db.accounts.values()).map(acc => {
    const sub = db.subscriptions.get(acc.id);
    const profileCount = Array.from(db.profiles.values()).filter(p => p.accountId === acc.id).length;
    const analysisCount = Array.from(db.analyses.values()).filter(a => a.accountId === acc.id).length;
    return {
      ...acc,
      subscription: sub,
      profileCount,
      analysisCount,
    };
  });
  res.json({ accounts });
});

app.get('/api/admin/logs', authenticate, requireAdmin, (req: Request, res: Response) => {
  const { category, level, search, limit } = req.query;
  const logs = logger.getLogs({
    category: category as any,
    level: level as string,
    search: search as string,
    limit: limit ? parseInt(limit as string, 10) : 150,
  });
  res.json({ logs });
});

app.get('/api/admin/audit', authenticate, requireAdmin, (req: Request, res: Response) => {
  res.json({ auditLogs: db.auditLogs });
});

// Admin Account Detail Inspection
app.get('/api/admin/accounts/:id/details', authenticate, requireAdmin, (req: Request, res: Response) => {
  const { id } = req.params;
  const targetAcc = db.accounts.get(id);
  if (!targetAcc) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const sub = db.subscriptions.get(id);
  const profiles = Array.from(db.profiles.values()).filter(p => p.accountId === id);
  const analyses = Array.from(db.analyses.values()).filter(a => a.accountId === id);
  const referrals = Array.from(db.referrals.values()).filter(r => r.referrerAccountId === id || r.refereeAccountId === id);

  res.json({
    account: targetAcc,
    subscription: sub,
    profiles,
    analyses,
    referrals,
  });
});

// Admin Update Account (Role, Subscription, etc.)
app.put('/api/admin/accounts/:id', authenticate, requireAdmin, (req: Request, res: Response) => {
  const adminAccount = (req as any).account;
  const { id } = req.params;
  const { role, subscriptionTier, endDate, maxProfiles, name, email } = req.body;

  const targetAcc = db.accounts.get(id);
  if (!targetAcc) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const previousRole = targetAcc.role;
  if (role) targetAcc.role = role;
  if (name) targetAcc.name = name;
  if (email) targetAcc.email = email;
  if (subscriptionTier) targetAcc.subscriptionTier = subscriptionTier;

  db.accounts.set(id, targetAcc);

  let sub = db.subscriptions.get(id);
  if (!sub) {
    sub = {
      id: 'sub_' + Math.random().toString(36).substring(2, 7),
      accountId: id,
      tier: targetAcc.subscriptionTier,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      maxProfiles: targetAcc.role === 'ADMIN' ? 100 : 25,
      features: targetAcc.role === 'ADMIN'
        ? ['RUN_FINANCIAL_MATRIX', 'RUN_AI_DEEP_DIVE', 'CREATE_PROFILE', 'EXPORT_REPORT', 'UNLIMITED_PROFILES', 'ADMIN_CONSOLE', 'VIEW_AUDIT_LOGS']
        : ['RUN_FINANCIAL_MATRIX', 'RUN_AI_DEEP_DIVE', 'CREATE_PROFILE', 'EXPORT_REPORT'],
      referralCreditsApplied: 0,
    };
  } else {
    if (role === 'ADMIN') {
      if (!sub.features.includes('ADMIN_CONSOLE')) sub.features.push('ADMIN_CONSOLE');
      if (!sub.features.includes('VIEW_AUDIT_LOGS')) sub.features.push('VIEW_AUDIT_LOGS');
      sub.tier = 'ENTERPRISE';
      targetAcc.subscriptionTier = 'ENTERPRISE';
    } else if (role === 'USER') {
      sub.features = sub.features.filter(f => f !== 'ADMIN_CONSOLE' && f !== 'VIEW_AUDIT_LOGS');
    }
    if (subscriptionTier) sub.tier = subscriptionTier;
    if (endDate) sub.endDate = endDate;
    if (maxProfiles) sub.maxProfiles = maxProfiles;
  }
  db.subscriptions.set(id, sub);

  db.recordAuditLog(adminAccount.id, adminAccount.email, 'UPDATE_ACCOUNT', 'Account', id, {
    previousRole,
    newRole: targetAcc.role,
    subscriptionTier,
    endDate,
  });

  logger.info('AdminAudit', `Admin ${adminAccount.email} updated account ${targetAcc.email} (${targetAcc.id}): Role=${targetAcc.role}`);

  res.json({ account: targetAcc, subscription: sub });
});

// Admin Quick Role Change Endpoint
app.patch('/api/admin/accounts/:id/role', authenticate, requireAdmin, (req: Request, res: Response) => {
  const adminAccount = (req as any).account;
  const { id } = req.params;
  const { role } = req.body; // 'USER' | 'ADMIN'

  if (role !== 'USER' && role !== 'ADMIN') {
    return res.status(400).json({ error: 'Недопустимая роль. Доступны только USER или ADMIN.' });
  }

  const targetAcc = db.accounts.get(id);
  if (!targetAcc) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const prevRole = targetAcc.role;
  targetAcc.role = role;
  if (role === 'ADMIN') {
    targetAcc.subscriptionTier = 'ENTERPRISE';
  }
  db.accounts.set(id, targetAcc);

  let sub = db.subscriptions.get(id);
  if (!sub) {
    sub = {
      id: 'sub_' + Math.random().toString(36).substring(2, 7),
      accountId: id,
      tier: role === 'ADMIN' ? 'ENTERPRISE' : 'FREE_TRIAL',
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      maxProfiles: role === 'ADMIN' ? 100 : 25,
      features: role === 'ADMIN'
        ? ['RUN_FINANCIAL_MATRIX', 'RUN_AI_DEEP_DIVE', 'CREATE_PROFILE', 'EXPORT_REPORT', 'UNLIMITED_PROFILES', 'ADMIN_CONSOLE', 'VIEW_AUDIT_LOGS']
        : ['RUN_FINANCIAL_MATRIX', 'RUN_AI_DEEP_DIVE', 'CREATE_PROFILE', 'EXPORT_REPORT'],
      referralCreditsApplied: 0,
    };
  } else {
    if (role === 'ADMIN') {
      if (!sub.features.includes('ADMIN_CONSOLE')) sub.features.push('ADMIN_CONSOLE');
      if (!sub.features.includes('VIEW_AUDIT_LOGS')) sub.features.push('VIEW_AUDIT_LOGS');
      sub.tier = 'ENTERPRISE';
    } else {
      sub.features = sub.features.filter(f => f !== 'ADMIN_CONSOLE' && f !== 'VIEW_AUDIT_LOGS');
    }
  }
  db.subscriptions.set(id, sub);

  db.recordAuditLog(adminAccount.id, adminAccount.email, 'CHANGE_USER_ROLE', 'Account', id, {
    prevRole,
    newRole: role,
  });

  logger.info('AdminAudit', `Admin ${adminAccount.email} changed role for user ${targetAcc.email} from ${prevRole} to ${role}`);

  res.json({ success: true, account: targetAcc, subscription: sub });
});

// Admin Delete Account
app.delete('/api/admin/accounts/:id', authenticate, requireAdmin, (req: Request, res: Response) => {
  const adminAccount = (req as any).account;
  const { id } = req.params;

  if (id === adminAccount.id) {
    return res.status(400).json({ error: 'Нельзя удалить собственный аккаунт администратора.' });
  }

  db.accounts.delete(id);
  db.subscriptions.delete(id);
  // delete related profiles
  for (const [profId, prof] of db.profiles.entries()) {
    if (prof.accountId === id) db.profiles.delete(profId);
  }

  db.recordAuditLog(adminAccount.id, adminAccount.email, 'DELETE_ACCOUNT', 'Account', id);
  res.json({ success: true });
});

// Admin Diagnostic Modules Management
app.get('/api/admin/modules', authenticate, requireAdmin, (req: Request, res: Response) => {
  res.json({ modules: Array.from(db.modules.values()) });
});

app.put('/api/admin/modules/:id', authenticate, requireAdmin, (req: Request, res: Response) => {
  const adminAccount = (req as any).account;
  const { id } = req.params;
  const { title, status, version, description, theoreticalFrameworks, specificationStatus } = req.body;

  const existing = db.modules.get(id);
  const updatedModule = {
    id: (id as any),
    title: title || existing?.title || id,
    status: status || existing?.status || 'PLANNED',
    version: version || existing?.version || '1.0.0',
    description: description || existing?.description || '',
    theoreticalFrameworks: theoreticalFrameworks || existing?.theoreticalFrameworks || [],
    specificationStatus,
  };

  db.modules.set(id, updatedModule);
  db.recordAuditLog(adminAccount.id, adminAccount.email, 'UPDATE_MODULE', 'DiagnosticModule', id, updatedModule);

  res.json({ module: updatedModule });
});

app.post('/api/admin/modules', authenticate, requireAdmin, (req: Request, res: Response) => {
  const adminAccount = (req as any).account;
  const { id, title, status, version, description, theoreticalFrameworks, specificationStatus } = req.body;

  if (!id || !title) {
    return res.status(400).json({ error: 'ID и название модуля обязательны.' });
  }

  const newModule = {
    id: id.toLowerCase().replace(/\s+/g, '_'),
    title,
    status: status || 'PLANNED',
    version: version || '0.1.0',
    description: description || '',
    theoreticalFrameworks: theoreticalFrameworks || [],
    specificationStatus,
  };

  db.modules.set(newModule.id, newModule as any);
  db.recordAuditLog(adminAccount.id, adminAccount.email, 'CREATE_MODULE', 'DiagnosticModule', newModule.id, newModule);

  res.status(201).json({ module: newModule });
});

// Admin Form Fields & Content Configuration
app.get('/api/config/fields', (req: Request, res: Response) => {
  res.json({
    fields: Array.from(db.fieldConfigs.values()),
    content: db.contentSections,
  });
});

app.put('/api/admin/fields/:key', authenticate, requireAdmin, (req: Request, res: Response) => {
  const adminAccount = (req as any).account;
  const { key } = req.params;
  const { label, description, placeholder, required, enabled } = req.body;

  const current = db.fieldConfigs.get(key) || {
    key,
    label: key,
    required: false,
    enabled: true,
  };

  const updated = {
    ...current,
    ...(label !== undefined ? { label } : {}),
    ...(description !== undefined ? { description } : {}),
    ...(placeholder !== undefined ? { placeholder } : {}),
    ...(required !== undefined ? { required } : {}),
    ...(enabled !== undefined ? { enabled } : {}),
  };

  db.fieldConfigs.set(key, updated);
  db.recordAuditLog(adminAccount.id, adminAccount.email, 'UPDATE_FORM_FIELD', 'FormFieldConfig', key, updated);

  res.json({ field: updated });
});

app.get('/api/admin/content-config', authenticate, requireAdmin, (req: Request, res: Response) => {
  res.json({
    content: db.contentSections,
    fields: Array.from(db.fieldConfigs.values()),
  });
});

app.put('/api/admin/content-config', authenticate, requireAdmin, (req: Request, res: Response) => {
  const adminAccount = (req as any).account;
  const { invariantNotice, methodologyDisclaimer, referralTerms, supportEmail } = req.body;

  if (invariantNotice) db.contentSections.invariantNotice = invariantNotice;
  if (methodologyDisclaimer) db.contentSections.methodologyDisclaimer = methodologyDisclaimer;
  if (referralTerms) db.contentSections.referralTerms = referralTerms;
  if (supportEmail) db.contentSections.supportEmail = supportEmail;

  db.recordAuditLog(adminAccount.id, adminAccount.email, 'UPDATE_CONTENT_CONFIG', 'ContentConfig', 'global', db.contentSections as unknown as Record<string, unknown>);
  res.json({ content: db.contentSections });
});

// ==========================================
// 6. AUTOMATED TEST SUITE RUNNER
// ==========================================

app.post('/api/tests/run', authenticate, (req: Request, res: Response) => {
  const suiteResults = runAutomatedDiagnosticsTestSuite();
  logger.info('Application', `Executed automated diagnostics test suite (${suiteResults.summary.passed}/${suiteResults.summary.total} passed)`);
  res.json({ suite: suiteResults });
});

// ==========================================
// 7. VITE DEV SERVER / STATIC SERVE
// ==========================================

async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req: Request, res: Response) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    logger.info('Application', `PWA Diagnostic Engine server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
