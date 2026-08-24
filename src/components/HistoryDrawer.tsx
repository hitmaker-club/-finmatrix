import React from 'react';
import {
  History,
  Trash2,
  Calendar,
  ChevronRight,
} from 'lucide-react';
import { DiagnosticAnalysisRecord } from '../types/domain.js';
import { useI18n } from '../i18n/context.js';

interface HistoryDrawerProps {
  history: DiagnosticAnalysisRecord[];
  onSelectRecord: (record: DiagnosticAnalysisRecord) => void;
  onDeleteRecord: (id: string) => Promise<void>;
  onClose?: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  history,
  onSelectRecord,
  onDeleteRecord,
}) => {
  const { t } = useI18n();

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <span>{t.history.title}</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.history.subtitle}
          </p>
        </div>
        <span className="text-xs font-mono px-3 py-1.5 rounded-xl bg-slate-800 text-slate-300 border border-slate-700">
          {history.length} {t.history.recordsCount}
        </span>
      </div>

      {history.length === 0 ? (
        <div className="bg-slate-900/30 border border-slate-800/80 rounded-2xl p-12 text-center space-y-3">
          <History className="w-10 h-10 text-slate-600 mx-auto" />
          <h3 className="text-base font-semibold text-slate-300">{t.history.emptyTitle}</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            {t.history.emptyDesc}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {history.map((record) => {
            const v1 = record.layer1.vectors.v1_life_scenario.value;
            const v2 = record.layer1.vectors.v2_work_model.value;
            const v3 = record.layer1.vectors.v3_emotional_background.value;
            const v4 = record.layer1.vectors.v4_resource_management.value;
            const relationLabel = t.profiles.relations[record.relationType as keyof typeof t.profiles.relations] || record.relationType;

            return (
              <div
                key={record.id}
                id={`history-item-${record.id}`}
                className="bg-slate-900/50 hover:bg-slate-900/80 border border-slate-800 hover:border-slate-700 rounded-2xl p-5 transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-800">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-slate-100 text-sm">{record.profileName}</h4>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 capitalize">
                          {relationLabel}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 font-mono">
                        <Calendar className="w-3 h-3 text-indigo-400" />
                        {new Date(record.createdAt).toLocaleString()}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        if (confirm(t.history.confirmDelete)) {
                          onDeleteRecord(record.id);
                        }
                      }}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      title={t.common.delete}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Vector Coordinates Badge row */}
                  <div className="grid grid-cols-4 gap-2 my-3 text-center">
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-mono text-cyan-400 block">{t.history.v1Short}</span>
                      <span className="text-base font-bold text-white font-mono">{v1}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-mono text-indigo-400 block">{t.history.v2Short}</span>
                      <span className="text-base font-bold text-white font-mono">{v2}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-mono text-pink-400 block">{t.history.v3Short}</span>
                      <span className="text-base font-bold text-white font-mono">{v3}</span>
                    </div>
                    <div className="bg-slate-950 p-2 rounded-xl border border-slate-800">
                      <span className="text-[9px] font-mono text-amber-400 block">{t.history.v4Short}</span>
                      <span className="text-base font-bold text-white font-mono">{v4}</span>
                    </div>
                  </div>

                  {record.layer2 && (
                    <p className="text-xs text-slate-300 line-clamp-2 italic bg-slate-950/40 p-2.5 rounded-xl border border-slate-800/60">
                      "{record.layer2.executiveSummary}"
                    </p>
                  )}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <div className="text-[10px] font-mono text-slate-500">
                    Alg: {record.algorithmVersion.split('-')[0]} • AI: {record.layer2?.modelUsed ? t.common.active : 'Deterministic'}
                  </div>

                  <button
                    onClick={() => onSelectRecord(record)}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
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
    </div>
  );
};
