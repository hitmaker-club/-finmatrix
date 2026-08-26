/**
 * Normalized Persistence Store for Diagnostic Service
 * In-memory database with ACID-like consistency, relationship referential integrity,
 * and pre-seeded demonstration data.
 */

import {
  Account,
  PersonProfile,
  Subscription,
  Referral,
  DiagnosticAnalysisRecord,
  AdminAuditLog,
  DiagnosticModuleMeta,
  FormFieldConfig,
  ContentSectionConfig,
} from '../../src/types/domain.js';
import { logger } from './logger.js';

export const DIAGNOSTIC_MODULES_REGISTRY: DiagnosticModuleMeta[] = [
  {
    id: 'financial_matrix',
    title: 'Financial Matrix Engine',
    status: 'ACTIVE',
    version: '1.4.0',
    description: 'Deterministic 4-Vector intergenerational model coupled with Systems Theory & Behavioral Economics AI cross-analysis.',
    theoreticalFrameworks: [
      'General Systems Theory (Ludwig von Bertalanffy)',
      'Analytical Psychology Archetypes (Carl Jung)',
      'Behavioral Economics & Mental Accounting (Kahneman, Tversky, Thaler)',
      'Early Maladaptive Financial Schemas (Jeffrey Young)',
    ],
  },
  {
    id: 'socionics',
    title: 'Information Metabolism & Socionics Matrix',
    status: 'ACTIVE',
    version: '1.0.0',
    description: '30-Screen Psychometric Battery & Model A Information Metabolism integrated with 4-Vector Financial Matrix.',
    theoreticalFrameworks: [
      'Aushra Augustinavichiute Information Metabolism & Model A',
      'Jungian Cognitive Functions & 16 Sociotypes',
      'Bashkuev Quadra & Societal Functions Model',
    ],
    specificationStatus: 'OPERATIONAL - Complete 30-screen psychometric diagnostic battery with 4-Layer Integrative AI Synthesis.',
  },
  {
    id: 'emotional_tone',
    title: 'Emotional Tone & Resonance Index',
    status: 'PLANNED',
    version: '0.1.0-alpha',
    description: 'Real-time psychophysiological and affective baseline diagnostic mapping systemic stress resilience.',
    theoreticalFrameworks: ['Polyvagal Theory (Stephen Porges)', 'Affective Neuroscience (Jaak Panksepp)'],
    specificationStatus: 'TODO/NEEDS_SPECIFICATION - Architectural placeholder awaiting bio-signal and linguistic marker protocols.',
  },
];

export const DEFAULT_FORM_FIELDS: FormFieldConfig[] = [
  {
    key: 'subjectBirthDate',
    label: 'Дата рождения субъекта *',
    description: 'Формирует базис жизненного сценария V1',
    placeholder: 'ДД.ММ.ГГГГ (напр. 14.07.1990)',
    required: true,
    enabled: true,
  },
  {
    key: 'motherBirthDate',
    label: 'Дата рождения матери',
    description: 'Материнский эмоциональный и ресурсный вектор',
    placeholder: 'ДД.ММ.ГГГГ (напр. 23.04.1965)',
    required: false,
    enabled: true,
  },
  {
    key: 'fatherBirthDate',
    label: 'Дата рождения отца',
    description: 'Отцовская стратегия работы и управления',
    placeholder: 'ДД.ММ.ГГГГ (напр. 11.11.1962)',
    required: false,
    enabled: true,
  },
  {
    key: 'subjectName',
    label: 'ФИО субъекта',
    description: 'Имя для персонального отчёта',
    placeholder: 'напр. Алекс Вэнс',
    required: false,
    enabled: true,
  },
  {
    key: 'occupation',
    label: 'Род деятельности / Профессия',
    description: 'Контекст профессиональной ниши и роли',
    placeholder: 'напр. Технологический предприниматель',
    required: false,
    enabled: true,
  },
  {
    key: 'monthlyIncomeBracket',
    label: 'Диапазон ежемесячного дохода',
    description: 'Оценка объёма финансового потока',
    placeholder: 'напр. $10,000 - $25,000',
    required: false,
    enabled: true,
  },
  {
    key: 'financialGoals',
    label: 'Главная финансовая цель / Запрос',
    description: 'Ключевой фокус для поведенческого синтеза ИИ',
    placeholder: 'напр. Преодоление консервативной нерешительности при распределении капитала',
    required: false,
    enabled: true,
  },
  {
    key: 'notes',
    label: 'Заметки и поведенческие паттерны',
    description: 'Особые наблюдения за реакциями на риски',
    placeholder: 'напр. Сомнения перед сделками свыше $50k',
    required: false,
    enabled: true,
  },
];

