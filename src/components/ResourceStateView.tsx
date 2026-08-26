/**
 * Resource State & Energy Efficiency Diagnostic View (7 Psychophysiological Screens)
 * Evaluates Energy Efficiency Ratio (КПД = EnergyIn / EnergyOut),
 * Dominant Cluster (A, B, C, D, E), Gatekeeper Reliability Flag,
 * and Evidence-Based Physiological Recovery Protocols (Huberman, McKeown, Rosenberg, Nagoski, Sharot, Fogg, Levine).
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Zap,
  CheckCircle,
  AlertTriangle,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Sparkles,
  Shield,
  Activity,
  Heart,
  Wind,
  Brain,
  CheckCircle2,
  Clock,
  User,
  BookOpen,
  Sliders,
  Award,
  ChevronRight,
  RotateCcw,
  Lock,
} from 'lucide-react';
import { useI18n } from '../i18n/context.js';
import { Language } from '../i18n/types.js';
import { api } from '../services/api.js';
import { PersonProfile, Account } from '../types/domain.js';
import {
  EnergyScreen,
  EnergyDiagnosticsResult,
  OptionKey,
  EnergyCluster,
} from '../types/socionics.js';
import { AuthRequiredBanner } from './AuthRequiredBanner.js';

interface ResourceStateViewProps {
  activeProfile: PersonProfile | null;
  profiles: PersonProfile[];
  onSelectProfile: (profile: PersonProfile) => void;
  onNavigateToSocionics: (energyAnswers?: Record<number, OptionKey>) => void;
  onNavigateToMatrix: () => void;
  account?: Account | null;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
}

const CLUSTER_BADGE_COLORS: Record<EnergyCluster, { bg: string; border: string; text: string; ring: string }> = {
  A: { bg: 'bg-emerald-950/40', border: 'border-emerald-500/50', text: 'text-emerald-300', ring: 'ring-emerald-500' },
  B: { bg: 'bg-cyan-950/40', border: 'border-cyan-500/50', text: 'text-cyan-300', ring: 'ring-cyan-500' },
  C: { bg: 'bg-amber-950/40', border: 'border-amber-500/50', text: 'text-amber-300', ring: 'ring-amber-500' },
  D: { bg: 'bg-rose-950/40', border: 'border-rose-500/50', text: 'text-rose-300', ring: 'ring-rose-500' },
  E: { bg: 'bg-purple-950/40', border: 'border-purple-500/50', text: 'text-purple-300', ring: 'ring-purple-500' },
};

export const ResourceStateView: React.FC<ResourceStateViewProps> = ({
  activeProfile,
  profiles,
  onSelectProfile,
  onNavigateToSocionics,
  onNavigateToMatrix,
  account,
  onOpenAuthModal,
}) => {
  const { t, language } = useI18n();
  const [screens, setScreens] = useState<EnergyScreen[]>([]);
  const [currentIndex, setCurrentIndex] = useState<number>(0);
  const [answers, setAnswers] = useState<Record<number, OptionKey>>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [evaluating, setEvaluating] = useState<boolean>(false);
  const [result, setResult] = useState<EnergyDiagnosticsResult | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);

  useEffect(() => {
    async function loadScreens() {
      setLoading(true);
      try {
        const { screens: data } = await api.getEnergyScreens();
        setScreens(data || []);
      } catch (err) {
        console.error('Failed to load energy screens:', err);
      } finally {
        setLoading(false);
      }
    }
    loadScreens();
  }, []);

  const totalScreens = screens.length || 7;
  const answeredCount = Object.keys(answers).length;
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

    // Auto advance if not on the last screen
    if (currentIndex < totalScreens - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleCalculateEnergy = async () => {
    if (!account) {
      if (onOpenAuthModal) onOpenAuthModal('register');
      return;
    }

    if (answeredCount < totalScreens) {
      if (!confirm(`Вы ответили на ${answeredCount} из ${totalScreens} вопросов. Рассчитать предварительный КПД?`)) {
        return;
      }
    }

    setEvaluating(true);
    try {
      const subjectName = activeProfile
        ? `${activeProfile.firstName} ${activeProfile.lastName || ''}`.trim()
        : 'Клиент';

      const res = await api.evaluateEnergy({
        answers,
        profileId: activeProfile?.id,
        profileName: subjectName,
      });

      setResult(res.result.diagnostics);
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 4000);
    } catch (err: any) {
      if (err?.requiresAuth && onOpenAuthModal) {
        onOpenAuthModal('login');
      } else {
        alert(`Ошибка оценки ресурсного состояния: ${err?.message || 'Неизвестная ошибка'}`);
      }
    } finally {
      setEvaluating(false);
    }
  };

  const handleReset = () => {
    setAnswers({});
    setCurrentIndex(0);
    setResult(null);
  };

  const getScreenText = (screen: EnergyScreen) => {
    const langKey = (language as Language) || 'ru';
    return {
      title: screen.title?.[langKey] || screen.title?.ru || `Экран Э-${screen.id}`,
      situation: screen.situation?.[langKey] || screen.situation?.ru || '',
      question: screen.question?.[langKey] || screen.question?.ru || '',
    };
  };

  const OPTION_KEYS: OptionKey[] = ['A', 'B', 'C', 'D', 'E'];

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-12 h-12 border-4 border-cyan-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-400 font-semibold">
          {language === 'en'
            ? 'Preparing resource and efficiency test...'
            : language === 'es'
            ? 'Preparando test de vitalidad y recursos...'
            : 'Подготовка вопросов теста ресурсности...'}
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
          moduleName={t.energy?.title || 'Диагностика энергоэффективности'}
          className="mb-6"
        />
      )}

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-cyan-950 via-slate-900 to-indigo-950 border border-cyan-500/30 p-6 sm:p-8 mb-8 shadow-xl">
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-400/40 text-cyan-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{t.energy?.badge || 'ПРОВЕРКА УРОВНЯ ЭНЕРГИИ И ГОТОВНОСТИ'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {t.energy?.title || 'Тест на запас сил и личную продуктивность (КПД)'}
            </h1>
            <p className="mt-2 text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.energy?.subtitle ||
                '7 простых вопросов о вашем самочувствии, сне и фокусе. Поможет узнать, полны ли вы сил для новых целей или телу требуется короткая перезагрузка.'}
            </p>
          </div>

          {/* Profile Selector */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 shrink-0">
            {profiles.length > 0 && (
              <div className="relative">
                <select
                  aria-label="Select profile for energy test"
                  value={activeProfile?.id || ''}
                  onChange={(e) => {
                    const p = profiles.find((item) => item.id === e.target.value);
                    if (p) onSelectProfile(p);
                  }}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800/90 text-slate-200 border border-slate-700 text-xs font-bold focus:outline-none focus:ring-2 focus:ring-cyan-500 cursor-pointer"
                >
                  <option value="">{t.socionics?.guestTesting || 'Гостевой режим'}</option>
                  {profiles.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.firstName} {p.lastName} ({p.relationType})
                    </option>
                  ))}
                </select>
              </div>
            )}

            {result && (
              <button
                type="button"
                onClick={handleReset}
                className="px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.energy?.retakeBtn || 'Пройти тест заново'}</span>
              </button>
            )}
          </div>
        </div>

        {/* Active Profile Info */}
        {activeProfile && (
          <div className="mt-4 pt-4 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <User className="w-4 h-4 text-cyan-400" />
              <span className="font-semibold">{activeProfile.firstName} {activeProfile.lastName}</span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400">{activeProfile.birthDate || 'Дата рождения не указана'}</span>
            </div>
            {result ? (
              <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold text-xs ${
                result.kpd >= 1.0 ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/10 text-amber-400 border border-amber-500/30'
              }`}>
                <Activity className="w-3.5 h-3.5" />
                <span>КПД: {result.kpd} ({result.scenario === 'A' ? (t.energy?.scenarioSurplus || 'Профицит сил') : (t.energy?.scenarioDeficit || 'Дефицит сил')})</span>
              </span>
            ) : null}
          </div>
        )}
      </div>

      {/* Main Container */}
      {!result ? (
        /* QUESTIONNAIRE MODE */
        <div className="space-y-6 animate-in fade-in">
          {/* Progress Tracker Bar */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl p-4 sm:p-5 shadow-sm">
            <div className="flex items-center justify-between text-xs font-bold mb-2">
              <span className="text-slate-300">
                {t.energy?.stepProgress || 'Вопрос'} {currentIndex + 1} / {totalScreens}
              </span>
              <span className="text-cyan-400">
                {answeredCount} {t.energy?.answered || 'отвечено'} ({progressPercent}%)
              </span>
            </div>
            <div className="w-full bg-slate-800 rounded-full h-2.5 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-500 to-indigo-500 h-2.5 rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            {/* Quick Screen Pill Jump Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pt-4 pb-1 scrollbar-thin">
              {screens.map((s, idx) => {
                const isAnswered = answers[s.id] !== undefined;
                const isCurrent = idx === currentIndex;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => setCurrentIndex(idx)}
                    className={`flex-1 min-w-[42px] h-9 rounded-xl text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      isCurrent
                        ? 'bg-cyan-600 text-white ring-2 ring-cyan-400 shadow-md shadow-cyan-600/30'
                        : isAnswered
                        ? 'bg-emerald-950/70 text-emerald-300 border border-emerald-500/40'
                        : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                    }`}
                  >
                    <span>№{idx + 1}</span>
                    {isAnswered && <CheckCircle className="w-3 h-3 text-emerald-400" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Instruction for user */}
          <div className="bg-slate-900/70 border border-cyan-900/40 rounded-2xl p-4 sm:p-5 flex items-start sm:items-center gap-3.5 shadow-sm">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center shrink-0 text-cyan-400">
              <Sparkles className="w-4 h-4" />
            </div>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              <span className="font-bold text-cyan-300">
                {language === 'ru' ? 'Инструкция:' : language === 'es' ? 'Instrucción:' : 'Instruction:'}{' '}
              </span>
              {t.energy?.userInstruction ||
                (language === 'ru'
                  ? 'Ответьте, опираясь на ваше состояние за последние 3–5 дней. Здесь нет правильных ответов, есть только факты.'
                  : language === 'es'
                  ? 'Responde según tu estado en los últimos 3–5 días. No hay respuestas correctas o incorrectas, solo hechos.'
                  : 'Answer based on your state over the last 3–5 days. There are no right or wrong answers, only facts.')}
            </p>
          </div>

          {/* Current Question Card */}
          {currentScreen && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-xl">
              <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
                <span className="px-3 py-1 rounded-full bg-cyan-950 text-cyan-300 border border-cyan-800/60 text-xs font-extrabold uppercase tracking-wider">
                  {t.energy?.markerPrefix || 'Показатель'} #{currentScreen.id}
                </span>
                <span className="text-xs font-bold text-slate-400 bg-slate-800/80 px-3 py-1 rounded-full border border-slate-700">
                  {currentScreen.id === 1 ? (t.energy?.markerCategories?.morningTone || 'Утренний старт') :
                   currentScreen.id === 2 ? (t.energy?.markerCategories?.stressResponse || 'Внезапное препятствие') :
                   currentScreen.id === 3 ? (t.energy?.markerCategories?.focusStability || 'Паттерн-интеррапт') :
                   currentScreen.id === 4 ? (t.energy?.markerCategories?.infoNoise || 'Расход последнего ресурса') :
                   currentScreen.id === 5 ? (t.energy?.markerCategories?.sleepArchitecture || 'Социальное трение') :
                   currentScreen.id === 6 ? (t.energy?.markerCategories?.moneyReflex || 'Соматический маркер') :
                   (t.energy?.markerCategories?.recoveryPower || 'Горизонт планирования')}
                </span>
              </div>

              {/* Marker Title */}
              <h2 className="text-lg sm:text-xl font-bold text-white mb-4 leading-snug">
                {getScreenText(currentScreen).title}
              </h2>

              {/* Situation Box */}
              <div className="bg-slate-950/70 border border-slate-800/90 rounded-2xl p-4 sm:p-5 mb-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  {t.energy?.situationLabel || 'Жизненная ситуация:'}
                </p>
                <p className="text-base text-slate-200 leading-relaxed font-normal">
                  {getScreenText(currentScreen).situation}
                </p>
              </div>

              {/* Question */}
              <div className="mb-6">
                <p className="text-base font-bold text-cyan-300 leading-snug flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 shrink-0 inline-block" />
                  <span>{getScreenText(currentScreen).question}</span>
                </p>
              </div>

              {/* 5 Options List */}
              <div className="space-y-3">
                {OPTION_KEYS.map((key) => {
                  const optText =
                    currentScreen.options[key]?.[language as Language] ||
                    currentScreen.options[key]?.ru ||
                    '';
                  const isSelected = answers[currentScreen.id] === key;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => handleSelectOption(key)}
                      className={`w-full text-left p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                        isSelected
                          ? 'bg-cyan-950/60 border-cyan-500 text-white shadow-lg shadow-cyan-950/50 ring-1 ring-cyan-500'
                          : 'bg-slate-950/50 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800/50'
                      }`}
                    >
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center font-black text-xs shrink-0 transition-all ${
                          isSelected
                            ? 'bg-cyan-500 text-slate-950 font-black shadow-md'
                            : 'bg-slate-800 text-slate-300 border border-slate-700'
                        }`}
                      >
                        {key}
                      </span>
                      <span className="text-sm leading-relaxed font-medium flex-1 pt-0.5">
                        {optText}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Navigation Controls */}
              <div className="mt-8 pt-6 border-t border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
                  disabled={currentIndex === 0}
                  className="px-4 py-2.5 rounded-xl bg-slate-800 text-slate-300 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>{t.energy?.prevMarker || '← Назад'}</span>
                </button>

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {currentIndex < totalScreens - 1 && (
                    <button
                      type="button"
                      onClick={() => setCurrentIndex(currentIndex + 1)}
                      className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs sm:text-sm font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer border border-slate-700"
                    >
                      <span>{t.energy?.nextMarker || 'Следующий вопрос'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}

                  {(currentIndex === totalScreens - 1 || answeredCount === totalScreens) && (
                    account ? (
                      <button
                        type="button"
                        onClick={handleCalculateEnergy}
                        disabled={evaluating || answeredCount === 0}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-indigo-600 hover:from-cyan-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/30 transition-all cursor-pointer disabled:opacity-40"
                      >
                        {evaluating ? (
                          <RefreshCw className="w-4 h-4 animate-spin" />
                        ) : (
                          <Zap className="w-4 h-4 text-cyan-200" />
                        )}
                        <span>{t.energy?.btnCalculate || 'Рассчитать ресурсность и КПД'}</span>
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => onOpenAuthModal && onOpenAuthModal('register')}
                        className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 via-orange-600 to-indigo-600 hover:from-amber-500 hover:to-indigo-500 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-600/30 transition-all cursor-pointer"
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
      ) : (
        /* RESULTS & PHYSIOLOGICAL PROTOCOL VIEW */
        <div className="space-y-8 animate-in fade-in">
          {/* Top Score Matrix */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* КПД Gauge Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    {t.energy?.kpdScoreTitle || 'Энергоэффективность (КПД)'}
                  </span>
                  <Activity className="w-4 h-4 text-cyan-400" />
                </div>
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-black text-white">{result.kpd}</span>
                  <span className="text-xs font-bold text-slate-400">{t.energy?.kpdRatioLabel || 'Баланс (Приток / Расход)'}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.kpd >= 1.0
                    ? (t.energy?.highKpdDesc || 'Отличный результат! Вы полны сил и восстанавливаетесь быстрее, чем устаете.')
                    : (t.energy?.lowKpdDesc || 'Запас сил снижен: расход энергии опережает её восполнение.')}
                </p>
              </div>

              {/* Energy Balance Bar */}
              <div className="mt-4 pt-4 border-t border-slate-800/80 space-y-2">
                <div className="flex justify-between text-[11px] font-bold">
                  <span className="text-emerald-400">{t.energy?.energyInLabel || 'Приток сил'}: {result.energyIn}</span>
                  <span className="text-rose-400">{t.energy?.energyOutLabel || 'Расход сил'}: {result.energyOut}</span>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-2 flex overflow-hidden">
                  <div
                    className="bg-emerald-500 h-full"
                    style={{ width: `${Math.min(100, Math.round((result.energyIn / (result.energyIn + result.energyOut || 1)) * 100))}%` }}
                  />
                  <div
                    className="bg-rose-500 h-full"
                    style={{ width: `${Math.min(100, Math.round((result.energyOut / (result.energyIn + result.energyOut || 1)) * 100))}%` }}
                  />
                </div>
              </div>
            </div>

            {/* Dominant Cluster Card */}
            <div className={`rounded-3xl p-6 border shadow-xl flex flex-col justify-between ${CLUSTER_BADGE_COLORS[result.dominantCluster]?.bg || 'bg-slate-900'} ${CLUSTER_BADGE_COLORS[result.dominantCluster]?.border || 'border-slate-800'}`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    {t.energy?.dominantClusterTitle || 'Главный источник усталости'}
                  </span>
                  <span className={`px-2.5 py-0.5 rounded-full text-xs font-black uppercase ${CLUSTER_BADGE_COLORS[result.dominantCluster]?.text}`}>
                    {t.energy?.dominantClusterLabel || 'Кластер'} {result.dominantCluster}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-white mb-2 leading-tight">
                  {result.clusterNameRu}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.clusterDescriptionRu}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/60 flex items-center gap-2 text-xs font-bold text-slate-300">
                <Brain className="w-4 h-4 text-cyan-400" />
                <span>{t.energy?.neuroStatusLabel || 'Нейрогуморальный статус:'} {result.dominantCluster === 'A' || result.dominantCluster === 'B' ? 'Вентральный вагус / Оптимум' : result.dominantCluster === 'D' ? 'Симпатическая перегрузка' : result.dominantCluster === 'C' ? 'Дофаминовый дефицит' : 'Дорсальное оцепенение'}</span>
              </div>
            </div>

            {/* Gatekeeper Decision Card */}
            <div className={`rounded-3xl p-6 border shadow-xl flex flex-col justify-between ${result.kpd >= 1.0 ? 'bg-emerald-950/30 border-emerald-500/40' : 'bg-amber-950/30 border-amber-500/40'}`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
                    {t.energy?.gatekeeperTitle || 'Рекомендация по решениям'}
                  </span>
                  <Shield className={`w-4 h-4 ${result.kpd >= 1.0 ? 'text-emerald-400' : 'text-amber-400'}`} />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className={`px-2.5 py-1 rounded-xl text-xs font-black tracking-wider uppercase ${
                    result.kpd >= 1.0 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                  }`}>
                    {result.scenario === 'A' ? (t.energy?.scenarioSurplus || 'ЭНЕРГИИ ДОСТАТОЧНО (ПРОФИЦИТ)') : (t.energy?.scenarioDeficit || 'НУЖНА ПЕРЕЗАРЯДКА (ДЕФИЦИТ)')}
                  </span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">
                  {result.scenario === 'A'
                    ? (t.energy?.scenarioSurplusDesc || 'Вы в отличной форме. Все тесты личности и финансовые решения будут максимально объективными.')
                    : (t.energy?.scenarioDeficitDesc || 'Сейчас мозг экономит ресурсы. Рекомендуем уделить 1-2 дня простому отдыху.')}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-800/60">
                <span className={`text-[11px] font-bold flex items-center gap-1.5 ${result.kpd >= 1.0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {result.kpd >= 1.0 ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertTriangle className="w-3.5 h-3.5" />}
                  <span>{result.kpd >= 1.0 ? (t.energy?.readyForAction || 'Высокая ясность ума и готовность к целям') : (t.energy?.needsRecharge || 'Требуется восполнение сил перед важными решениями')}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Physiological Protocol Card (Evidence-Based Huberman, McKeown, Rosenberg, Nagoski, Sharot, Fogg, Levine) */}
          {result.protocol && (
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-5">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-2 px-3 py-0.5 rounded-full bg-cyan-500/10 text-cyan-300 text-[11px] font-bold uppercase tracking-wider border border-cyan-500/30">
                    <Heart className="w-3 h-3 text-cyan-400" />
                    <span>{t.energy?.protocolBadge || 'Персональный план быстрой перезагрузки'}</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold text-white">
                    {result.protocol.title}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 bg-slate-950 px-3.5 py-1.5 rounded-xl border border-slate-800 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{t.energy?.durationLabel || 'Время эффекта:'} {result.protocol.duration}</span>
                </div>
              </div>

              {/* Scientific Sources Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-cyan-400 mb-1">
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>{t.energy?.sourcesTitle || 'На чём основаны советы:'}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {result.protocol.source}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800/80">
                  <div className="flex items-center gap-2 text-xs font-extrabold text-emerald-400 mb-1">
                    <Wind className="w-3.5 h-3.5" />
                    <span>{t.energy?.mechanismTitle || 'Как это работает для вашего тела:'}</span>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    {result.protocol.scientificBasis}
                  </p>
                </div>
              </div>

              {/* Step-by-Step Action Steps */}
              <div className="space-y-3 pt-2">
                <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-2">
                  <Sliders className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.energy?.actionStepsTitle || 'Простые действия для возвращения бодрости:'}</span>
                </h4>
                <div className="space-y-2.5">
                  {result.protocol.actionSteps.map((step, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-2xl bg-slate-950/40 border border-slate-800/60 flex items-start gap-3.5"
                    >
                      <span className="w-6 h-6 rounded-lg bg-cyan-500/20 text-cyan-300 font-black text-xs flex items-center justify-center shrink-0 border border-cyan-500/30">
                        {idx + 1}
                      </span>
                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                        {step}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Somatic Cheat Code */}
              {result.protocol.cheatCode && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-950 to-indigo-950/60 border border-cyan-500/40 shadow-inner">
                  <div className="flex items-center gap-2 text-xs font-black uppercase tracking-wider text-cyan-300 mb-1.5">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>{t.energy?.expressCheatCodeTitle || 'Экспресс-приём для снятия усталости за 90 секунд:'}</span>
                  </div>
                  <p className="text-xs sm:text-sm font-semibold text-slate-100 leading-relaxed">
                    {result.protocol.cheatCode}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Action Pathways & Integration */}
          <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
            <button
              type="button"
              onClick={handleReset}
              className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer"
            >
              <RotateCcw className="w-4 h-4 text-cyan-400" />
              <span>{t.energy?.retakeBtn || 'Пройти тест энергии заново'}</span>
            </button>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={onNavigateToMatrix}
                className="px-5 py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 transition-colors cursor-pointer border border-slate-700"
              >
                <span>{t.energy?.goToMatrixBtn || 'Перейти к финансовой матрице'}</span>
              </button>

              <button
                type="button"
                onClick={() => onNavigateToSocionics(answers)}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>{t.energy?.goToSocionicsBtn || 'Узнать свой тип личности (с учётом энергии)'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
