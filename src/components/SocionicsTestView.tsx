/**
 * Socionics Diagnostic Battery View (30 Screens)
 * Evaluates 16 Sociotypes, Quadra, Result/Process orientation,
 * Model A cognitive function hierarchy, and response consistency.
 *
 * Prerequisite Policy:
 * Requires profile data completion, Financial Matrix Layer 1 calculation,
 * and Layer 2 AI synthesis before starting the assessment.
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Brain,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  User,
  FileText,
  BarChart3,
  Award,
  Lock,
  CheckCircle2,
  Clock,
  Calculator,
  Zap,
} from 'lucide-react';
import { useI18n } from '../i18n/context.js';
import { Language } from '../i18n/types.js';
import { api } from '../services/api.js';
import { PersonProfile, DiagnosticAnalysisRecord, Account } from '../types/domain.js';
import {
  SocionicsScreen,
  SocionicsTestResult,
  OptionKey,
} from '../types/socionics.js';
import { AuthRequiredBanner } from './AuthRequiredBanner.js';

interface SocionicsTestViewProps {
  activeProfile: PersonProfile | null;
  profiles: PersonProfile[];
  history?: DiagnosticAnalysisRecord[];
  currentAnalysis?: DiagnosticAnalysisRecord | null;
  onSelectProfile: (profile: PersonProfile) => void;
  onOpenIntegrativeReport: (socResult: SocionicsTestResult) => void;
  onNavigateToMatrix: () => void;
  onNavigateToEnergy?: () => void;
  account?: Account | null;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
}

const FUNCTION_FRIENDLY_NAMES: Record<string, { ru: string; en: string; es: string }> = {
  ЧИ: { ru: 'Интуиция возможностей (Новые идеи)', en: 'Intuition of Ideas (New Opportunities)', es: 'Intuición de ideas (Nuevas oportunidades)' },
  БИ: { ru: 'Интуиция времени (Прогноз и ритм)', en: 'Intuition of Time (Vision & Foresight)', es: 'Intuición del tiempo (Visión y pronóstico)' },
  ЧЛ: { ru: 'Деловая логика (Практическая польза)', en: 'Practical Logic (Action & Efficiency)', es: 'Lógica práctica (Acción y eficiencia)' },
  БЛ: { ru: 'Структурная логика (Системность и порядок)', en: 'Structural Logic (Systems & Clarity)', es: 'Lógica estructural (Sistemas y orden)' },
  ЧЭ: { ru: 'Эмоциональный интеллект (Воодушевление)', en: 'Emotional Energy (Inspiration & Drive)', es: 'Inteligencia emocional (Inspiración)' },
  БЭ: { ru: 'Этика отношений (Доверие и такт)', en: 'Ethics of Relations (Trust & Empathy)', es: 'Ética de relaciones (Confianza y tacto)' },
  ЧС: { ru: 'Волевой потенциал (Лидерство и упорство)', en: 'Volitional Drive (Leadership & Resolve)', es: 'Potencial volitivo (Liderazgo y firmeza)' },
  БС: { ru: 'Сенсорный комфорт (Уют и гармония)', en: 'Sensing of Comfort (Balance & Quality)', es: 'Sensación de confort (Armonía y bienestar)' },
};

export const SocionicsTestView: React.FC<SocionicsTestViewProps> = ({
  activeProfile,
  profiles,
  history = [],
  currentAnalysis,
  onSelectProfile,
  onOpenIntegrativeReport,
  onNavigateToMatrix,
  onNavigateToEnergy,
  account,
  onOpenAuthModal,
}) => {
  const { t, language } = useI18n();
  const [screens, setScreens] = useState<SocionicsScreen[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, OptionKey>>({});
  const [loadingScreens, setLoadingScreens] = useState<boolean>(true);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [testResult, setTestResult] = useState<SocionicsTestResult | null>(null);
  const [testHistory, setTestHistory] = useState<SocionicsTestResult[]>([]);
  const [viewHistoryModal, setViewHistoryModal] = useState<boolean>(false);

  const [bypassPrerequisite, setBypassPrerequisite] = useState<boolean>(false);

  // Prerequisite check: Profile data filled + Financial Matrix calculated (L1) + AI Analysis received (L2)
  const isProfileFilled = useMemo(() => {
    if (!activeProfile) return true;
    return Boolean(
      activeProfile &&
      activeProfile.birthDate &&
      activeProfile.birthDate.trim().length > 0 &&
      (activeProfile.firstName || activeProfile.lastName)
    );
  }, [activeProfile]);

  const matchingRecord = useMemo(() => {
    if (!activeProfile) return null;
    return history.find((h) => {
      if (h.profileId && h.profileId === activeProfile.id) return true;
      if (h.layer1?.user?.raw && activeProfile.birthDate && h.layer1.user.raw === activeProfile.birthDate) return true;
      return false;
    }) || (currentAnalysis && (currentAnalysis.profileId === activeProfile.id || currentAnalysis.layer1?.user?.raw === activeProfile.birthDate) ? currentAnalysis : null);
  }, [activeProfile, history, currentAnalysis]);

  const isMatrixCalculated = useMemo(() => {
    if (!activeProfile) return true;
    return Boolean(matchingRecord && matchingRecord.layer1 && matchingRecord.layer1.vectors);
  }, [activeProfile, matchingRecord]);

  const isMatrixAiAnalyzed = useMemo(() => {
    if (!activeProfile) return true;
    return Boolean(
      matchingRecord &&
      matchingRecord.layer2 &&
      (matchingRecord.status === 'COMPLETED' || matchingRecord.layer2.executiveSummary || matchingRecord.layer2.promptVersion)
    );
  }, [activeProfile, matchingRecord]);

  const isPrerequisiteMet = useMemo(() => {
    if (bypassPrerequisite || !activeProfile) return true;
    return isProfileFilled && isMatrixCalculated && isMatrixAiAnalyzed;
  }, [bypassPrerequisite, activeProfile, isProfileFilled, isMatrixCalculated, isMatrixAiAnalyzed]);

  // Profiles that have already completed calculations
  const readyProfiles = useMemo(() => {
    return profiles.filter((p) => {
      const rec = history.find((h) =>
        (h.profileId && h.profileId === p.id) ||
        (h.layer1?.user?.raw && p.birthDate && h.layer1.user.raw === p.birthDate)
      );
      return rec && rec.layer1 && rec.layer2 && p.birthDate;
    });
  }, [profiles, history]);

  // Load screens on mount
  useEffect(() => {
    let isMounted = true;
    async function loadData() {
      setLoadingScreens(true);
      try {
        const screensPromise = api.getSocionicsScreens().catch(() => ({ screens: [] }));
        const historyPromise = api.getSocionicsHistory().catch(() => ({ history: [] }));
        const [screensRes, historyRes] = await Promise.all([screensPromise, historyPromise]);
        if (isMounted) {
          setScreens(screensRes.screens || []);
          setTestHistory(historyRes.history || []);
        }
      } catch (err) {
        console.warn('Notice loading socionics data:', err);
      } finally {
        if (isMounted) {
          setLoadingScreens(false);
        }
      }
    }
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const totalScreens = screens.length || 30;
  const answeredCount = Object.keys(answers || {}).length;
  const progressPercent = Math.round((answeredCount / totalScreens) * 100);
  const currentScreen = screens[currentIndex];

  const handleSelectOption = (key: OptionKey) => {
    if (!account) {
      if (onOpenAuthModal) onOpenAuthModal('register');
      return;
    }
    if (!currentScreen) return;
    const newAnswers = { ...answers, [currentScreen.id]: key };
    setAnswers(newAnswers);

    // Auto advance if not last
    if (currentIndex < totalScreens - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleFinishTest = async () => {
    if (!account) {
      if (onOpenAuthModal) onOpenAuthModal('register');
      return;
    }

    if (answeredCount < totalScreens) {
      if (!confirm(`Вы ответили на ${answeredCount} из ${totalScreens} вопросов. Хотите завершить расчет?`)) {
        return;
      }
    }

    setEvaluating(true);
    try {
      const subjectName = activeProfile
        ? `${activeProfile.firstName} ${activeProfile.lastName}`.trim()
        : 'Гость';
      const { result } = await api.evaluateSocionics({
        answers,
        profileId: activeProfile?.id,
        profileName: subjectName,
      });
      setTestResult(result);
      setTestHistory((prev) => [result, ...prev]);
    } catch (err: any) {
      if (err?.requiresAuth && onOpenAuthModal) {
        onOpenAuthModal('login');
      } else {
        alert(`Ошибка расчета соционического профиля: ${err?.message || 'Неизвестная ошибка'}`);
      }
    } finally {
      setEvaluating(false);
    }
  };

  const handleRetake = () => {
    setAnswers({});
    setCurrentIndex(0);
    setTestResult(null);
  };

  const getScreenText = (screen: SocionicsScreen) => {
    const langKey = (language as Language) || 'ru';
    return {
      situation: screen.situation?.[langKey] || screen.situation?.ru || '',
      domain: screen.blockTitle?.[langKey] || screen.blockTitle?.ru || `Блок ${screen.blockId}`,
      title: screen.title?.[langKey] || screen.title?.ru || '',
      question: screen.question?.[langKey] || screen.question?.ru || '',
    };
  };

  const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D', 'E'];

  if (loadingScreens) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 font-semibold">
          {language === 'en'
            ? 'Preparing personality test questions...'
            : language === 'es'
            ? 'Preparando preguntas del test...'
            : 'Подготовка вопросов теста личности...'}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-3 sm:px-6 py-8">
      {/* Authentication Required Banner if not logged in */}
      {!account && (
        <AuthRequiredBanner
          onOpenAuthModal={onOpenAuthModal || (() => {})}
          moduleName={t.socionics?.title || 'Соционическая диагностика'}
          className="mb-6"
        />
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-cyan-950 border border-indigo-500/30 p-6 sm:p-8 mb-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Brain className="w-3.5 h-3.5" />
              <span>{t.socionics?.diagnosticBadge || 'ОПРЕДЕЛЕНИЕ ТИПА ЛИЧНОСТИ (30 КЕЙСОВ)'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.socionics?.title || 'Ваш стиль мышления и сильные стороны'}
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.socionics?.subtitle ||
                '30 понятных жизненных ситуаций, которые помогут раскрыть ваш природный потенциал, особенности принятия решений и комфортные способы общения.'}
            </p>
          </div>

          {/* Profile Selector & Quick Actions */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {profiles.length > 0 && (
              <div className="relative">
                <select
                  aria-label="Select profile for socionics test"
                  value={activeProfile?.id || ''}
                  onChange={(e) => {
                    const p = profiles.find((item) => item.id === e.target.value);
                    if (p) onSelectProfile(p);
                  }}
                  className="w-full px-3 py-2 rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">{t.socionics?.guestTesting || 'Гостевой режим'}</option>
                  {profiles.map((p) => {
                    const isReady = readyProfiles.some((rp) => rp.id === p.id);
                    return (
                      <option key={p.id} value={p.id}>
                        {p.firstName} {p.lastName} ({p.relationType}) {isReady ? '✓' : ''}
                      </option>
                    );
                  })}
                </select>
              </div>
            )}

            {testHistory.length > 0 && (
              <button
                type="button"
                onClick={() => setViewHistoryModal(true)}
                className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <FileText className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.socionics?.viewHistory || 'История'} ({testHistory.length})</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Profile Status Badge */}
        {activeProfile && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <User className="w-4 h-4 text-indigo-400" />
              <span className="font-semibold">{activeProfile.firstName} {activeProfile.lastName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{activeProfile.birthDate || 'Дата рождения не указана'}</span>
            </div>
            {isPrerequisiteMet ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[11px]">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{t.socionics?.matrixReadyBadge || 'Матрица рассчитана'}</span>
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Energy Efficiency Prerequisite Motivation Banner */}
      {onNavigateToEnergy && (
        <div className="mb-8 rounded-3xl bg-gradient-to-r from-cyan-950/70 via-slate-900 to-indigo-950/70 border border-cyan-500/30 p-5 sm:p-6 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 flex items-center justify-center shrink-0 shadow-inner mt-0.5">
              <Zap className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm sm:text-base font-bold text-white leading-tight">
                {t.energy?.motivationBannerTitle || '💡 Рекомендуем начать с теста энергии и продуктивности'}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed max-w-2xl">
                {t.energy?.motivationBannerSubtitle ||
                  'Пройдите 2-минутный тест на уровень сил и стресса. Это откалибрует систему и сделает расчет вашего социотипа на 100% точным и объективным!'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onNavigateToEnergy}
            className="shrink-0 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs font-bold transition-all shadow-md shadow-cyan-600/20 flex items-center gap-1.5 cursor-pointer"
          >
            <span>{t.energy?.motivationBannerBtn || 'Пройти тест энергии за 2 мин'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

      {/* Main Content Area */}
      {!testResult ? (
        !isPrerequisiteMet ? (
          /* PREREQUISITE NOTIFICATION & STEP TRACKER */
          <div className="bg-slate-900/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 animate-in fade-in">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0 shadow-inner">
                <Lock className="w-6 h-6" />
              </div>
              <div className="space-y-1.5 flex-1">
                <div className="inline-flex items-center gap-2 px-2.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-extrabold text-[10px] tracking-wider uppercase">
                  {t.socionics?.prerequisiteRequiredBadge || 'ПРЕДВАРИТЕЛЬНЫЙ ЭТАП'}
                </div>
                <h2 className="text-xl font-bold text-slate-100">
                  {t.socionics?.prerequisiteTitle || 'Необходим предварительный расчёт финансовой матрицы'}
                </h2>
                <p className="text-xs text-slate-300 leading-relaxed max-w-3xl">
                  {t.socionics?.prerequisiteDesc ||
                    'Прежде чем приступить к определению соционического типа, необходимо заполнить данные профиля, рассчитать 4 вектора финансовой матрицы и получить ИИ-анализ потенциала.'}
                </p>
              </div>
            </div>

            {/* Checklist Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
              {/* Step 1: Profile Details */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isProfileFilled
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">
                    {t.socionics?.stepProfileData || '1. Данные профиля (ФИО, дата рождения)'}
                  </span>
                  {isProfileFilled ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </div>
                <div className="text-[11px] space-y-1">
                  {isProfileFilled ? (
                    <p className="text-emerald-400 font-semibold">
                      {activeProfile?.firstName} {activeProfile?.lastName} ({activeProfile?.birthDate})
                    </p>
                  ) : (
                    <p className="text-amber-300/80">
                      {t.socionics?.profileFieldsIncomplete || 'Поля профиля не заполнены (требуется дата рождения)'}
                    </p>
                  )}
                </div>
              </div>

              {/* Step 2: Layer 1 Calculation */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isMatrixCalculated
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">
                    {t.socionics?.stepMatrixCalc || '2. Расчет 4 векторов (Уровень 1)'}
                  </span>
                  {isMatrixCalculated ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </div>
                <div className="text-[11px]">
                  {isMatrixCalculated && matchingRecord?.layer1?.vectors ? (
                    <p className="text-emerald-400 font-semibold font-mono">
                      V1:{matchingRecord.layer1.vectors.v1_life_scenario?.value} • V2:{matchingRecord.layer1.vectors.v2_work_model?.value} • V3:{matchingRecord.layer1.vectors.v3_emotional_background?.value} • V4:{matchingRecord.layer1.vectors.v4_resource_management?.value}
                    </p>
                  ) : (
                    <p className="text-amber-300/80">
                      {t.socionics?.statusPending || 'Требуется расчёт'}
                    </p>
                  )}
                </div>
              </div>

              {/* Step 3: Layer 2 AI Analysis */}
              <div
                className={`p-4 rounded-2xl border transition-all ${
                  isMatrixAiAnalyzed
                    ? 'bg-emerald-950/20 border-emerald-500/30 text-slate-200'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-200">
                    {t.socionics?.stepMatrixAi || '3. Комплексный ИИ-анализ (Уровень 2)'}
                  </span>
                  {isMatrixAiAnalyzed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  ) : (
                    <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                  )}
                </div>
                <div className="text-[11px]">
                  {isMatrixAiAnalyzed ? (
                    <p className="text-emerald-400 font-semibold">
                      {t.socionics?.statusCompleted || 'Выполнено'}
                    </p>
                  ) : (
                    <p className="text-amber-300/80">
                      {t.socionics?.statusPending || 'Ожидает запуска'}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={onNavigateToMatrix}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Calculator className="w-4 h-4" />
                  <span>{t.socionics?.btnGoToMatrix || 'Перейти к заполнению матрицы'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => setBypassPrerequisite(true)}
                  className="px-5 py-3 rounded-2xl bg-slate-800/90 hover:bg-slate-700 text-slate-200 text-xs font-bold border border-slate-700 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-cyan-400" />
                  <span>Пройти тестирование сразу (Автономный режим)</span>
                </button>
              </div>

              {/* Ready profiles switcher if available */}
              {readyProfiles.length > 0 && activeProfile && !readyProfiles.some((rp) => rp.id === activeProfile.id) && (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs text-slate-400 font-semibold">
                    {t.socionics?.orSelectReadyProfile || 'Или выберите профиль с уже готовым анализом:'}
                  </span>
                  {readyProfiles.map((rp) => (
                    <button
                      key={rp.id}
                      type="button"
                      onClick={() => onSelectProfile(rp)}
                      className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                    >
                      <User className="w-3 h-3 text-emerald-400" />
                      <span>{rp.firstName} {rp.lastName}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          /* UNLOCKED SOCIONICS TEST QUESTIONNAIRE */
          <div className="space-y-6 animate-in fade-in">
            {/* Progress Tracker Bar */}
            <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
              <div className="flex items-center justify-between text-xs font-bold mb-2">
                <span className="text-slate-300">
                  {t.socionics?.screenProgress || 'Вопрос'} {currentIndex + 1} / {totalScreens}
                </span>
                <span className="text-indigo-400">
                  {answeredCount} {language === 'en' ? 'answered' : 'отвечено'} ({progressPercent}%)
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-indigo-500 to-cyan-400 h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>

              {/* Quick Screen Pill Jump Bar */}
              <div className="flex items-center gap-1.5 overflow-x-auto pt-4 pb-1 scrollbar-thin">
                {screens.map((s, idx) => {
                  const isAnswered = answers[s.id] !== undefined;
                  const isCurrent = idx === currentIndex;
                  return (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-7 h-7 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center justify-center ${
                        isCurrent
                          ? 'bg-indigo-600 text-white ring-2 ring-indigo-400 shadow-md'
                          : isAnswered
                          ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Current Question Card */}
            {currentScreen && (
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
                <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                  <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-xs font-extrabold uppercase tracking-wider">
                    {getScreenText(currentScreen).domain}
                  </span>
                  <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                    {language === 'ru' ? 'Кейс' : language === 'es' ? 'Caso' : 'Scenario'} #{currentScreen.id}
                  </span>
                </div>

                {/* Case Title */}
                {getScreenText(currentScreen).title && (
                  <div className="mb-4">
                    <h3 className="text-sm font-extrabold uppercase tracking-wider text-indigo-400">
                      {getScreenText(currentScreen).title}
                    </h3>
                  </div>
                )}

                {/* Situation Description Box */}
                <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 mb-5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                    {language === 'ru' ? 'Ситуация:' : language === 'es' ? 'Situación:' : 'Situation:'}
                  </p>
                  <p className="text-base sm:text-lg text-slate-200 leading-relaxed font-normal">
                    {getScreenText(currentScreen).situation}
                  </p>
                </div>

                {/* Explicit Question */}
                <div className="mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-indigo-400 shrink-0 inline-block" />
                    <span>{getScreenText(currentScreen).question}</span>
                  </h2>
                </div>

                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3.5">
                  {t.socionics?.selectOptionPrompt || 'Выберите наиболее естественный для вас вариант поведения:'}
                </p>

                {/* Options List */}
                <div className="space-y-3">
                  {OPTION_KEYS.filter((key) => currentScreen.options && currentScreen.options[key]).map((key) => {
                    const isSelected = answers[currentScreen.id] === key;
                    const langKey = (language as Language) || 'ru';
                    const optText = currentScreen.options[key]?.[langKey] || currentScreen.options[key]?.ru || '';
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => handleSelectOption(key)}
                        className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all flex items-start gap-4 cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-950/80 border-indigo-500 text-white shadow-lg shadow-indigo-950/50'
                            : 'bg-slate-800/60 hover:bg-slate-800 border-slate-700/80 text-slate-200 hover:border-slate-600'
                        }`}
                      >
                        <span
                          className={`w-8 h-8 rounded-xl font-black text-sm flex items-center justify-center shrink-0 transition-colors ${
                            isSelected
                              ? 'bg-indigo-600 text-white'
                              : 'bg-slate-700 text-slate-300'
                          }`}
                        >
                          {key}
                        </span>
                        <div className="text-sm font-medium leading-relaxed pt-1">
                          {optText}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Bottom Navigation Buttons */}
                <div className="flex items-center justify-between gap-4 mt-8 pt-6 border-t border-slate-800">
                  <button
                    type="button"
                    disabled={currentIndex === 0}
                    onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                    className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed text-slate-300 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>{t.socionics?.prevQuestion || '← Назад'}</span>
                  </button>

                  <div className="flex items-center gap-3">
                    {currentIndex < totalScreens - 1 ? (
                      <button
                        type="button"
                        onClick={() => setCurrentIndex(currentIndex + 1)}
                        className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shadow-md"
                      >
                        <span>{t.socionics?.nextQuestion || 'Следующий вопрос →'}</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      account ? (
                        <button
                          type="button"
                          disabled={evaluating || answeredCount === 0}
                          onClick={handleFinishTest}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg cursor-pointer"
                        >
                          {evaluating ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <CheckCircle className="w-4 h-4" />
                          )}
                          <span>{t.socionics?.finishTest || 'Завершить и узнать результат'}</span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => onOpenAuthModal && onOpenAuthModal('register')}
                          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 transition-all shadow-lg shadow-amber-600/30 cursor-pointer"
                        >
                          <Lock className="w-4 h-4 text-amber-200" />
                          <span>{t.auth?.authRequiredLockBtn || 'Войдите для расчета'}</span>
                        </button>
                      )
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )
      ) : (
        /* RESULTS VIEW */
        <div className="space-y-8 animate-in fade-in">
          {/* Main Sociotype Card */}
          <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl p-6 sm:p-8 shadow-2xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-slate-800">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-xs font-extrabold uppercase mb-2">
                  <Award className="w-3.5 h-3.5" />
                  <span>{t.socionics?.testCompleted || 'Тестирование завершено'}</span>
                </div>
                <div className="text-xs font-semibold text-slate-400 mb-1">
                  {t.socionics?.yourSociotype || 'Ваш ведущий тип личности'}
                </div>
                <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                  {testResult?.sociotype?.primary || 'ЛИЭ'}
                  <span className="text-indigo-400 text-xl sm:text-2xl font-bold ml-3">
                    ({language === 'en' ? testResult?.sociotype?.nameEn : testResult?.sociotype?.nameRu || ''})
                  </span>
                </h2>
                <div className="mt-2 text-xs font-semibold text-slate-400">
                  {language === 'en' ? testResult?.sociotype?.aliasEn : testResult?.sociotype?.aliasRu || ''} • {t.socionics?.quadra || 'Квадра'}: {testResult?.quadra?.classic || ''}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.socionics?.retakeTest || 'Пройти опрос заново'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => testResult && onOpenIntegrativeReport(testResult)}
                  className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-purple-900/40 transition-all cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  <span>{t.socionics?.generateIntegrativeReport || 'Сформировать 4-слойный отчет ИИ'}</span>
                </button>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {t.socionics?.quadra || 'Ваша ценностная среда (Квадра)'}
                </div>
                <div className="text-base font-extrabold text-white">
                  {testResult?.quadra?.classic || 'Гамма'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {language === 'es' ? testResult?.quadra?.descriptionEs : language === 'en' ? testResult?.quadra?.descriptionEn : testResult?.quadra?.descriptionRu || ''}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {t.socionics?.bashkuevQuadra || 'Ваша ключевая роль в обществе и команде'}
                </div>
                <div className="text-base font-extrabold text-indigo-300">
                  {testResult?.quadra?.bashkuev || 'Торговцы'}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {testResult?.quadra?.bashkuev === 'Духовники'
                    ? (language === 'en' ? 'Generation of fundamental meanings, ideas, and values' : language === 'es' ? 'Generación de significados fundamentales e ideas' : 'Генерация смыслов, идей и ценностных ориентиров')
                    : testResult?.quadra?.bashkuev === 'Аристократы'
                    ? (language === 'en' ? 'Management of structures, hierarchy, power, and status' : language === 'es' ? 'Gestión de estructuras, jerarquías, poder y estatus' : 'Управление структурами, властью, иерархией и статусом')
                    : testResult?.quadra?.bashkuev === 'Торговцы'
                    ? (language === 'en' ? 'Market exchange, entrepreneurship, and capital compounding' : language === 'es' ? 'Intercambios comerciales, emprendimiento e inversiones' : 'Рыночные обмены, предпринимательство, выгода и инвестиции')
                    : (language === 'en' ? 'Applied craftsmanship, production quality, and technologies' : language === 'es' ? 'Artesanía aplicada, calidad de producción y tecnología' : 'Прикладное мастерство, качество производства и технологии')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {t.socionics?.thinkingType || 'Стиль достижения целей'}
                </div>
                <div className="text-base font-extrabold text-cyan-300">
                  {testResult?.result_process?.type === 'result'
                    ? (t.socionics?.resultType || 'Фокус на результате (целеустремленность)')
                    : (t.socionics?.processType || 'Фокус на процессе (глубина и качество)')}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {testResult?.result_process?.type === 'result'
                    ? (language === 'en' ? 'Orientation towards the finish line, discrete achievements, and timely monetization' : language === 'es' ? 'Orientación hacia la meta final, resultados discretos y rentabilidad rápida' : 'Ориентация на финишную черту, дискретные результаты и быструю фиксацию эффекта')
                    : (language === 'en' ? 'Orientation towards continuous flow, meticulous nuance, and steady mastery' : language === 'es' ? 'Orientación hacia el flujo continuo, la calidad del detalle y la profundidad' : 'Ориентация на непрерывный поток, качество деталей и постепенное углубление процесса')}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
                <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1">
                  {t.socionics?.consistencyScore || 'Точность и искренность ответов'}
                </div>
                <div className="text-base font-extrabold text-emerald-400">
                  {Math.round((testResult?.validity?.consistency_score ?? 0.95) * 100)}%
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  {testResult?.validity?.social_desirability_bias === 'low'
                    ? (language === 'en' ? 'High validity, minimal social desirability bias' : language === 'es' ? 'Alta validez, sesgo de deseabilidad social mínimo' : 'Высокая достоверность, отсутствие социальной желательности')
                    : testResult?.validity?.social_desirability_bias === 'moderate'
                    ? (language === 'en' ? 'Moderate self-monitoring during response selection' : language === 'es' ? 'Autocontrol moderado en la selección de respuestas' : 'Умеренный самоконтроль при выборе ответов')
                    : (language === 'en' ? 'Elevated social desirability bias in responses' : language === 'es' ? 'Sesgo de deseabilidad social elevado' : 'Выраженная социальная желательность ответов')}
                </p>
              </div>
            </div>

            {/* Gatekeeper & Energy Efficiency Diagnostics */}
            {testResult?.energy_diagnostics && (
              <div
                className={`mt-6 p-5 sm:p-6 rounded-2xl border ${
                  testResult.energy_diagnostics.kpd < 1.0
                    ? 'bg-amber-950/40 border-amber-500/40'
                    : 'bg-emerald-950/30 border-emerald-500/30'
                }`}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-800">
                  <div>
                    <span className="text-[11px] font-black uppercase tracking-wider text-slate-400">
                      Психофизиологический слой (Gatekeeper)
                    </span>
                    <h3 className="text-base font-black text-white">
                      КПД энергосистемы: {testResult.energy_diagnostics.kpd.toFixed(2)}{' '}
                      <span
                        className={
                          testResult.energy_diagnostics.kpd < 1.0
                            ? 'text-amber-400 text-xs font-bold'
                            : 'text-emerald-400 text-xs font-bold'
                        }
                      >
                        {testResult.energy_diagnostics.kpd < 1.0
                          ? '(Дефицит / Снижение надежности)'
                          : '(Профицит / Ресурс в норме)'}
                      </span>
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold border border-slate-700">
                      Вход: {testResult.energy_diagnostics.energyIn.toFixed(1)}/20
                    </span>
                    <span className="text-xs px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-bold border border-slate-700">
                      Расход: {testResult.energy_diagnostics.energyOut.toFixed(1)}/20
                    </span>
                  </div>
                </div>

                <div className="mt-3 text-xs text-slate-300">
                  <p className="mb-2">
                    <strong>Ведущий кластер дефицита:</strong> Кластер {testResult.energy_diagnostics.dominantCluster} ({testResult.energy_diagnostics.clusterNameRu})
                  </p>
                  {testResult.energy_diagnostics.protocol && (
                    <div className="p-3 rounded-xl bg-slate-900/80 border border-slate-800">
                      <div className="text-amber-300 font-bold mb-1">
                        Протокол: {testResult.energy_diagnostics.protocol.title} ({testResult.energy_diagnostics.protocol.source})
                      </div>
                      <p className="text-[11px] text-slate-400 mb-2">
                        Мишень: {testResult.energy_diagnostics.protocol.scientificBasis}
                      </p>
                      <div className="space-y-1 text-[11px] text-slate-300">
                        {testResult.energy_diagnostics.protocol.actionSteps.map((step, idx) => (
                          <div key={idx} className="flex items-start gap-1.5">
                            <span className="text-amber-400">•</span>
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Cognitive Hierarchy Section */}
            <div className="mt-8 pt-6 border-t border-slate-800">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-indigo-400" />
                <span>{t.socionics?.cognitiveHierarchy || 'Ваши сильные качества и зоны для роста'}</span>
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(testResult?.cognitive_profile?.normalizedFunctions || testResult?.cognitive_profile?.functions || {}).map(([funcKey, scoreVal]) => {
                  const score = Math.round(Number(scoreVal) || 0);
                  const isTop = (testResult?.cognitive_profile?.top3 || []).some((tItem) => tItem.func === funcKey);
                  const langKey = (language as Language) || 'ru';
                  const friendlyName = FUNCTION_FRIENDLY_NAMES[funcKey]?.[langKey] || funcKey;
                  return (
                    <div
                      key={funcKey}
                      className={`p-3.5 rounded-2xl border transition-all ${
                        isTop
                          ? 'bg-indigo-950/40 border-indigo-500/50 shadow-sm'
                          : 'bg-slate-950/50 border-slate-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-extrabold text-slate-200">
                          {friendlyName} {isTop && <span className="text-indigo-400 font-bold ml-1">★ {language === 'en' ? 'Leading' : language === 'es' ? 'Principal' : 'Ведущая'}</span>}
                        </span>
                        <span className="text-xs font-bold text-indigo-300">{score}%</span>
                      </div>
                      <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                        <div
                          className={`h-2 rounded-full transition-all duration-500 ${
                            isTop ? 'bg-indigo-500' : 'bg-slate-600'
                          }`}
                          style={{ width: `${Math.min(100, score)}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Test History Modal */}
      {viewHistoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl max-w-2xl w-full p-6 sm:p-8 max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-indigo-400" />
                <h3 className="text-lg font-bold text-white">
                  {t.socionics?.testHistoryTitle || 'Сохранённые результаты тестов'}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setViewHistoryModal(false)}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
              >
                ✕
              </button>
            </div>

            {testHistory.length === 0 ? (
              <p className="text-xs text-slate-400 py-8 text-center">
                {t.socionics?.noSavedTests || 'Нет сохранённых результатов.'}
              </p>
            ) : (
              <div className="space-y-3">
                {testHistory.map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-slate-700 transition-all flex items-center justify-between gap-4"
                  >
                    <div>
                      <div className="text-sm font-bold text-slate-100 flex items-center gap-2">
                        <span>{item?.sociotype?.primary || 'ЛИЭ'}</span>
                        <span className="text-xs text-slate-400">({item?.sociotype?.nameRu || ''})</span>
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {item.profileName || 'Профиль'} • {new Date(item.completedAt).toLocaleDateString()}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setTestResult(item);
                          setViewHistoryModal(false);
                        }}
                        className="px-3 py-1.5 rounded-xl bg-indigo-600/80 hover:bg-indigo-600 text-white text-xs font-bold transition-colors cursor-pointer"
                      >
                        Открыть
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