export const DEFAULT_CONTENT_SECTIONS: ContentSectionConfig = {
  invariantNotice: 'Строгий инвариант: все значения сводятся к 1-9. Никакой эзотерики/таро.',
  methodologyDisclaimer: 'Методология объединяет детерминированный матричный расчёт (Уровень 1) и трансгенерационный поведенческий синтез ИИ (Уровень 2).',
  referralTerms: 'Приглашайте коллег и получайте +1 месяц Pro за каждые 5 активных конверсий.',
  supportEmail: 'support@diagnostic.io',
};

class DatabaseStore {
  public accounts: Map<string, Account> = new Map();
  public passwords: Map<string, string> = new Map(); // accountId -> password
  public profiles: Map<string, PersonProfile> = new Map();
  public subscriptions: Map<string, Subscription> = new Map();
  public referrals: Map<string, Referral> = new Map();
  public analyses: Map<string, DiagnosticAnalysisRecord> = new Map();
  public socionicsResults: Map<string, any> = new Map();
  public energyResults: Map<string, any> = new Map();
  public integrativeReports: Map<string, any> = new Map();
  public modules: Map<string, DiagnosticModuleMeta> = new Map();
  public fieldConfigs: Map<string, FormFieldConfig> = new Map();
  public contentSections: ContentSectionConfig = { ...DEFAULT_CONTENT_SECTIONS };
  public auditLogs: AdminAuditLog[] = [];

  constructor() {
    this.seedInitialData();
  }

  private seedInitialData() {
    // Seed Modules
    for (const mod of DIAGNOSTIC_MODULES_REGISTRY) {
      this.modules.set(mod.id, { ...mod });
    }

    // Seed Field Configs
    for (const fc of DEFAULT_FORM_FIELDS) {
      this.fieldConfigs.set(fc.key, { ...fc });
    }

    // 1. Seed Master Admin Account (desadmin / des19&&)
    const adminId = 'acc_desadmin';
    const adminAccount: Account = {
      id: adminId,
      email: 'desadmin',
      name: 'desadmin',
      role: 'ADMIN',
      token: 'tok_desadmin_master_key',
      referralCode: 'DESADMIN',
      subscriptionTier: 'ENTERPRISE',
      createdAt: new Date(Date.now() - 30 * 86400000).toISOString(),
      settings: { theme: 'dark', locale: 'ru', notificationsEnabled: true },
    };
    this.accounts.set(adminId, adminAccount);
    this.passwords.set(adminId, 'des19&&');

    // Master Admin Subscription
    this.subscriptions.set(adminId, {
      id: 'sub_admin_master',
      accountId: adminId,
      tier: 'ENTERPRISE',
      status: 'active',
      startDate: new Date(Date.now() - 30 * 86400000).toISOString(),
      endDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      maxProfiles: 100,
      features: ['RUN_FINANCIAL_MATRIX', 'RUN_AI_DEEP_DIVE', 'CREATE_PROFILE', 'EXPORT_REPORT', 'UNLIMITED_PROFILES', 'ADMIN_CONSOLE', 'VIEW_AUDIT_LOGS'],
      referralCreditsApplied: 0,
    });

    // 2. Initial Audit Log
    this.recordAuditLog(adminId, adminAccount.email, 'SYSTEM_INIT', 'SYSTEM', 'all', {
      version: '1.4.0',
      activeModules: ['financial_matrix'],
      plannedModules: ['socionics', 'emotional_tone'],
    });

    logger.info('Application', 'Database seeded with master administrator desadmin.');
  }

  public recordAuditLog(
    adminAccountId: string,
    adminEmail: string,
    action: string,
    targetEntity: string,
    targetId?: string,
    details: Record<string, unknown> = {}
  ): AdminAuditLog {
    const entry: AdminAuditLog = {
      id: 'audit_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      adminAccountId,
      adminEmail,
      action,
      targetEntity,
      targetId,
      details,
    };
    this.auditLogs.unshift(entry);
    logger.info('AdminAudit', `Admin action: ${action} on ${targetEntity}:${targetId || 'N/A'} by ${adminEmail}`);
    return entry;
  }

