import React, { useState } from 'react';
import { User, Plus, Check, X, ShieldAlert, ArrowRight } from 'lucide-react';
import { PersonProfile, RelationshipType } from '../types/domain.js';
import { useI18n } from '../i18n/context.js';

interface CustomDateSaveModalProps {
  isOpen: boolean;
  userBirthDate: string;
  motherBirthDate?: string;
  fatherBirthDate?: string;
  subjectName?: string;
  occupation?: string;
  financialGoals?: string;
  profiles: PersonProfile[];
  onSaveToNewProfile: (profileData: Partial<PersonProfile>) => Promise<PersonProfile>;
  onSaveToExistingProfile: (profileId: string, profileData: Partial<PersonProfile>) => Promise<PersonProfile>;
  onProceedWithProfile: (profile: PersonProfile) => void;
  onCancel: () => void;
}

export const CustomDateSaveModal: React.FC<CustomDateSaveModalProps> = ({
  isOpen,
  userBirthDate,
  motherBirthDate = '',
  fatherBirthDate = '',
  subjectName = '',
  occupation = '',
  financialGoals = '',
  profiles,
  onSaveToNewProfile,
  onSaveToExistingProfile,
  onProceedWithProfile,
  onCancel,
}) => {
  const { t } = useI18n();
  const [saveMode, setSaveMode] = useState<'new' | 'existing'>('new');
  const [selectedExistingId, setSelectedExistingId] = useState<string>(profiles[0]?.id || '');
  
  const parsedName = subjectName.trim().split(/\s+/);
  const [firstName, setFirstName] = useState(parsedName[0] || '');
  const [lastName, setLastName] = useState(parsedName.slice(1).join(' ') || '');
  const [relationType, setRelationType] = useState<RelationshipType>('self');
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSaveAndRun = async () => {
    setError(null);
    setIsProcessing(true);
    try {
      if (saveMode === 'new') {
        const trimmedFirst = firstName.trim() || 'Клиент';
        const newProf = await onSaveToNewProfile({
          firstName: trimmedFirst,
          lastName: lastName.trim(),
          birthDate: userBirthDate.trim(),
          motherBirthDate: motherBirthDate.trim() || undefined,
          fatherBirthDate: fatherBirthDate.trim() || undefined,
          relationType,
          occupation: occupation.trim() || undefined,
          financialGoals: financialGoals.trim() || undefined,
        });
        onProceedWithProfile(newProf);
      } else {
        if (!selectedExistingId) {
          throw new Error('Пожалуйста, выберите существующий профиль для сохранения.');
        }
        const updatedProf = await onSaveToExistingProfile(selectedExistingId, {
          firstName: firstName.trim() || undefined,
          lastName: lastName.trim() || undefined,
          birthDate: userBirthDate.trim(),
          motherBirthDate: motherBirthDate.trim() || undefined,
          fatherBirthDate: fatherBirthDate.trim() || undefined,
          occupation: occupation.trim() || undefined,
          financialGoals: financialGoals.trim() || undefined,
        });
        onProceedWithProfile(updatedProf);
      }
    } catch (err: any) {
      setError(err?.message || 'Ошибка сохранения профиля');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-sm animate-in fade-in">
      <div className="bg-slate-900 border border-indigo-500/40 rounded-3xl w-full max-w-lg p-6 sm:p-8 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Header */}
        <div className="flex items-start justify-between gap-3 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-3 rounded-2xl bg-indigo-500/15 border border-indigo-500/30 text-indigo-400">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">
                Сохранение данных в профиль
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Для выполнения расчёта и сохранения истории выберите профиль
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Mode Selector (New Profile vs Existing) */}
        <div className="space-y-4">
          <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button
              type="button"
              onClick={() => setSaveMode('new')}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                saveMode === 'new'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Создать новый профиль</span>
            </button>
            {profiles.length > 0 && (
              <button
                type="button"
                onClick={() => setSaveMode('existing')}
                className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                  saveMode === 'existing'
                    ? 'bg-indigo-600 text-white shadow'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <User className="w-3.5 h-3.5" />
                <span>Записать в существующий</span>
              </button>
            )}
          </div>

          {/* Form Content */}
          {saveMode === 'new' ? (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Имя *
                  </label>
                  <input
                    type="text"
                    required
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="Имя"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-300 mb-1">
                    Фамилия
                  </label>
                  <input
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Фамилия"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1">
                  Категория профиля
                </label>
                <select
                  value={relationType}
                  onChange={(e) => setRelationType(e.target.value as RelationshipType)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-indigo-500"
                >
                  <option value="self">Основной (Я)</option>
                  <option value="partner">Супруг(а) / Партнёр</option>
                  <option value="child">Ребёнок / Потомок</option>
                  <option value="parent">Родитель / Предок</option>
                  <option value="relative">Родственник / Семья</option>
                  <option value="business_partner">Бизнес-партнёр</option>
                  <option value="other">Другой контакт</option>
                </select>
              </div>

              {/* Readonly Date Summary */}
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-[11px] text-slate-300 space-y-1">
                <div><span className="text-slate-500">Дата рождения:</span> <span className="font-mono font-bold text-indigo-300">{userBirthDate}</span></div>
                {motherBirthDate && <div><span className="text-slate-500">Дата матери:</span> <span className="font-mono text-rose-300">{motherBirthDate}</span></div>}
                {fatherBirthDate && <div><span className="text-slate-500">Дата отца:</span> <span className="font-mono text-blue-300">{fatherBirthDate}</span></div>}
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-1">
              <label className="block text-xs font-medium text-slate-300 mb-1">
                Выберите профиль для перезаписи дат:
              </label>
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {profiles.map((p) => {
                  const isSelected = selectedExistingId === p.id;
                  return (
                    <button
                      key={p.id}
                      type="button"
                      onClick={() => setSelectedExistingId(p.id)}
                      className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                        isSelected
                          ? 'bg-indigo-600/20 border-indigo-500/80 text-white shadow-md'
                          : 'bg-slate-950/60 border-slate-800 text-slate-300 hover:border-slate-700'
                      }`}
                    >
                      <div>
                        <p className="text-xs font-bold">{p.firstName} {p.lastName}</p>
                        <p className="text-[10px] text-slate-400">Было: {p.birthDate || 'не указана'} → Станет: {userBirthDate}</p>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-400 shrink-0" />}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold transition-colors cursor-pointer"
          >
            Отмена
          </button>
          <button
            type="button"
            onClick={handleSaveAndRun}
            disabled={isProcessing}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <span>{isProcessing ? 'Сохранение...' : 'Сохранить и рассчитать'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
