import React, { useState, useEffect } from 'react';
import {
  X,
  CheckCircle2,
  Check,
  Zap,
  Brain,
  Grid,
  Layers,
  Sparkles,
  Award,
  Calendar,
  User,
  ArrowRight,
  Copy,
  ExternalLink,
  Shield,
  Activity,
  AlertCircle,
  HelpCircle,
  Sliders,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { useI18n } from '../i18n/context.js';
import { Language } from '../i18n/types.js';
import { api } from '../services/api.js';
import { DiagnosticAnalysisRecord } from '../types/domain.js';
import {
  SocionicsTestResult,
  FullIntegrativeAnalysisRecord,
  EnergyEvaluationRecord,
  SocionicsScreen,
  EnergyScreen,
  OptionKey,
  EnergyCluster,
} from '../types/socionics.js';

export type UnifiedHistoryItemType = 'matrix' | 'socionics' | 'energy' | 'integrative';

export interface UnifiedHistoryRecord {
  type: UnifiedHistoryItemType;
  id: string;
  title: string;
  subtitle: string;
  completedAt: string;
  profileName: string;
  profileId?: string;
  matrixData?: DiagnosticAnalysisRecord;
  socionicsData?: SocionicsTestResult;
  energyData?: EnergyEvaluationRecord;
  integrativeData?: FullIntegrativeAnalysisRecord;
}

interface TestAnswersModalProps {
  record: UnifiedHistoryRecord;
  isOpen: boolean;
  onClose: () => void;
  onNavigateToModule?: (type: UnifiedHistoryItemType, record: UnifiedHistoryRecord) => void;
}

const CLUSTER_NAMES: Record<EnergyCluster, { ru: string; en: string; es: string }> = {
  A: { ru: 'Высокая ресурсность (Профицит)', en: 'High Vitality (Surplus)', es: 'Alta vitalidad (Superávit)' },
  B: { ru: 'Стабильный оптимум (Баланс)', en: 'Steady Optimum (Balance)', es: 'Óptimo estable (Equilibrio)' },
  C: { ru: 'Скрытый дефицит (Усталость)', en: 'Latent Deficit (Fatigue)', es: 'Déficit latente (Fatiga)' },
  D: { ru: 'Острый симпатический стресс', en: 'Acute Sympathetic Stress', es: 'Estrés simpático agudo' },
  E: { ru: 'Глубокое дорсальное истощение', en: 'Deep Dorsal Burnout', es: 'Agotamiento dorsal profundo' },
};

export const TestAnswersModal: React.FC<TestAnswersModalProps> = ({
  record,
  isOpen,
  onClose,
  onNavigateToModule,
}) => {
  const { t, language } = useI18n();
  const [activeTab, setActiveTab] = useState<'questions' | 'scores' | 'recommendations'>('questions');
  const [copiedSummary, setCopiedSummary] = useState(false);

  // Screen cache for displaying actual question texts
  const [socionicsScreens, setSocionicsScreens] = useState<SocionicsScreen[]>([]);
  const [energyScreens, setEnergyScreens] = useState<EnergyScreen[]>([]);
  const [loadingScreens, setLoadingScreens] = useState(false);
  const [expandedQuestion, setExpandedQuestion] = useState<number | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    async function loadScreensIfNeeded() {
      if (record.type === 'socionics' || record.type === 'integrative') {
        if (socionicsScreens.length === 0) {
          setLoadingScreens(true);
          try {
            const res = await api.getSocionicsScreens();
            setSocionicsScreens(res.screens || []);
          } catch (err) {
            console.error('Failed to load socionics screens:', err);
          } finally {
            setLoadingScreens(false);
          }
        }
      }
      if (record.type === 'energy' || record.type === 'integrative') {
        if (energyScreens.length === 0) {
          setLoadingScreens(true);
          try {
            const res = await api.getEnergyScreens();
            setEnergyScreens(res.screens || []);
          } catch (err) {
            console.error('Failed to load energy screens:', err);
          } finally {
            setLoadingScreens(false);
          }
        }
      }
    }

    loadScreensIfNeeded();
  }, [isOpen, record.type]);

  if (!isOpen) return null;

  const handleCopySummary = () => {
    let summaryText = '';
    if (record.type === 'matrix' && record.matrixData) {
      const v = record.matrixData.layer1.vectors;
      summaryText = `[Финансовая матрица] ${record.profileName}\nV1=${v.v1_life_scenario.value}, V2=${v.v2_work_model.value}, V3=${v.v3_emotional_background.value}, V4=${v.v4_resource_management.value}\n${record.matrixData.layer2?.executiveSummary || ''}`;
    } else if (record.type === 'socionics' && record.socionicsData) {
      summaryText = `[Соционика] ${record.profileName}\nСоциотип: ${record.socionicsData.sociotype.primary} (${record.socionicsData.sociotype.name[language] || record.socionicsData.sociotype.name.ru})\nКвадра: ${record.socionicsData.quadra.classic}\nУверенность: ${record.socionicsData.confidenceScore}%`;
    } else if (record.type === 'energy' && record.energyData) {
      summaryText = `[Ресурсность и КПД] ${record.profileName}\nКПД: ${record.energyData.diagnostics.kpd}\nКластер: ${record.energyData.diagnostics.dominantCluster}\nСценарий: ${record.energyData.diagnostics.scenario}`;
    } else if (record.type === 'integrative' && record.integrativeData) {
      summaryText = `[Комплексный 4-слойный анализ] ${record.profileName}\nСоциотип: ${record.integrativeData.socionicsResult?.sociotype?.primary}\nАрхетип: ${record.integrativeData.integrativeReport?.dayArchetype?.archetypeTitle}\nРычаг: ${record.integrativeData.integrativeReport?.mainLever?.title}`;
    }

    navigator.clipboard.writeText(summaryText);
    setCopiedSummary(true);
    setTimeout(() => setCopiedSummary(false), 2500);
  };

  const getModuleBadge = () => {
    switch (record.type) {
      case 'matrix':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-cyan-950/80 text-cyan-300 border border-cyan-500/40">
            <Grid className="w-3.5 h-3.5" />
            <span>{t.history.matrixModule}</span>
          </span>
        );
      case 'socionics':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-950/80 text-purple-300 border border-purple-500/40">
            <Brain className="w-3.5 h-3.5" />
            <span>{t.history.socionicsModule}</span>
          </span>
        );
      case 'energy':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-300 border border-emerald-500/40">
            <Zap className="w-3.5 h-3.5" />
            <span>{t.history.energyModule}</span>
          </span>
        );
      case 'integrative':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-300 border border-amber-500/40">
            <Layers className="w-3.5 h-3.5" />
            <span>{t.history.integrativeModule}</span>
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden my-auto">
        
        {/* Modal Header */}
        <div className="p-5 sm:p-6 border-b border-slate-800 flex items-start justify-between gap-4 bg-slate-950/60 shrink-0">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              {getModuleBadge()}
              <div className="flex items-center gap-1 text-xs text-slate-400 font-mono">
                <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                <span>{new Date(record.completedAt).toLocaleString()}</span>
              </div>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-bold text-white flex items-center gap-2">
              <span>{record.profileName}</span>
              <span className="text-slate-500 text-sm font-normal">({record.title})</span>
            </h2>
            <p className="text-xs text-slate-400">
              {record.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopySummary}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer text-xs flex items-center gap-1.5 border border-slate-700"
              title={t.history.exportSummary}
            >
              {copiedSummary ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copiedSummary ? t.history.summaryCopied : t.history.exportSummary}</span>
            </button>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors cursor-pointer border border-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Tabs */}
        <div className="flex border-b border-slate-800 bg-slate-900/90 px-6 shrink-0 gap-2 overflow-x-auto">
          <button
            onClick={() => setActiveTab('questions')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'questions'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>{t.history.answersTabQuestions}</span>
          </button>

          <button
            onClick={() => setActiveTab('scores')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'scores'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sliders className="w-4 h-4" />
            <span>{t.history.answersTabScores}</span>
          </button>

          <button
            onClick={() => setActiveTab('recommendations')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'recommendations'
                ? 'border-indigo-500 text-indigo-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>{t.history.answersTabRecommendations}</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-6">

          {/* TAB 1: QUESTIONS & ANSWERS */}
          {activeTab === 'questions' && (
            <div className="space-y-4">
              {/* SOCIONICS QUESTIONS */}
              {record.type === 'socionics' && record.socionicsData && (
                <div className="space-y-3">
                  <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div className="text-xs text-purple-200">
                      <span className="font-bold">30 диагностических экранов</span> • Ответы сохранены и привязаны к когнитивным шкалам
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-purple-900/60 text-purple-300 border border-purple-500/40">
                      30/30 пройдено
                    </span>
                  </div>

                  {loadingScreens ? (
                    <div className="p-8 text-center text-slate-400 text-xs">Загрузка вопросов...</div>
                  ) : (
                    socionicsScreens.map((screen) => {
                      const selectedOptionKey = record.socionicsData?.answers?.[screen.id];
                      const isExpanded = expandedQuestion === screen.id;

                      return (
                        <div
                          key={screen.id}
                          className={`rounded-2xl border transition-all ${
                            selectedOptionKey
                              ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                              : 'bg-slate-950/30 border-slate-900'
                          }`}
                        >
                          <div
                            onClick={() => setExpandedQuestion(isExpanded ? null : screen.id)}
                            className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-500/30">
                                  #{screen.id}
                                </span>
                                <span className="text-xs text-slate-400 font-semibold">
                                  {screen.blockTitle?.[language] || screen.blockTitle?.ru}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-100">
                                {screen.title?.[language] || screen.title?.ru}
                              </h4>
                              <p className="text-xs text-slate-400 line-clamp-1">
                                {screen.question?.[language] || screen.question?.ru}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {selectedOptionKey && (
                                <span className="px-3 py-1 rounded-xl bg-purple-600/30 border border-purple-500/50 text-purple-200 text-xs font-bold font-mono flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-purple-400" />
                                  <span>{t.history.yourChoice}: {selectedOptionKey}</span>
                                </span>
                              )}
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </div>
                          </div>

                          {/* Expanded Full Screen Question Details & Options */}
                          {isExpanded && (
                            <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-3">
                              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                                <span className="text-indigo-400 font-semibold block mb-0.5">Ситуационный контекст:</span>
                                {screen.situation?.[language] || screen.situation?.ru}
                              </div>

                              <p className="text-xs font-semibold text-slate-200">
                                {screen.question?.[language] || screen.question?.ru}
                              </p>

                              <div className="space-y-2 pt-1">
                                {(['A', 'B', 'C', 'D', 'E'] as OptionKey[]).map((optKey) => {
                                  const optText = screen.options?.[optKey]?.[language] || screen.options?.[optKey]?.ru;
                                  const isSelected = selectedOptionKey === optKey;

                                  return (
                                    <div
                                      key={optKey}
                                      className={`p-3 rounded-xl text-xs flex items-start gap-3 border transition-all ${
                                        isSelected
                                          ? 'bg-purple-950/60 border-purple-500/70 text-purple-100 ring-1 ring-purple-500/40 shadow-sm'
                                          : 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                                      }`}
                                    >
                                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                        isSelected ? 'bg-purple-600 text-white' : 'bg-slate-800 text-slate-400'
                                      }`}>
                                        {optKey}
                                      </span>
                                      <div className="flex-1 leading-relaxed">
                                        <span>{optText}</span>
                                        {isSelected && (
                                          <span className="block mt-1 text-[10px] text-purple-300 font-semibold font-mono">
                                            ✓ {t.history.selectedAnswer}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* ENERGY QUESTIONS */}
              {record.type === 'energy' && record.energyData && (
                <div className="space-y-3">
                  <div className="bg-emerald-950/30 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between gap-3">
                    <div className="text-xs text-emerald-200">
                      <span className="font-bold">7 психофизиологических экранов</span> • Замер витального тонуса, симпатической нагрузки и восстановления
                    </div>
                    <span className="text-xs font-mono px-2.5 py-1 rounded-lg bg-emerald-900/60 text-emerald-300 border border-emerald-500/40">
                      7/7 пройдено
                    </span>
                  </div>

                  {loadingScreens ? (
                    <div className="p-8 text-center text-slate-400 text-xs">Загрузка экранов...</div>
                  ) : (
                    energyScreens.map((screen) => {
                      const selectedOptionKey = record.energyData?.answers?.[screen.id];
                      const isExpanded = expandedQuestion === screen.id || expandedQuestion === null;

                      return (
                        <div
                          key={screen.id}
                          className="rounded-2xl border bg-slate-950/60 border-slate-800 hover:border-slate-700 transition-all overflow-hidden"
                        >
                          <div
                            onClick={() => setExpandedQuestion(expandedQuestion === screen.id ? -1 : screen.id)}
                            className="p-4 flex items-start justify-between gap-3 cursor-pointer select-none"
                          >
                            <div className="space-y-1">
                              <div className="flex items-center gap-2">
                                <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-500/30">
                                  Экран #{screen.id}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-slate-100">
                                {screen.title?.[language] || screen.title?.ru}
                              </h4>
                              <p className="text-xs text-slate-400">
                                {screen.question?.[language] || screen.question?.ru}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 shrink-0">
                              {selectedOptionKey && (
                                <span className="px-3 py-1 rounded-xl bg-emerald-600/30 border border-emerald-500/50 text-emerald-200 text-xs font-bold font-mono flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                                  <span>{t.history.yourChoice}: {selectedOptionKey}</span>
                                </span>
                              )}
                              {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </div>
                          </div>

                          {isExpanded && (
                            <div className="px-4 pb-4 pt-2 border-t border-slate-800/80 space-y-3">
                              <div className="bg-slate-900/80 p-3 rounded-xl border border-slate-800 text-xs text-slate-300">
                                <span className="text-emerald-400 font-semibold block mb-0.5">Контекст:</span>
                                {screen.situation?.[language] || screen.situation?.ru}
                              </div>

                              <div className="space-y-2 pt-1">
                                {(['A', 'B', 'C', 'D', 'E'] as OptionKey[]).map((optKey) => {
                                  const optText = screen.options?.[optKey]?.[language] || screen.options?.[optKey]?.ru;
                                  const isSelected = selectedOptionKey === optKey;

                                  return (
                                    <div
                                      key={optKey}
                                      className={`p-3 rounded-xl text-xs flex items-start gap-3 border transition-all ${
                                        isSelected
                                          ? 'bg-emerald-950/60 border-emerald-500/70 text-emerald-100 ring-1 ring-emerald-500/40 shadow-sm'
                                          : 'bg-slate-900/40 border-slate-800/60 text-slate-400'
                                      }`}
                                    >
                                      <span className={`w-5 h-5 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${
                                        isSelected ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                                      }`}>
                                        {optKey}
                                      </span>
                                      <div className="flex-1 leading-relaxed">
                                        <span>{optText}</span>
                                        {isSelected && (
                                          <span className="block mt-1 text-[10px] text-emerald-300 font-semibold font-mono">
                                            ✓ {t.history.selectedAnswer}
                                          </span>
                                        )}
                                      </div>
                                    </div>
                                  );
                                })}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {/* MATRIX INPUT PARAMETERS */}
              {record.type === 'matrix' && record.matrixData && (
                <div className="space-y-4">
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Входные параметры расчета
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">Дата рождения</span>
                        <span className="text-sm font-bold text-white font-mono">
                          {record.matrixData.layer1?.user?.raw || 'Не указана'}
                        </span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">Линия матери</span>
                        <span className="text-sm font-bold text-white font-mono">
                          {record.matrixData.layer1?.mother?.raw || 'Не указана'}
                        </span>
                      </div>
                      <div className="bg-slate-900 p-3 rounded-xl border border-slate-800">
                        <span className="text-[11px] text-slate-400 block">Линия отца</span>
                        <span className="text-sm font-bold text-white font-mono">
                          {record.matrixData.layer1?.father?.raw || 'Не указана'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Mathematical reduction trace */}
                  <div className="bg-slate-950/60 border border-slate-800 rounded-2xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Математический след расчета 4 векторов
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div className="bg-slate-900/70 p-3.5 rounded-xl border border-cyan-500/20">
                        <span className="text-xs font-bold text-cyan-400 block">V1: Сценарий реализации</span>
                        <p className="text-xs text-slate-300 mt-1">
                          Базовый вектор потенциала и финансовой стратегии. Значение: <span className="font-bold text-white font-mono">{record.matrixData.layer1.vectors.v1_life_scenario.value}</span>
                        </p>
                      </div>
                      <div className="bg-slate-900/70 p-3.5 rounded-xl border border-indigo-500/20">
                        <span className="text-xs font-bold text-indigo-400 block">V2: Модель деятельности</span>
                        <p className="text-xs text-slate-300 mt-1">
                          Инструментальный способ монетизации и решений. Значение: <span className="font-bold text-white font-mono">{record.matrixData.layer1.vectors.v2_work_model.value}</span>
                        </p>
                      </div>
                      <div className="bg-slate-900/70 p-3.5 rounded-xl border border-pink-500/20">
                        <span className="text-xs font-bold text-pink-400 block">V3: Эмоционально-волевой фон</span>
                        <p className="text-xs text-slate-300 mt-1">
                          Стрессоустойчивость и внутренний драйв. Значение: <span className="font-bold text-white font-mono">{record.matrixData.layer1.vectors.v3_emotional_background.value}</span>
                        </p>
                      </div>
                      <div className="bg-slate-900/70 p-3.5 rounded-xl border border-amber-500/20">
                        <span className="text-xs font-bold text-amber-400 block">V4: Управление ресурсом</span>
                        <p className="text-xs text-slate-300 mt-1">
                          Удержание капитала и жизненных сил. Значение: <span className="font-bold text-white font-mono">{record.matrixData.layer1.vectors.v4_resource_management.value}</span>
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* INTEGRATIVE SYNTHESIS INPUTS */}
              {record.type === 'integrative' && record.integrativeData && (
                <div className="space-y-4">
                  <div className="bg-amber-950/30 border border-amber-500/30 rounded-2xl p-4 space-y-2">
                    <h4 className="text-sm font-bold text-amber-300">4-слойная модель синтеза</h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Объединяет матричный архетип дня рождения (Слой 1), соционический тип личности (Слой 2), психофизиологический статус ресурсности (Слой 3) и семейный импринт (Слой 4).
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-xs text-purple-400 font-semibold">Социотип субъекта</span>
                      <p className="text-base font-bold text-white">
                        {record.integrativeData.socionicsResult?.sociotype?.primary} — {record.integrativeData.socionicsResult?.sociotype?.name[language] || record.integrativeData.socionicsResult?.sociotype?.name.ru}
                      </p>
                    </div>

                    <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-1">
                      <span className="text-xs text-amber-400 font-semibold">Архетип дня рождения</span>
                      <p className="text-base font-bold text-white">
                        {record.integrativeData.integrativeReport?.dayArchetype?.archetypeTitle || 'Мастер потенциала'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: SCORES & DIAGNOSTIC BREAKDOWN */}
          {activeTab === 'scores' && (
            <div className="space-y-4">
              {/* MATRIX SCORES */}
              {record.type === 'matrix' && record.matrixData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30">
                      <span className="text-xs font-mono text-cyan-400 block">{t.history.v1Short}</span>
                      <span className="text-2xl font-black text-white font-mono">{record.matrixData.layer1.vectors.v1_life_scenario.value}</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-indigo-500/30">
                      <span className="text-xs font-mono text-indigo-400 block">{t.history.v2Short}</span>
                      <span className="text-2xl font-black text-white font-mono">{record.matrixData.layer1.vectors.v2_work_model.value}</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-pink-500/30">
                      <span className="text-xs font-mono text-pink-400 block">{t.history.v3Short}</span>
                      <span className="text-2xl font-black text-white font-mono">{record.matrixData.layer1.vectors.v3_emotional_background.value}</span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-amber-500/30">
                      <span className="text-xs font-mono text-amber-400 block">{t.history.v4Short}</span>
                      <span className="text-2xl font-black text-white font-mono">{record.matrixData.layer1.vectors.v4_resource_management.value}</span>
                    </div>
                  </div>

                  {record.matrixData.layer2 && (
                    <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="text-sm font-bold text-indigo-300">Резюме поведенческого анализа:</h4>
                      <p className="text-xs text-slate-300 leading-relaxed italic">
                        "{record.matrixData.layer2.executiveSummary}"
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* SOCIONICS SCORES */}
              {record.type === 'socionics' && record.socionicsData && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-r from-purple-950/60 to-indigo-950/60 p-6 rounded-2xl border border-purple-500/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <span className="text-xs text-purple-300 font-bold uppercase tracking-wider">Определенный соционический тип</span>
                      <h3 className="text-2xl font-black text-white mt-1">
                        {record.socionicsData.sociotype.primary} • {record.socionicsData.sociotype.name[language] || record.socionicsData.sociotype.name.ru}
                      </h3>
                      <p className="text-xs text-slate-300 mt-1">
                        Квадра: <span className="font-semibold text-purple-200">{record.socionicsData.quadra.classic}</span> ({record.socionicsData.quadra.friendlyName[language] || record.socionicsData.quadra.friendlyName.ru})
                      </p>
                    </div>

                    <div className="bg-slate-900/80 p-4 rounded-xl border border-purple-500/30 text-center shrink-0">
                      <span className="text-[10px] text-slate-400 block font-mono">Достоверность</span>
                      <span className="text-xl font-bold text-emerald-400">{record.socionicsData.confidenceScore}%</span>
                    </div>
                  </div>

                  {/* Cognitive balance chart */}
                  {record.socionicsData.functions && (
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                      <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Баланс когнитивных функций</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {Object.entries(record.socionicsData.functions).map(([fn, score]) => (
                          <div key={fn} className="bg-slate-900 p-2.5 rounded-xl border border-slate-800 text-center">
                            <span className="text-xs font-mono font-bold text-purple-400 block">{fn}</span>
                            <span className="text-sm font-bold text-white font-mono">{(score as number).toFixed(2)}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ENERGY SCORES */}
              {record.type === 'energy' && record.energyData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-center">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-emerald-500/30">
                      <span className="text-xs text-slate-400 block font-mono">Коэффициент КПД</span>
                      <span className="text-3xl font-black text-emerald-400 font-mono mt-1 block">
                        {record.energyData.diagnostics.kpd}x
                      </span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-cyan-500/30">
                      <span className="text-xs text-slate-400 block font-mono">Доминирующий кластер</span>
                      <span className="text-xl font-bold text-cyan-300 mt-1 block">
                        Кластер {record.energyData.diagnostics.dominantCluster}
                      </span>
                      <span className="text-[10px] text-slate-400 mt-0.5 block">
                        {CLUSTER_NAMES[record.energyData.diagnostics.dominantCluster]?.[language] || CLUSTER_NAMES[record.energyData.diagnostics.dominantCluster]?.ru}
                      </span>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-purple-500/30">
                      <span className="text-xs text-slate-400 block font-mono">Сценарий распределения</span>
                      <span className="text-xl font-bold text-purple-300 mt-1 block">
                        {record.energyData.diagnostics.scenario === 'A' ? 'Опережающий тонус (A)' : 'Истощающий расход (B)'}
                      </span>
                    </div>
                  </div>

                  <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 space-y-2">
                    <div className="flex items-center justify-between text-xs text-slate-300">
                      <span>Накопление энергии (Energy In): <strong className="text-emerald-400 font-mono">{record.energyData.diagnostics.energyIn}</strong></span>
                      <span>Расход энергии (Energy Out): <strong className="text-rose-400 font-mono">{record.energyData.diagnostics.energyOut}</strong></span>
                    </div>
                    <div className="w-full h-3 bg-slate-900 rounded-full overflow-hidden flex">
                      <div
                        className="bg-emerald-500 transition-all"
                        style={{ width: `${Math.min(100, (record.energyData.diagnostics.energyIn / (record.energyData.diagnostics.energyIn + record.energyData.diagnostics.energyOut || 1)) * 100)}%` }}
                      />
                      <div
                        className="bg-rose-500 transition-all flex-1"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* INTEGRATIVE SCORES */}
              {record.type === 'integrative' && record.integrativeData && (
                <div className="space-y-4">
                  {record.integrativeData.integrativeReport?.coreTension && (
                    <div className="bg-amber-950/40 p-5 rounded-2xl border border-amber-500/40 space-y-2">
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">Ключевое внутреннее противоречие</h4>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {record.integrativeData.integrativeReport.coreTension}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: RECOMMENDATIONS & PROTOCOLS */}
          {activeTab === 'recommendations' && (
            <div className="space-y-4">
              {/* ENERGY PROTOCOL */}
              {record.type === 'energy' && record.energyData && (
                <div className="space-y-4">
                  <div className="bg-gradient-to-br from-emerald-950/40 to-slate-900 p-5 rounded-2xl border border-emerald-500/40 space-y-3">
                    <h4 className="text-sm font-bold text-emerald-300 flex items-center gap-2">
                      <Activity className="w-4 h-4 text-emerald-400" />
                      <span>{record.energyData.diagnostics.recoveryProtocol?.authorProtocol || 'Физиологический протокол восстановления'}</span>
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {record.energyData.diagnostics.recoveryProtocol?.recommendation}
                    </p>

                    {record.energyData.diagnostics.recoveryProtocol?.microHabits && (
                      <div className="pt-2 space-y-1.5">
                        <span className="text-xs font-bold text-emerald-400 block">Ежедневные микро-привычки:</span>
                        <ul className="space-y-1">
                          {record.energyData.diagnostics.recoveryProtocol.microHabits.map((habit, idx) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                              <span className="text-emerald-400 font-bold">•</span>
                              <span>{habit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* SOCIONICS RECOMMENDATIONS */}
              {record.type === 'socionics' && record.socionicsData && (
                <div className="space-y-3">
                  <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-3">
                    <h4 className="text-xs font-bold text-purple-300 uppercase tracking-wider">
                      Оптимальные форматы монетизации и деятельности
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      Для типа <strong>{record.socionicsData.sociotype.primary}</strong> максимальная отдача достигается в проектах, где задействованы сильные функции: генерация концепций, системный анализ и масштабирование решений.
                    </p>
                  </div>
                </div>
              )}

              {/* MATRIX LEVERS */}
              {record.type === 'matrix' && record.matrixData?.layer2 && (
                <div className="space-y-3">
                  {record.matrixData.layer2.mainLever && (
                    <div className="bg-slate-950 p-5 rounded-2xl border border-slate-800 space-y-2">
                      <h4 className="text-xs font-bold text-cyan-300 uppercase tracking-wider">Главный рычаг трансформации</h4>
                      <p className="text-xs text-slate-200 leading-relaxed">
                        {record.matrixData.layer2.mainLever}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* INTEGRATIVE LEVER */}
              {record.type === 'integrative' && record.integrativeData?.integrativeReport?.mainLever && (
                <div className="space-y-3">
                  <div className="bg-amber-950/40 p-5 rounded-2xl border border-amber-500/40 space-y-3">
                    <h4 className="text-sm font-bold text-amber-300">
                      {record.integrativeData.integrativeReport.mainLever.title}
                    </h4>
                    <p className="text-xs text-slate-200 leading-relaxed">
                      {record.integrativeData.integrativeReport.mainLever.behaviorChange}
                    </p>
                    {record.integrativeData.integrativeReport.mainLever.actionableDirections && (
                      <div className="pt-2 space-y-1">
                        <span className="text-xs font-bold text-amber-400 block">Практические шаги:</span>
                        {record.integrativeData.integrativeReport.mainLever.actionableDirections.map((dir, idx) => (
                          <div key={idx} className="text-xs text-slate-300 flex items-start gap-2">
                            <span className="text-amber-400 font-bold">→</span>
                            <span>{dir}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-950/80 shrink-0">
          <div className="text-xs text-slate-500 font-mono">
            ID: {record.id.slice(0, 16)}...
          </div>

          <div className="flex items-center gap-3">
            {onNavigateToModule && (
              <button
                type="button"
                onClick={() => {
                  onNavigateToModule(record.type, record);
                  onClose();
                }}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-2"
              >
                <span>{t.history.openInModule}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}

            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold transition-colors cursor-pointer border border-slate-700"
            >
              {t.history.closeModal}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
