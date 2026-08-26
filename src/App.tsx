import React, { useState, useEffect } from 'react';
import { Users, LogIn, Sparkles } from 'lucide-react';
import { api } from './services/api.js';
import {
  Account,
  PersonProfile,
  FinancialMatrixLayer1Output,
  DiagnosticAnalysisRecord,
  Subscription,
  ReferralStats,
  DiagnosticModuleMeta,
} from './types/domain.js';

import { Navigation } from './components/Navigation.js';
import { FinancialMatrixForm } from './components/FinancialMatrixForm.js';
import { Layer1MatrixView } from './components/Layer1MatrixView.js';
import { Layer2AiAnalysisView } from './components/Layer2AiAnalysisView.js';
import { ProfileManager } from './components/ProfileManager.js';
import { HistoryDrawer } from './components/HistoryDrawer.js';
import { ReferralHub } from './components/ReferralHub.js';
import { AdminConsole } from './components/AdminConsole.js';
import { AutomatedTestRunner } from './components/AutomatedTestRunner.js';
import { PlannedModulesModal } from './components/PlannedModulesModal.js';
import { AuthModal } from './components/AuthModal.js';
import { PwaInstallModal } from './components/PwaInstallModal.js';
import { PwaInstallBanner } from './components/PwaInstallBanner.js';
import { SocionicsTestView } from './components/SocionicsTestView.js';
import { ResourceStateView } from './components/ResourceStateView.js';
import { IntegrativeAnalysisView } from './components/IntegrativeAnalysisView.js';
import { SocionicsTestResult, FullIntegrativeAnalysisRecord, EnergyEvaluationRecord } from './types/socionics.js';
import { useI18n } from './i18n/context.js';

