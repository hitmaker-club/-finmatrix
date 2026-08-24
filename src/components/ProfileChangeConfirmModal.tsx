import React from 'react';
import { AlertCircle, Check, X, ArrowRight } from 'lucide-react';
import { useI18n } from '../i18n/context.js';

export interface FieldChange {
  key: string;
  label: string;
  oldValue: string;
  newValue: string;
}

interface ProfileChangeConfirmModalProps {
  isOpen: boolean;
  profileName: string;
  changes: FieldChange[];
  onConfirm: () => void;
  onCancel: () => void;
  isSaving?: boolean;
}

export const ProfileChangeConfirmModal: React.FC<ProfileChangeConfirmModalProps> = ({
  isOpen,
  profileName,
  changes,
  onConfirm,
  onCancel,
  isSaving = false,
}) => {
  const { t } = useI18n();

  if (!isOpen) return null;

  return (
    <div
      id="profile-change-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in"
    >
      <div
        id="profile-change-modal-card"
        className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 relative overflow-hidden"
      >
        {/* Subtle accent glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/30 text-amber-400">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-100">
                {t.form.saveChangesModalTitle}
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                {t.profiles?.profile || 'Profile'}: <span className="font-semibold text-slate-200">{profileName}</span>
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Description */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {t.form.saveChangesModalDesc}
        </p>

        {/* Changed fields list */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
            {t.form.changedFields}
          </span>
          <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
            {changes.map((change) => (
              <div
                key={change.key}
                className="bg-slate-950/70 border border-slate-800/80 rounded-xl p-3 text-xs space-y-1.5"
              >
                <div className="font-semibold text-slate-300">{change.label}</div>
                <div className="flex items-center gap-2 font-mono text-[11px]">
                  <span className="text-rose-400/90 line-through truncate max-w-[140px]" title={change.oldValue || t.form.emptyValue}>
                    {change.oldValue || t.form.emptyValue}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 flex-shrink-0" />
                  <span className="text-emerald-400 font-semibold truncate max-w-[180px]" title={change.newValue || t.form.emptyValue}>
                    {change.newValue || t.form.emptyValue}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Actions */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            id="btn-cancel-profile-change"
            type="button"
            onClick={onCancel}
            disabled={isSaving}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:bg-slate-800 border border-slate-700 transition-colors cursor-pointer disabled:opacity-50"
          >
            {t.form.cancelBtn}
          </button>
          <button
            id="btn-confirm-profile-change"
            type="button"
            onClick={onConfirm}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-lg shadow-indigo-600/30 flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isSaving ? (t.common?.loading || 'Saving...') : t.form.confirmAndSaveBtn}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