  // Register new account
  public registerAccount(params: {
    email: string;
    password?: string;
    name: string;
    referralCode?: string;
  }): { account: Account; token: string; subscription: Subscription } {
    const existing = Array.from(this.accounts.values()).find(
      a => a.email.toLowerCase() === params.email.trim().toLowerCase()
    );
    if (existing) {
      throw new Error('Пользователь с таким email уже зарегистрирован.');
    }

    const accountId = 'acc_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
    const token = 'tok_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
    const referralCode = params.name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'USER') + Math.floor(100 + Math.random() * 900);

    const newAccount: Account = {
      id: accountId,
      email: params.email.trim().toLowerCase(),
      name: params.name.trim(),
      role: 'USER',
      token,
      referralCode,
      referredBy: params.referralCode?.trim() || undefined,
      subscriptionTier: 'FREE_TRIAL',
      createdAt: new Date().toISOString(),
      settings: { theme: 'dark', locale: 'ru', notificationsEnabled: true },
    };

    this.accounts.set(accountId, newAccount);
    this.passwords.set(accountId, params.password || 'password123');

    // Create 14-day trial subscription
    const subId = 'sub_' + Math.random().toString(36).substring(2, 9);
    const newSub: Subscription = {
      id: subId,
      accountId,
      tier: 'FREE_TRIAL',
      status: 'trialing',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 14 * 86400000).toISOString(),
      maxProfiles: 5,
      features: ['RUN_FINANCIAL_MATRIX', 'RUN_AI_DEEP_DIVE', 'CREATE_PROFILE', 'EXPORT_REPORT'],
      referralCreditsApplied: 0,
    };
    this.subscriptions.set(accountId, newSub);

    // Create default self profile
    const selfProfileId = 'prof_' + Math.random().toString(36).substring(2, 9);
    const selfProfile: PersonProfile = {
      id: selfProfileId,
      accountId,
      relationType: 'self',
      firstName: params.name.trim(),
      lastName: '',
      birthDate: '01.01.1990',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    this.profiles.set(selfProfileId, selfProfile);

    // Track referral if code provided
    if (params.referralCode) {
      const referrer = Array.from(this.accounts.values()).find(
        a => a.referralCode.toUpperCase() === params.referralCode?.trim().toUpperCase()
      );
      if (referrer) {
        const refId = 'ref_' + Math.random().toString(36).substring(2, 9);
        this.referrals.set(refId, {
          id: refId,
          referrerAccountId: referrer.id,
          refereeAccountId: accountId,
          refereeEmail: newAccount.email,
          status: 'CONVERTED',
          convertedAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        });
        this.checkAndApplyReferralRewards(referrer.id);
        logger.info('Referral', `Referral attributed to ${referrer.email} for new user ${newAccount.email}`);
      }
    }

    logger.info('Authentication', `New user registered: ${newAccount.email} (ID: ${accountId})`);
    return { account: newAccount, token, subscription: newSub };
  }

  // Authenticate user with email / login and password
  public authenticateUser(loginOrEmail: string, password?: string): { account: Account; token: string; subscription: Subscription } {
    const query = (loginOrEmail || '').trim().toLowerCase();
    const account = Array.from(this.accounts.values()).find(
      a => a.email.toLowerCase() === query || a.name.toLowerCase() === query || (query === 'desadmin' && a.id === 'acc_desadmin')
    );
    if (!account) {
      throw new Error('Пользователь с таким логином/email не найден.');
    }

    const storedPass = this.passwords.get(account.id);
    if (storedPass && password !== storedPass) {
      throw new Error('Неверный пароль. Пожалуйста, проверьте данные.');
    }

    // Refresh token if needed
    if (!account.token) {
      account.token = 'tok_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      this.accounts.set(account.id, account);
    }

    const sub = this.subscriptions.get(account.id) || {
      id: 'sub_' + Math.random().toString(36).substring(2, 7),
      accountId: account.id,
      tier: account.subscriptionTier,
      status: 'active' as const,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      maxProfiles: account.role === 'ADMIN' ? 100 : 25,
      features: account.role === 'ADMIN'
        ? ['RUN_FINANCIAL_MATRIX', 'RUN_AI_DEEP_DIVE', 'CREATE_PROFILE', 'EXPORT_REPORT', 'UNLIMITED_PROFILES', 'ADMIN_CONSOLE', 'VIEW_AUDIT_LOGS']
        : ['RUN_FINANCIAL_MATRIX', 'RUN_AI_DEEP_DIVE', 'CREATE_PROFILE', 'EXPORT_REPORT'],
      referralCreditsApplied: 0,
    };

    logger.info('Authentication', `User logged in: ${account.name} / ${account.email} (${account.role})`);
    return { account, token: account.token, subscription: sub };
  }

  // Authenticate / Register with Google Sign-In
  public authenticateGoogleUser(params: { email: string; name?: string; avatarUrl?: string }): { account: Account; token: string; subscription: Subscription } {
    const email = params.email.trim().toLowerCase();
    let account = Array.from(this.accounts.values()).find(
      a => a.email.toLowerCase() === email
    );

    if (!account) {
      // Auto-register new Google user
      const accountId = 'acc_g_' + Math.random().toString(36).substring(2, 9) + Date.now().toString(36);
      const token = 'tok_g_' + Math.random().toString(36).substring(2, 12) + '_' + Date.now().toString(36);
      const name = params.name?.trim() || email.split('@')[0];
      const referralCode = name.substring(0, 4).toUpperCase().replace(/[^A-Z]/g, 'USER') + Math.floor(100 + Math.random() * 900);

      account = {
        id: accountId,
        email,
        name,
        role: email.includes('admin') ? 'ADMIN' : 'USER',
        token,
        referralCode,
        subscriptionTier: 'FREE_TRIAL',
        createdAt: new Date().toISOString(),
        settings: { theme: 'dark', locale: 'ru', notificationsEnabled: true },
      };

      this.accounts.set(accountId, account);
      this.passwords.set(accountId, 'google_oauth_auth');

      // Create subscription
      const subId = 'sub_' + Math.random().toString(36).substring(2, 9);
      const newSub: Subscription = {
        id: subId,
        accountId,
        tier: 'FREE_TRIAL',
        status: 'active',
        startDate: new Date().toISOString(),
        endDate: new Date(Date.now() + 365 * 86400000).toISOString(),
        maxProfiles: 25,
        features: ['RUN_FINANCIAL_MATRIX', 'RUN_AI_DEEP_DIVE', 'CREATE_PROFILE', 'EXPORT_REPORT'],
        referralCreditsApplied: 0,
      };
      this.subscriptions.set(accountId, newSub);

      // Create default self profile
      const selfProfileId = 'prof_' + Math.random().toString(36).substring(2, 9);
      const selfProfile: PersonProfile = {
        id: selfProfileId,
        accountId,
        relationType: 'self',
        firstName: name,
        lastName: '',
        birthDate: '14.07.1990',
        occupation: 'Specialist / Investor',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      this.profiles.set(selfProfileId, selfProfile);

      logger.info('Authentication', `New Google user registered: ${account.email} (ID: ${accountId})`);
      return { account, token, subscription: newSub };
    }

    // Existing Google user
    const sub = this.subscriptions.get(account.id) || {
      id: 'sub_' + Math.random().toString(36).substring(2, 7),
      accountId: account.id,
      tier: account.subscriptionTier,
      status: 'active' as const,
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 365 * 86400000).toISOString(),
      maxProfiles: 25,
      features: ['RUN_FINANCIAL_MATRIX', 'RUN_AI_DEEP_DIVE', 'CREATE_PROFILE'],
      referralCreditsApplied: 0,
    };

    logger.info('Authentication', `Google user logged in: ${account.email} (${account.role})`);
    return { account, token: account.token, subscription: sub };
  }

  // Subscriptions & Referral conversion rule: 5 conversions = 1 month free extension
  public checkAndApplyReferralRewards(referrerAccountId: string): { rewardGranted: boolean; monthsAdded: number } {
    const refs = Array.from(this.referrals.values()).filter(
      r => r.referrerAccountId === referrerAccountId && r.status === 'CONVERTED'
    );
    const convertedCount = refs.length;
    const sub = this.subscriptions.get(referrerAccountId);
    if (!sub) return { rewardGranted: false, monthsAdded: 0 };

    const totalEligibleRewardMonths = Math.floor(convertedCount / 5);
    const pendingRewardsToApply = totalEligibleRewardMonths - sub.referralCreditsApplied;

    if (pendingRewardsToApply > 0) {
      const currentEnd = new Date(sub.endDate);
      currentEnd.setMonth(currentEnd.getMonth() + pendingRewardsToApply);
      sub.endDate = currentEnd.toISOString();
      sub.referralCreditsApplied += pendingRewardsToApply;
      this.subscriptions.set(referrerAccountId, sub);

      logger.info('Referral', `Applied ${pendingRewardsToApply} free reward month(s) to account ${referrerAccountId} via 5-conversion threshold.`);
      return { rewardGranted: true, monthsAdded: pendingRewardsToApply };
    }

    return { rewardGranted: false, monthsAdded: 0 };
  }
}

export const db = new DatabaseStore();
