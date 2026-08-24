import React from 'react';
import {
  Layers,
  AlertCircle,
} from 'lucide-react';
import { DiagnosticModuleMeta } from '../types/domain.js';
import { useI18n } from '../i18n/context.js';

interface PlannedModulesModalProps {
  modules: DiagnosticModuleMeta[];
  onClose: () => void;
}

export const PlannedModulesModal: React.FC<PlannedModulesModalProps> = ({
  modules,
  onClose,
}) => {
  const { t } = useI18n();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-2xl p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
              <Layers className="w-4 h-4" />
              {t.modulesModal.badge}
            </span>
            <h2 className="text-xl font-black text-slate-100 mt-1">{t.modulesModal.title}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-200 text-sm font-semibold p-1 cursor-pointer"
          >
            ✕
          </button>
        </div>

        <p className="text-xs text-slate-300 leading-relaxed">
          {t.modulesModal.desc}
        </p>

        <div className="space-y-4">
          {modules.map((m) => (
            <div
              key={m.id}
              className={`p-5 rounded-2xl border transition-all ${
                m.status === 'ACTIVE'
                  ? 'bg-indigo-950/30 border-indigo-500/60 ring-1 ring-indigo-500/30'
                  : 'bg-slate-950/60 border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-slate-100 text-base">{m.name}</h3>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        m.status === 'ACTIVE'
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {m.status === 'ACTIVE' ? t.common.active : 'PLANNED'}
                    </span>
                    <span className="text-[10px] font-mono text-slate-500">{m.version}</span>
                  </div>
                  <p className="text-xs text-slate-400 mt-1">{m.description}</p>
                </div>

                {m.status !== 'ACTIVE' ? (
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-slate-900 border border-slate-800 text-amber-400 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" />
                    {t.modulesModal.todoSpec}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono px-2 py-1 rounded bg-indigo-900/50 border border-indigo-700 text-indigo-300">
                    {t.modulesModal.online}
                  </span>
                )}
              </div>

              {m.requirements && (
                <div className="mt-3 pt-3 border-t border-slate-800/80 text-[11px] text-slate-400 space-y-1">
                  <span className="font-semibold text-slate-300 block">{t.modulesModal.systemContract}:</span>
                  <p className="font-mono text-slate-400">{m.requirements}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