export function App() {
  const { language } = useI18n();
  const [currentTab, setCurrentTab] = useState<string>('diagnostic');
  const [account, setAccount] = useState<Account | null>(null);
  const [subscription, setSubscription] = useState<Subscription | undefined>(undefined);
  const [profiles, setProfiles] = useState<PersonProfile[]>([]);
  const [selectedProfile, setSelectedProfile] = useState<PersonProfile | null>(null);
  
  const [currentLayer1, setCurrentLayer1] = useState<FinancialMatrixLayer1Output | null>(null);
  const [currentAnalysis, setCurrentAnalysis] = useState<DiagnosticAnalysisRecord | null>(null);
  const [currentSocionicsResult, setCurrentSocionicsResult] = useState<SocionicsTestResult | null>(null);
  const [currentIntegrativeRecord, setCurrentIntegrativeRecord] = useState<FullIntegrativeAnalysisRecord | null>(null);
  const [isGeneratingIntegrative, setIsGeneratingIntegrative] = useState(false);
  
  const [history, setHistory] = useState<DiagnosticAnalysisRecord[]>([]);
  const [socionicsHistory, setSocionicsHistory] = useState<SocionicsTestResult[]>([]);
  const [energyHistory, setEnergyHistory] = useState<EnergyEvaluationRecord[]>([]);
  const [integrativeHistory, setIntegrativeHistory] = useState<FullIntegrativeAnalysisRecord[]>([]);
  const [referralStats, setReferralStats] = useState<ReferralStats | null>(null);
  const [modules, setModules] = useState<DiagnosticModuleMeta[]>([]);

  const [isCalculating, setIsCalculating] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isSimulatingReferral, setIsSimulatingReferral] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [showSubscriptionModal, setShowSubscriptionModal] = useState(false);
  const [showPlannedModulesModal, setShowPlannedModulesModal] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showPwaInstallModal, setShowPwaInstallModal] = useState(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register'>('login');
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  // Initialize Session & Data across all modules
  const initializeApp = async () => {
    try {
      setErrorMessage(null);
      const [meRes, profRes, histRes, socHistRes, energyHistRes, integHistRes, refRes, modRes] = await Promise.all([
        api.getMe().catch(() => ({ account: null, subscription: null })),
        api.getProfiles().catch(() => ({ profiles: [] })),
        api.getHistory().catch(() => ({ history: [] })),
        api.getSocionicsHistory().catch(() => ({ history: [] })),
        api.getEnergyHistory().catch(() => ({ history: [] })),
        api.getIntegrativeHistory().catch(() => ({ history: [] })),
        api.getReferralStats().catch(() => ({ stats: null })),
        api.getModules().catch(() => ({ modules: [] })),
      ]);

      if (meRes.account) {
        setAccount(meRes.account);
        setSubscription(meRes.subscription);
      } else {
        api.setToken('');
        setAccount(null);
        setSubscription(null);
      }

      setProfiles(profRes.profiles || []);
      setHistory(histRes.history || []);
      setSocionicsHistory(socHistRes.history || []);
      setEnergyHistory(energyHistRes.history || []);
      setIntegrativeHistory(integHistRes.history || []);
      setReferralStats(refRes.stats);
      setModules(modRes.modules || []);

      if (profRes.profiles && profRes.profiles.length > 0) {
        const selfProfile = profRes.profiles.find((p) => p.relationType === 'self') || profRes.profiles[0];
        setSelectedProfile(selfProfile);
      } else {
        setSelectedProfile(null);
      }
    } catch (err: any) {
      console.error('Initialization error:', err);
      api.setToken('');
      setAccount(null);
      setSubscription(null);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    initializeApp();
  }, []);

  // Auth Handlers
  const handleOpenAuthModal = (mode: 'login' | 'register' = 'login') => {
    setAuthModalMode(mode);
    setShowAuthModal(true);
  };

  const handleAuthSuccess = (newAccount: Account, newSubscription?: Subscription) => {
    setAccount(newAccount);
    if (newSubscription) setSubscription(newSubscription);
    initializeApp();
  };

  const handleLogout = async () => {
    try {
      await api.logout();
      await initializeApp();
      setCurrentTab('diagnostic');
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  };

  // Switch role handler (Demo User vs Admin)
  const handleSwitchRole = async (targetRole: 'USER' | 'ADMIN') => {
    try {
      setIsInitialLoading(true);
      await api.switchAccount(targetRole);
      await initializeApp();
      if (targetRole === 'ADMIN') {
        setCurrentTab('admin');
      } else {
        setCurrentTab('diagnostic');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to switch role.');
    } finally {
      setIsInitialLoading(false);
    }
  };

  // Profile CRUD handlers
  const handleCreateProfile = async (profileData: Partial<PersonProfile>): Promise<PersonProfile> => {
    const res = await api.createProfile(profileData);
    setProfiles((prev) => [...prev, res.profile]);
    setSelectedProfile(res.profile);
    return res.profile;
  };

  const handleUpdateProfile = async (id: string, profileData: Partial<PersonProfile>): Promise<PersonProfile> => {
    const res = await api.updateProfile(id, profileData);
    setProfiles((prev) => prev.map((p) => (p.id === id ? res.profile : p)));
    if (selectedProfile?.id === id) {
      setSelectedProfile(res.profile);
    }
    return res.profile;
  };

  const handleDeleteProfile = async (id: string) => {
    await api.deleteProfile(id);
    setProfiles((prev) => prev.filter((p) => p.id !== id));
    if (selectedProfile?.id === id) {
      const remaining = profiles.filter((p) => p.id !== id);
      setSelectedProfile(remaining.length > 0 ? remaining[0] : null);
    }
  };

  // Matrix calculation (Layer 1 Math)
  const handleCalculateLayer1 = async (data: {
    userBirthDate: string;
    motherBirthDate?: string;
    fatherBirthDate?: string;
  }) => {
    setIsCalculating(true);
    setErrorMessage(null);
    try {
      const res = await api.calculateFinancialMatrix(data);
      setCurrentLayer1(res.layer1);
    } catch (err: any) {
      setErrorMessage(err.message || 'Mathematical calculation failed.');
    } finally {
      setIsCalculating(false);
    }
  };

  // Single Combined Diagnostic Handler (Math calculation + AI Synthesis + Sync)
  const handleRunDiagnostic = async (data: {
    profileId?: string;
    firstName?: string;
    lastName?: string;
    userBirthDate: string;
    motherBirthDate?: string;
    fatherBirthDate?: string;
    occupation?: string;
    financialGoals?: string;
    notes?: string;
    lang?: 'ru' | 'en' | 'es';
  }) => {
    setIsAnalyzing(true);
    setErrorMessage(null);
    try {
      // 1. Compute deterministic Layer 1 math
      const mathRes = await api.calculateFinancialMatrix({
        userBirthDate: data.userBirthDate,
        motherBirthDate: data.motherBirthDate,
        fatherBirthDate: data.fatherBirthDate,
      });
      setCurrentLayer1(mathRes.layer1);

      // 2. Synthesize AI analysis (or resilient local engine)
      const res = await api.runFinancialMatrixAnalysis({
        ...data,
        lang: data.lang || language,
      });
      setCurrentAnalysis(res.analysis);
      setCurrentLayer1(res.analysis.layer1);
      setHistory((prev) => [res.analysis, ...prev]);
    } catch (err: any) {
      setErrorMessage(err.message || 'Diagnostic failed.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Generate 4-Layer Integrative Report (Socionics + Matrix + Analysis + Archetype)
  const handleOpenIntegrativeReport = async (socResult: SocionicsTestResult) => {
    setCurrentSocionicsResult(socResult);
    setIsGeneratingIntegrative(true);
    setErrorMessage(null);

    try {
      const birthDate = selectedProfile?.birthDate || '1990-01-01';
      const subjectName = selectedProfile
        ? `${selectedProfile.firstName} ${selectedProfile.lastName}`.trim()
        : (socResult.profileName || 'Клиент');

      const { record } = await api.runIntegrativeAnalysis({
        profileId: selectedProfile?.id,
        subjectName,
        birthDate,
        motherBirthDate: selectedProfile?.motherBirthDate,
        fatherBirthDate: selectedProfile?.fatherBirthDate,
        socionicsResultId: socResult.id,
        socionicsAnswers: socResult.answers,
        lang: language,
      });

      setCurrentIntegrativeRecord(record);
      setCurrentTab('integrative');
    } catch (err: any) {
      setErrorMessage(`Ошибка формирования 4-слойного анализа: ${err?.message || 'Неизвестная ошибка'}`);
    } finally {
      setIsGeneratingIntegrative(false);
    }
  };

  // Referral Simulation
  const handleSimulateReferral = async () => {
    setIsSimulatingReferral(true);
    try {
      await api.simulateReferralConversion();
      const updatedStats = await api.getReferralStats();
      setReferralStats(updatedStats.stats);
      const subRes = await api.getCurrentSubscription();
      setSubscription(subRes.subscription);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to simulate referral.');
    } finally {
      setIsSimulatingReferral(false);
    }
  };

  // Subscription Upgrade
  const handleUpgradeSubscription = async (tier: 'PRO_MONTHLY' | 'ENTERPRISE') => {
    try {
      const res = await api.upgradeSubscription(tier);
      setSubscription(res.subscription);
      setShowSubscriptionModal(false);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to upgrade subscription.');
    }
  };

  // History delete handlers
  const handleDeleteHistoryItem = async (id: string) => {
    try {
      await api.deleteHistoryItem(id);
      setHistory((prev) => prev.filter((h) => h.id !== id));
      if (currentAnalysis?.id === id) {
        setCurrentAnalysis(null);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete record.');
    }
  };

  const handleDeleteSocionicsItem = async (id: string) => {
    try {
      await api.deleteSocionicsResult(id);
      setSocionicsHistory((prev) => prev.filter((h) => h.id !== id));
      if (currentSocionicsResult?.id === id) {
        setCurrentSocionicsResult(null);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete socionics record.');
    }
  };

  const handleDeleteEnergyItem = async (id: string) => {
    try {
      await api.deleteEnergyResult(id);
      setEnergyHistory((prev) => prev.filter((h) => h.id !== id));
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete energy record.');
    }
  };

  const handleDeleteIntegrativeItem = async (id: string) => {
    try {
      await api.deleteIntegrativeResult(id);
      setIntegrativeHistory((prev) => prev.filter((h) => h.id !== id));
      if (currentIntegrativeRecord?.id === id) {
        setCurrentIntegrativeRecord(null);
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete integrative record.');
    }
  };

  // Select History Records across modules
  const handleSelectHistoryRecord = (record: DiagnosticAnalysisRecord) => {
    setCurrentAnalysis(record);
    setCurrentLayer1(record.layer1);
    if (record.profileId) {
      const match = profiles.find((p) => p.id === record.profileId);
      if (match) setSelectedProfile(match);
    }
    setCurrentTab('diagnostic');
  };

  const handleSelectSocionicsRecord = (record: SocionicsTestResult) => {
    setCurrentSocionicsResult(record);
    if (record.profileId) {
      const match = profiles.find((p) => p.id === record.profileId);
      if (match) setSelectedProfile(match);
    }
    setCurrentTab('socionics');
  };

  const handleSelectEnergyRecord = (record: EnergyEvaluationRecord) => {
    if (record.profileId) {
      const match = profiles.find((p) => p.id === record.profileId);
      if (match) setSelectedProfile(match);
    }
    setCurrentTab('energy');
  };

  const handleSelectIntegrativeRecord = (record: FullIntegrativeAnalysisRecord) => {
    setCurrentIntegrativeRecord(record);
    if (record.profileId) {
      const match = profiles.find((p) => p.id === record.profileId);
      if (match) setSelectedProfile(match);
    }
    setCurrentTab('integrative');
  };

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm font-medium text-slate-400">Loading Diagnostic Engine Environment...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans pb-20 md:pb-12 antialiased selection:bg-indigo-600 selection:text-white">
      {/* Navigation Header */}
      <Navigation
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        account={account}
        subscription={subscription}
        profiles={profiles}
        selectedProfileId={selectedProfile?.id || null}
        onSelectProfile={(id) => {
          const found = profiles.find((p) => p.id === id);
          if (found) setSelectedProfile(found);
        }}
        onOpenNewProfileModal={() => setCurrentTab('profiles')}
        onSwitchRole={handleSwitchRole}
        onOpenPlannedModules={() => setShowPlannedModulesModal(true)}
        onOpenSubscriptionModal={() => setShowSubscriptionModal(true)}
        onOpenAuthModal={handleOpenAuthModal}
        onOpenPwaModal={() => setShowPwaInstallModal(true)}
        onLogout={handleLogout}
      />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-24 md:pb-12 space-y-8">
        
        {/* Global Error Banner if any */}
        {errorMessage && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center justify-between">
            <span>{errorMessage}</span>
            <button
              onClick={() => setErrorMessage(null)}
              className="text-rose-400 font-bold hover:text-white ml-4 cursor-pointer"
            >
              ✕
            </button>
          </div>
        )}

        {/* Tab 1: Financial Matrix (Diagnostic) */}
        {currentTab === 'diagnostic' && (
          <div className="space-y-8">
            <FinancialMatrixForm
              profiles={profiles}
              selectedProfile={selectedProfile}
              onSelectProfile={(p) => setSelectedProfile(p)}
              onCreateProfile={handleCreateProfile}
              onUpdateProfile={handleUpdateProfile}
              onRunDiagnostic={handleRunDiagnostic}
              isDiagnosing={isAnalyzing}
              error={errorMessage}
              account={account}
              onOpenAuthModal={handleOpenAuthModal}
              onSwitchRole={handleSwitchRole}
            />

            {/* Layer 2 AI Synthesis View (Main report shown by default, detailed system reports collapsed) */}
            {currentAnalysis && currentAnalysis.layer2 && (
              <Layer2AiAnalysisView analysis={currentAnalysis} layer1={currentLayer1} />
            )}
          </div>
        )}

        {/* Tab 2: Normalized Person Profiles (Auth Protected) */}
        {currentTab === 'profiles' && (
          account ? (
            <ProfileManager
              profiles={profiles}
              selectedProfileId={selectedProfile?.id || null}
              onSelectProfile={(p) => {
                setSelectedProfile(p);
                setCurrentTab('diagnostic');
              }}
              onCreateProfile={handleCreateProfile}
              onUpdateProfile={handleUpdateProfile}
              onDeleteProfile={handleDeleteProfile}
              onRunMatrixForProfile={(p) => {
                setSelectedProfile(p);
                setCurrentTab('diagnostic');
                handleRunDiagnostic({
                  profileId: p.id,
                  firstName: p.firstName,
                  lastName: p.lastName,
                  userBirthDate: p.birthDate,
                  motherBirthDate: p.motherBirthDate,
                  fatherBirthDate: p.fatherBirthDate,
                  occupation: p.occupation,
                  financialGoals: p.financialGoals,
                });
              }}
            />
          ) : (
            <div className="bg-slate-900/90 border border-slate-800 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-2xl space-y-4 my-8 animate-in fade-in">
              <div className="w-14 h-14 bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 rounded-2xl flex items-center justify-center mx-auto shadow-inner">
                <Users className="w-7 h-7" />
              </div>
              <h3 className="text-xl font-bold text-slate-100">
                Управление профилями
              </h3>
              <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
                Раздел «Профили» и сохранение персон доступны после входа в аккаунт. Войдите через Email или в 1 клик через Google.
              </p>
              <div className="flex justify-center gap-3 pt-2">
                <button
                  onClick={() => handleOpenAuthModal('login')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Войти в аккаунт</span>
                </button>
              </div>
            </div>
          )
        )}

        {/* Tab 3: Unified Diagnostic History for All Test Modules */}
        {currentTab === 'history' && (
          <HistoryDrawer
            history={history}
            socionicsHistory={socionicsHistory}
            energyHistory={energyHistory}
            integrativeHistory={integrativeHistory}
            profiles={profiles}
            onSelectRecord={handleSelectHistoryRecord}
            onSelectSocionicsRecord={handleSelectSocionicsRecord}
            onSelectEnergyRecord={handleSelectEnergyRecord}
            onSelectIntegrativeRecord={handleSelectIntegrativeRecord}
            onDeleteRecord={handleDeleteHistoryItem}
            onDeleteSocionicsRecord={handleDeleteSocionicsItem}
            onDeleteEnergyRecord={handleDeleteEnergyItem}
            onDeleteIntegrativeRecord={handleDeleteIntegrativeItem}
            onNavigateToTab={(tab) => setCurrentTab(tab)}
          />
        )}

        {/* Tab 4: Referrals (Admin Only View) */}
        {currentTab === 'referrals' && (
          account?.role === 'ADMIN' ? (
            <ReferralHub
              stats={referralStats}
              onSimulateConversion={handleSimulateReferral}
              isSimulating={isSimulatingReferral}
            />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-2xl space-y-4 my-8">
              <p className="text-xs text-slate-400">Данный раздел доступен в консоли администратора.</p>
            </div>
          )
        )}

        {/* Tab 5: Automated Test Suite (Admin Only View) */}
        {currentTab === 'tests' && (
          account?.role === 'ADMIN' ? (
            <AutomatedTestRunner />
          ) : (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-2xl space-y-4 my-8">
              <p className="text-xs text-slate-400">Тестирование инвариантов доступно в консоли администратора.</p>
            </div>
          )
        )}

        {/* Tab 6: RBAC Admin Console */}
        {currentTab === 'admin' && account?.role === 'ADMIN' && <AdminConsole />}

        {/* Tab 7: Resource State (Energy & Psychophysiology) */}
        {(currentTab === 'energy' || currentTab === 'resource') && (
          <ResourceStateView
            activeProfile={selectedProfile}
            profiles={profiles}
            onSelectProfile={(p) => setSelectedProfile(p)}
            onNavigateToSocionics={() => setCurrentTab('socionics')}
            onNavigateToMatrix={() => setCurrentTab('diagnostic')}
            account={account}
            onOpenAuthModal={handleOpenAuthModal}
          />
        )}

        {/* Tab 8: Socionics Diagnostic Battery */}
        {currentTab === 'socionics' && (
          <div className="space-y-6">
            {isGeneratingIntegrative && (
              <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-8 text-center max-w-xl mx-auto shadow-2xl space-y-4 animate-in fade-in">
                <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-white">Формирование 4-слойного анализа ИИ...</h3>
                <p className="text-xs text-slate-400">
                  Синтезируем соционический профиль, финансовую матрицу V1-V4, поведенческий отчет и архетип дня рождения.
                </p>
              </div>
            )}
            <SocionicsTestView
              activeProfile={selectedProfile}
              profiles={profiles}
              history={history}
              currentAnalysis={currentAnalysis}
              onSelectProfile={(p) => setSelectedProfile(p)}
              onOpenIntegrativeReport={handleOpenIntegrativeReport}
              onNavigateToMatrix={() => setCurrentTab('diagnostic')}
              onNavigateToEnergy={() => setCurrentTab('energy')}
              account={account}
              onOpenAuthModal={handleOpenAuthModal}
            />
          </div>
        )}

        {/* Tab 8: 4-Layer Integrative Behavioral Analysis */}
        {currentTab === 'integrative' && (
          <div className="space-y-6">
            {isGeneratingIntegrative ? (
              <div className="bg-slate-900 border border-purple-500/40 rounded-3xl p-12 text-center max-w-xl mx-auto shadow-2xl space-y-4 animate-in fade-in my-12">
                <div className="w-12 h-12 border-3 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto" />
                <h3 className="text-lg font-bold text-white">Формирование 4-слойного синтеза...</h3>
                <p className="text-xs text-slate-400">
                  Глубокий интегративный анализ от Senior Behavioral Analyst & Potential Architect.
                </p>
              </div>
            ) : currentIntegrativeRecord ? (
              <IntegrativeAnalysisView
                record={currentIntegrativeRecord}
                onRunNew={() => setCurrentTab('socionics')}
              />
            ) : (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 text-center max-w-lg mx-auto shadow-2xl space-y-4 my-8">
                <p className="text-sm font-semibold text-slate-300">
                  Для формирования 4-слойного синтеза пройдите соционический тест или выберите расчет.
                </p>
                <button
                  type="button"
                  onClick={() => setCurrentTab('socionics')}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                >
                  Перейти к соционическому тесту
                </button>
              </div>
            )}
          </div>
        )}

      </main>

      {/* Planned Modules Blueprint Modal */}
      {showPlannedModulesModal && (
        <PlannedModulesModal
          modules={modules}
          onClose={() => setShowPlannedModulesModal(false)}
        />
      )}

      {/* Authentication Modal (Register / Login) */}
      <AuthModal
        isOpen={showAuthModal}
        initialMode={authModalMode}
        onClose={() => setShowAuthModal(false)}
        onAuthSuccess={handleAuthSuccess}
      />

      {/* PWA Floating Installation Banner */}
      <PwaInstallBanner
        onOpenModal={() => setShowPwaInstallModal(true)}
      />

      {/* PWA Full Installation Modal */}
      <PwaInstallModal
        isOpen={showPwaInstallModal}
        onClose={() => setShowPwaInstallModal(false)}
      />
    </div>
  );
}
export default App;
