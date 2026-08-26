import React, { useState, useMemo } from 'react';
import {
  History,
  Trash2,
  Calendar,
  ChevronRight,
  Search,
  Filter,
  Grid,
  Brain,
  Zap,
  Layers,
  ArrowUpDown,
  User,
  Sparkles,
  HelpCircle,
  Clock,
  Eye,
  RotateCcw,
} from 'lucide-react';
import { DiagnosticAnalysisRecord, PersonProfile } from '../types/domain.js';
import {
  SocionicsTestResult,
  FullIntegrativeAnalysisRecord,
  EnergyEvaluationRecord,
} from '../types/socionics.js';
import { useI18n } from '../i18n/context.js';
import { TestAnswersModal, UnifiedHistoryRecord, UnifiedHistoryItemType } from './TestAnswersModal.js';

interface HistoryDrawerProps {
  history?: DiagnosticAnalysisRecord[];
  socionicsHistory?: SocionicsTestResult[];
  energyHistory?: EnergyEvaluationRecord[];
  integrativeHistory?: FullIntegrativeAnalysisRecord[];
  profiles?: PersonProfile[];
  onSelectRecord?: (record: DiagnosticAnalysisRecord) => void;
  onSelectSocionicsRecord?: (record: SocionicsTestResult) => void;
  onSelectEnergyRecord?: (record: EnergyEvaluationRecord) => void;
  onSelectIntegrativeRecord?: (record: FullIntegrativeAnalysisRecord) => void;
  onDeleteRecord: (id: string) => Promise<void>;
  onDeleteSocionicsRecord?: (id: string) => Promise<void>;
  onDeleteEnergyRecord?: (id: string) => Promise<void>;
  onDeleteIntegrativeRecord?: (id: string) => Promise<void>;
  onNavigateToTab?: (tab: string) => void;
  onClose?: () => void;
}

type ModuleFilterType = 'all' | 'matrix' | 'socionics' | 'energy' | 'integrative';
type SortOrderType = 'newest' | 'oldest';

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history = [],
  socionicsHistory = [],
  energyHistory = [],
  integrativeHistory = [],
  profiles = [],
  onSelectRecord,
  onSelectSocionicsRecord,
  onSelectEnergyRecord,
  onSelectIntegrativeRecord,
  onDeleteRecord,
  onDeleteSocionicsRecord,
  onDeleteEnergyRecord,
  onDeleteIntegrativeRecord,
  onNavigateToTab,
}) => {
  const { t, language } = useI18n();

  const [moduleFilter, setModuleFilter] = useState<ModuleFilterType>('all');
  const [selectedProfileId, setSelectedProfileId] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<SortOrderType>('newest');

  // Active record for Answers modal
  const [selectedAnswersRecord, setSelectedAnswersRecord] = useState<UnifiedHistoryRecord | null>(null);

  // Normalize all records into UnifiedHistoryRecord list
  const unifiedRecords: UnifiedHistoryRecord[] = useMemo(() => {
    const list: UnifiedHistoryRecord[] = [];

    // 1. Financial Matrix
    history.forEach((rec) => {
      list.push({
        type: 'matrix',
        id: rec.id,
        title: `V1:${rec.layer1?.vectors?.v1_life_scenario?.value} V2:${rec.layer1?.vectors?.v2_work_model?.value} V3:${rec.layer1?.vectors?.v3_emotional_background?.value} V4:${rec.layer1?.vectors?.v4_resource_management?.value}`,
        subtitle: rec.layer2?.executiveSummary || 'Детерминированный расчет 4 векторов финансовой матрицы.',
        completedAt: rec.createdAt,
        profileName: rec.profileName || 'Subject',
        profileId: rec.profileId,
        matrixData: rec,
      });
    });

    // 2. Socionics
    socionicsHistory.forEach((rec) => {
      list.push({
        type: 'socionics',
        id: rec.id,
        title: `${rec.sociotype?.primary} (${rec.sociotype?.name[language] || rec.sociotype?.name?.ru || 'Социотип'})`,
        subtitle: `Квадра: ${rec.quadra?.classic} • Уверенность: ${rec.confidenceScore}% • Ответов: 30`,
        completedAt: rec.completedAt,
        profileName: rec.profileName || 'Subject',
        profileId: rec.profileId,
        socionicsData: rec,
      });
    });

    // 3. Energy / Resource State
    energyHistory.forEach((rec) => {
      list.push({
        type: 'energy',
        id: rec.id,
        title: `КПД: ${rec.diagnostics?.kpd}x • Кластер ${rec.diagnostics?.dominantCluster}`,
        subtitle: `${rec.diagnostics?.scenario === 'A' ? 'Опережающий тонус' : 'Расходный режим'} • ${rec.diagnostics?.recoveryProtocol?.authorProtocol || 'Протокол восстановления'}`,
        completedAt: rec.completedAt,
        profileName: rec.profileName || 'Subject',
        profileId: rec.profileId,
        energyData: rec,
      });
    });

    // 4. Integrative Reports
    integrativeHistory.forEach((rec) => {
      list.push({
        type: 'integrative',
        id: rec.id,
        title: `4-слойный синтез: ${rec.socionicsResult?.sociotype?.primary || 'Профиль'}`,
        subtitle: rec.integrativeReport?.dayArchetype?.archetypeTitle || 'Комплексный поведенческий анализ личности и потенциала.',
        completedAt: rec.createdAt,
        profileName: rec.profileName || 'Subject',
        profileId: rec.profileId,
        integrativeData: rec,
      });
    });

    return list;
  }, [history, socionicsHistory, energyHistory, integrativeHistory, language]);

  // Filter and sort unified records
  const filteredRecords = useMemo(() => {
    return unifiedRecords
      .filter((rec) => {
        // Module filter
        if (moduleFilter !== 'all' && rec.type !== moduleFilter) {
          return false;
        }

        // Profile filter
        if (selectedProfileId !== 'all') {
          if (rec.profileId !== selectedProfileId) {
            return false;
          }
        }

        // Search query filter
        if (searchQuery.trim().length > 0) {
          const q = searchQuery.toLowerCase().trim();
          const matchName = rec.profileName.toLowerCase().includes(q);
          const matchTitle = rec.title.toLowerCase().includes(q);
          const matchSub = rec.subtitle.toLowerCase().includes(q);
          return matchName || matchTitle || matchSub;
        }

        return true;
      })
      .sort((a, b) => {
        const timeA = new Date(a.completedAt).getTime();
        const timeB = new Date(b.completedAt).getTime();
        return sortOrder === 'newest' ? timeB - timeA : timeA - timeB;
      });
  }, [unifiedRecords, moduleFilter, selectedProfileId, searchQuery, sortOrder]);

  // Counts by module
  const counts = useMemo(() => ({
    all: unifiedRecords.length,
    matrix: history.length,
    socionics: socionicsHistory.length,
    energy: energyHistory.length,
    integrative: integrativeHistory.length,
  }), [unifiedRecords.length, history.length, socionicsHistory.length, energyHistory.length, integrativeHistory.length]);

  // Handle delete
  const handleDeleteRecord = async (rec: UnifiedHistoryRecord, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm(t.history.confirmDelete)) return;

    try {
      if (rec.type === 'matrix') {
        await onDeleteRecord(rec.id);
      } else if (rec.type === 'socionics' && onDeleteSocionicsRecord) {
        await onDeleteSocionicsRecord(rec.id);
      } else if (rec.type === 'energy' && onDeleteEnergyRecord) {
        await onDeleteEnergyRecord(rec.id);
      } else if (rec.type === 'integrative' && onDeleteIntegrativeRecord) {
        await onDeleteIntegrativeRecord(rec.id);
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  // Handle open in original module
  const handleOpenInModule = (type: UnifiedHistoryItemType, rec: UnifiedHistoryRecord, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();

    if (type === 'matrix' && rec.matrixData && onSelectRecord) {
      onSelectRecord(rec.matrixData);
      if (onNavigateToTab) onNavigateToTab('diagnostic');
    } else if (type === 'socionics' && rec.socionicsData && onSelectSocionicsRecord) {
      onSelectSocionicsRecord(rec.socionicsData);
      if (onNavigateToTab) onNavigateToTab('socionics');
    } else if (type === 'energy' && rec.energyData && onSelectEnergyRecord) {
      onSelectEnergyRecord(rec.energyData);
      if (onNavigateToTab) onNavigateToTab('energy');
    } else if (type === 'integrative' && rec.integrativeData && onSelectIntegrativeRecord) {
      onSelectIntegrativeRecord(rec.integrativeData);
      if (onNavigateToTab) onNavigateToTab('integrative');
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-900/70 p-6 rounded-3xl border border-slate-800 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <History className="w-5 h-5" />
            </span>
            <h2 className="text-xl font-bold text-slate-100">
              {t.history.title}
            </h2>
          </div>
          <p className="text-xs text-slate-400 max-w-2xl leading-relaxed">
            {t.history.subtitle}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-xs shrink-0">
          <span className="px-3.5 py-1.5 rounded-xl bg-slate-800 text-slate-200 border border-slate-700 font-bold">
            {counts.all} {t.history.recordsCount}
          </span>
        </div>
      </div>

      {/* Module Filter Pills */}
      <div className="flex flex-wrap items-center gap-2 bg-slate-900/40 p-2 rounded-2xl border border-slate-800/80">
        <button
          onClick={() => setModuleFilter('all')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            moduleFilter === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <span>{t.history.allModules}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">{counts.all}</span>
        </button>

        <button
          onClick={() => setModuleFilter('matrix')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            moduleFilter === 'matrix'
              ? 'bg-cyan-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>{t.history.matrixModule}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">{counts.matrix}</span>
        </button>

        <button
          onClick={() => setModuleFilter('socionics')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            moduleFilter === 'socionics'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Brain className="w-3.5 h-3.5" />
          <span>{t.history.socionicsModule}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">{counts.socionics}</span>
        </button>

        <button
          onClick={() => setModuleFilter('energy')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            moduleFilter === 'energy'
              ? 'bg-emerald-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Zap className="w-3.5 h-3.5" />
          <span>{t.history.energyModule}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">{counts.energy}</span>
        </button>

        <button
          onClick={() => setModuleFilter('integrative')}
          className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            moduleFilter === 'integrative'
              ? 'bg-amber-600 text-white shadow-md'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>{t.history.integrativeModule}</span>
          <span className="px-1.5 py-0.2 rounded-full bg-black/30 text-[10px] font-mono">{counts.integrative}</span>
        </button>
      </div>

      {/* Filter & Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6 relative">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={t.history.searchPlaceholder}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 focus:border-indigo-500 text-slate-100 text-xs placeholder:text-slate-500 outline-none transition-colors"
          />
        </div>

        <div className="sm:col-span-3">
          <select
            value={selectedProfileId}
            onChange={(e) => setSelectedProfileId(e.target.value)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="all">{t.history.allProfiles}</option>
            {profiles.map((p) => (
              <option key={p.id} value={p.id}>
                {p.firstName} {p.lastName}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-3">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value as SortOrderType)}
            className="w-full px-3 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-200 text-xs outline-none focus:border-indigo-500 cursor-pointer"
          >
            <option value="newest">{t.history.newestFirst}</option>
            <option value="oldest">{t.history.oldestFirst}</option>
          </select>
        </div>
      </div>

      {/* History Records Grid */}
      {filteredRecords.length === 0 ? (
        <div className="bg-slate-900/40 border border-slate-800/80 rounded-3xl p-12 text-center space-y-3">
          <History className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-base font-bold text-slate-200">{t.history.emptyTitle}</h3>
          <p className="text-xs text-slate-400 max-w-md mx-auto leading-relaxed">
            {t.history.emptyDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRecords.map((record) => {
            const isMatrix = record.type === 'matrix';
            const isSocionics = record.type === 'socionics';
            const isEnergy = record.type === 'energy';
            const isIntegrative = record.type === 'integrative';

            return (
              <div
                key={`${record.type}_${record.id}`}
                onClick={() => setSelectedAnswersRecord(record)}
                className={`group rounded-3xl p-5 sm:p-6 transition-all duration-200 cursor-pointer flex flex-col justify-between border shadow-lg ${
                  isMatrix
                    ? 'bg-slate-900/60 hover:bg-slate-900/90 border-cyan-500/20 hover:border-cyan-500/50'
                    : isSocionics
                    ? 'bg-slate-900/60 hover:bg-slate-900/90 border-purple-500/20 hover:border-purple-500/50'
                    : isEnergy
                    ? 'bg-slate-900/60 hover:bg-slate-900/90 border-emerald-500/20 hover:border-emerald-500/50'
                    : 'bg-slate-900/60 hover:bg-slate-900/90 border-amber-500/20 hover:border-amber-500/50'
                }`}
              >
                <div>
                  {/* Card Header: Module Badge, Profile, Date, Delete Button */}
                  <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800/80">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        {isMatrix && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan-950 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                            <Grid className="w-3 h-3" />
                            {t.history.matrixModule}
                          </span>
                        )}
                        {isSocionics && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-950 text-purple-300 text-[10px] font-bold border border-purple-500/30">
                            <Brain className="w-3 h-3" />
                            {t.history.socionicsModule}
                          </span>
                        )}
                        {isEnergy && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-950 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            <Zap className="w-3 h-3" />
                            {t.history.energyModule}
                          </span>
                        )}
                        {isIntegrative && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-950 text-amber-300 text-[10px] font-bold border border-amber-500/30">
                            <Layers className="w-3 h-3" />
                            {t.history.integrativeModule}
                          </span>
                        )}

                        <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-500" />
                          {new Date(record.completedAt).toLocaleDateString()}
                        </span>
                      </div>

                      <h4 className="font-bold text-slate-100 text-base group-hover:text-white transition-colors">
                        {record.profileName}
                      </h4>
                    </div>

                    <button
                      onClick={(e) => handleDeleteRecord(record, e)}
                      className="p-2 rounded-xl text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Card Main Content by Module Type */}
                  <div className="py-3.5 space-y-2.5">
                    {/* 1. MATRIX METRICS */}
                    {isMatrix && record.matrixData && (
                      <div>
                        <div className="grid grid-cols-4 gap-1.5 text-center mb-2.5">
                          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                            <span className="text-[9px] font-mono text-cyan-400 block">{t.history.v1Short}</span>
                            <span className="text-sm font-bold text-white font-mono">{record.matrixData.layer1?.vectors?.v1_life_scenario?.value}</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                            <span className="text-[9px] font-mono text-indigo-400 block">{t.history.v2Short}</span>
                            <span className="text-sm font-bold text-white font-mono">{record.matrixData.layer1?.vectors?.v2_work_model?.value}</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                            <span className="text-[9px] font-mono text-pink-400 block">{t.history.v3Short}</span>
                            <span className="text-sm font-bold text-white font-mono">{record.matrixData.layer1?.vectors?.v3_emotional_background?.value}</span>
                          </div>
                          <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                            <span className="text-[9px] font-mono text-amber-400 block">{t.history.v4Short}</span>
                            <span className="text-sm font-bold text-white font-mono">{record.matrixData.layer1?.vectors?.v4_resource_management?.value}</span>
                          </div>
                        </div>

                        {record.matrixData.layer2?.executiveSummary && (
                          <p className="text-xs text-slate-300 line-clamp-2 italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                            "{record.matrixData.layer2.executiveSummary}"
                          </p>
                        )}
                      </div>
                    )}

                    {/* 2. SOCIONICS METRICS */}
                    {isSocionics && record.socionicsData && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between bg-slate-950/70 p-3 rounded-2xl border border-purple-500/20">
                          <div>
                            <span className="text-base font-black text-purple-300 block">
                              {record.socionicsData.sociotype?.primary} • {record.socionicsData.sociotype?.name[language] || record.socionicsData.sociotype?.name?.ru}
                            </span>
                            <span className="text-[11px] text-slate-400">
                              Квадра: {record.socionicsData.quadra?.classic} • {record.socionicsData.quadra?.friendlyName[language] || record.socionicsData.quadra?.friendlyName?.ru}
                            </span>
                          </div>
                          <span className="px-2.5 py-1 rounded-xl bg-purple-950 text-purple-200 border border-purple-500/30 text-xs font-bold font-mono">
                            {record.socionicsData.confidenceScore}%
                          </span>
                        </div>
                      </div>
                    )}

                    {/* 3. ENERGY METRICS */}
                    {isEnergy && record.energyData && (
                      <div className="space-y-2">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-emerald-500/20 text-center">
                            <span className="text-[10px] text-slate-400 font-mono block">Витальный КПД</span>
                            <span className="text-lg font-black text-emerald-400 font-mono">
                              {record.energyData.diagnostics?.kpd}x
                            </span>
                          </div>
                          <div className="bg-slate-950/70 p-2.5 rounded-xl border border-cyan-500/20 text-center">
                            <span className="text-[10px] text-slate-400 font-mono block">Кластер ресурса</span>
                            <span className="text-sm font-bold text-cyan-300">
                              Кластер {record.energyData.diagnostics?.dominantCluster}
                            </span>
                          </div>
                        </div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">
                          {record.energyData.diagnostics?.recoveryProtocol?.authorProtocol || 'Протокол восстановления'}
                        </p>
                      </div>
                    )}

                    {/* 4. INTEGRATIVE METRICS */}
                    {isIntegrative && record.integrativeData && (
                      <div className="space-y-2">
                        <div className="bg-slate-950/70 p-3 rounded-2xl border border-amber-500/20">
                          <span className="text-xs text-amber-300 font-bold block">
                            {record.integrativeData.integrativeReport?.dayArchetype?.archetypeTitle || '4-слойный архетип'}
                          </span>
                          <p className="text-[11px] text-slate-300 line-clamp-1 mt-0.5">
                            {record.integrativeData.integrativeReport?.mainLever?.title || 'Главный вектор трансформации'}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card Footer: View Answers Button & Open in Module */}
                <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between gap-2">
                  <span className="text-[11px] text-indigo-400 font-semibold group-hover:text-indigo-300 flex items-center gap-1 transition-colors">
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>{t.history.viewAnswers}</span>
                  </span>

                  <button
                    onClick={(e) => handleOpenInModule(record.type, record, e)}
                    className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer border border-slate-700"
                  >
                    <span>{t.history.viewDiagnostic}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detailed Answers & Diagnostic Modal */}
      {selectedAnswersRecord && (
        <TestAnswersModal
          record={selectedAnswersRecord}
          isOpen={Boolean(selectedAnswersRecord)}
          onClose={() => setSelectedAnswersRecord(null)}
          onNavigateToModule={handleOpenInModule}
        />
      )}

    </div>
  );
};
