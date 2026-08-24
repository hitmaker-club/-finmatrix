import React, { useState } from 'react';
import {
  User,
  Heart,
  Baby,
  Briefcase,
  Users,
  Plus,
  Trash2,
  Edit2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { PersonProfile, RelationshipType } from '../types/domain.js';
import { useI18n } from '../i18n/context.js';
import { ProfileChangeConfirmModal, FieldChange } from './ProfileChangeConfirmModal.js';

interface ProfileManagerProps {
  profiles: PersonProfile[];
  selectedProfileId: string | null;
  onSelectProfile: (profile: PersonProfile) => void;
  onCreateProfile: (profile: Partial<PersonProfile>) => Promise<void>;
  onUpdateProfile: (id: string, profile: Partial<PersonProfile>) => Promise<void>;
  onDeleteProfile: (id: string) => Promise<void>;
  onRunMatrixForProfile: (profile: PersonProfile) => void;
}

const RELATION_ICONS: Record<RelationshipType, React.ReactNode> = {
  self: <User className="w-4 h-4 text-indigo-400" />,
  partner: <Heart className="w-4 h-4 text-rose-400" />,
  child: <Baby className="w-4 h-4 text-amber-400" />,
  parent: <Users className="w-4 h-4 text-blue-400" />,
  relative: <Users className="w-4 h-4 text-purple-400" />,
  business_partner: <Briefcase className="w-4 h-4 text-emerald-400" />,
  other: <User className="w-4 h-4 text-slate-400" />,
};

export const ProfileManager: React.FC<ProfileManagerProps> = ({
  profiles,
  selectedProfileId,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfile,
  onDeleteProfile,
  onRunMatrixForProfile,
}) => {
  const { t } = useI18n();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProfileId, setEditingProfileId] = useState<string | null>(null);

  const [formData, setFormData] = useState<{
    relationType: RelationshipType;
    firstName: string;
    lastName: string;
    birthDate: string;
    motherBirthDate: string;
    fatherBirthDate: string;
    occupation: string;
    monthlyIncomeBracket: string;
    financialGoals: string;
    notes: string;
  }>({
    relationType: 'partner',
    firstName: '',
    lastName: '',
    birthDate: '',
    motherBirthDate: '',
    fatherBirthDate: '',
    occupation: '',
    monthlyIncomeBracket: '$5,000 - $10,000',
    financialGoals: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [detectedChanges, setDetectedChanges] = useState<FieldChange[]>([]);

  const openCreateModal = () => {
    setEditingProfileId(null);
    setFormData({
      relationType: 'partner',
      firstName: '',
      lastName: '',
      birthDate: '',
      motherBirthDate: '',
      fatherBirthDate: '',
      occupation: '',
      monthlyIncomeBracket: '$5,000 - $10,000',
      financialGoals: '',
      notes: '',
    });
    setError(null);
    setIsFormOpen(true);
  };

  const openEditModal = (profile: PersonProfile) => {
    setEditingProfileId(profile.id);
    setFormData({
      relationType: profile.relationType,
      firstName: profile.firstName,
      lastName: profile.lastName,
      birthDate: profile.birthDate,
      motherBirthDate: profile.motherBirthDate || '',
      fatherBirthDate: profile.fatherBirthDate || '',
      occupation: profile.occupation || '',
      monthlyIncomeBracket: profile.monthlyIncomeBracket || '$5,000 - $10,000',
      financialGoals: profile.financialGoals || '',
      notes: profile.notes || '',
    });
    setError(null);
    setIsFormOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // If editing existing profile, check what changed
    if (editingProfileId) {
      const original = profiles.find((p) => p.id === editingProfileId);
      if (original) {
        const changes: FieldChange[] = [];
        if (formData.firstName !== original.firstName || formData.lastName !== original.lastName) {
          changes.push({
            key: 'name',
            label: t.form.fieldName,
            oldValue: `${original.firstName} ${original.lastName || ''}`.trim(),
            newValue: `${formData.firstName} ${formData.lastName || ''}`.trim(),
          });
        }
        if (formData.birthDate !== original.birthDate) {
          changes.push({
            key: 'birthDate',
            label: t.form.fieldSubjectDob,
            oldValue: original.birthDate,
            newValue: formData.birthDate,
          });
        }
        if ((formData.motherBirthDate || '') !== (original.motherBirthDate || '')) {
          changes.push({
            key: 'motherBirthDate',
            label: t.form.fieldMotherDob,
            oldValue: original.motherBirthDate || '',
            newValue: formData.motherBirthDate || '',
          });
        }
        if ((formData.fatherBirthDate || '') !== (original.fatherBirthDate || '')) {
          changes.push({
            key: 'fatherBirthDate',
            label: t.form.fieldFatherDob,
            oldValue: original.fatherBirthDate || '',
            newValue: formData.fatherBirthDate || '',
          });
        }
        if ((formData.occupation || '') !== (original.occupation || '')) {
          changes.push({
            key: 'occupation',
            label: t.form.fieldOccupation,
            oldValue: original.occupation || '',
            newValue: formData.occupation || '',
          });
        }
        if ((formData.financialGoals || '') !== (original.financialGoals || '')) {
          changes.push({
            key: 'goals',
            label: t.form.fieldGoals,
            oldValue: original.financialGoals || '',
            newValue: formData.financialGoals || '',
          });
        }

        if (changes.length > 0) {
          setDetectedChanges(changes);
          setShowConfirmModal(true);
          return;
        }
      }
    }

    // Otherwise save directly (first save or no differences)
    await executeSave();
  };

  const executeSave = async () => {
    setLoading(true);
    setShowConfirmModal(false);
    try {
      if (editingProfileId) {
        await onUpdateProfile(editingProfileId, formData);
      } else {
        await onCreateProfile(formData);
      }
      setIsFormOpen(false);
    } catch (err: any) {
      setError(err.message || 'Failed to save profile.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800">
        <div>
          <h2 className="text-xl font-bold text-slate-100 flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-400" />
            <span>{t.profiles.title}</span>
          </h2>
          <p className="text-sm text-slate-400 mt-1 max-w-2xl">
            {t.profiles.subtitle}
          </p>
        </div>

        <button
          id="btn-add-profile"
          onClick={openCreateModal}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm shadow-lg shadow-indigo-600/20 transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>{t.profiles.newProfile}</span>
        </button>
      </div>

      {/* Profiles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {profiles.map((profile) => {
          const isSelected = selectedProfileId === profile.id;
          const relationLabel = t.profiles.relations[profile.relationType as keyof typeof t.profiles.relations] || profile.relationType;

          return (
            <div
              key={profile.id}
              id={`profile-card-${profile.id}`}
              className={`p-5 rounded-2xl border transition-all relative flex flex-col justify-between ${
                isSelected
                  ? 'bg-slate-900/90 border-indigo-500/60 shadow-xl shadow-indigo-950/40 ring-1 ring-indigo-500/40'
                  : 'bg-slate-900/40 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-800 border border-slate-700">
                      {RELATION_ICONS[profile.relationType]}
                    </div>
                    <div>
                      <h3 className="font-semibold text-slate-100 text-base">
                        {profile.firstName} {profile.lastName}
                      </h3>
                      <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
                        {relationLabel}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => openEditModal(profile)}
                      title={t.common.edit}
                      className="p-1.5 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    {profile.relationType !== 'self' && (
                      <button
                        onClick={() => {
                          if (confirm(`${t.profiles.confirmDelete} ${profile.firstName} ${profile.lastName}?`)) {
                            onDeleteProfile(profile.id);
                          }
                        }}
                        title={t.common.delete}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-xs text-slate-300 mt-4 bg-slate-950/40 p-3 rounded-xl border border-slate-800/60">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400 flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-indigo-400" />
                      {t.profiles.dob}:
                    </span>
                    <span className="font-mono font-medium text-slate-200">{profile.birthDate}</span>
                  </div>

                  {profile.motherBirthDate && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{t.profiles.motherDob}:</span>
                      <span className="font-mono text-slate-300">{profile.motherBirthDate}</span>
                    </div>
                  )}

                  {profile.fatherBirthDate && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span>{t.profiles.fatherDob}:</span>
                      <span className="font-mono text-slate-300">{profile.fatherBirthDate}</span>
                    </div>
                  )}

                  {profile.occupation && (
                    <div className="flex items-center justify-between text-slate-400">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-3.5 h-3.5 text-emerald-400" />
                        {t.profiles.occupation}:
                      </span>
                      <span className="text-slate-200 truncate max-w-[150px]">{profile.occupation}</span>
                    </div>
                  )}

                  {profile.financialGoals && (
                    <div className="pt-1 border-t border-slate-800/80 text-[11px] text-slate-400 italic">
                      "{profile.financialGoals}"
                    </div>
                  )}
                </div>
              </div>

              {/* Action */}
              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between gap-2">
                <button
                  onClick={() => onSelectProfile(profile)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/40'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {isSelected ? t.profiles.activeContext : t.common.select}
                </button>

                <button
                  onClick={() => onRunMatrixForProfile(profile)}
                  className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white flex items-center gap-1.5 transition-all shadow-md shadow-indigo-600/20 cursor-pointer"
                >
                  <Sparkles className="w-3 h-3 text-cyan-300" />
                  <span>{t.profiles.runMatrixBtn}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Profile Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                {editingProfileId ? <Edit2 className="w-5 h-5 text-indigo-400" /> : <Plus className="w-5 h-5 text-indigo-400" />}
                <span>{editingProfileId ? t.profiles.editProfileModalTitle : t.profiles.createProfileModalTitle}</span>
              </h3>
              <button
                onClick={() => setIsFormOpen(false)}
                className="text-slate-400 hover:text-slate-200 text-sm font-semibold cursor-pointer"
              >
                ✕
              </button>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t.profiles.relationContext}</label>
                <select
                  value={formData.relationType}
                  onChange={(e) => setFormData({ ...formData, relationType: e.target.value as RelationshipType })}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                >
                  {(Object.keys(t?.profiles?.relations || {}) as RelationshipType[]).map((key) => (
                    <option key={key} value={key}>
                      {t?.profiles?.relations?.[key] || key}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t.profiles.firstName} *</label>
                  <input
                    type="text"
                    required
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    placeholder="e.g. Elena"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t.profiles.lastName}</label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    placeholder="e.g. Rostova"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  {t.profiles.dob} (DD.MM.YYYY) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.birthDate}
                  onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
                  placeholder="e.g. 14.07.1990"
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t.profiles.motherDob}</label>
                  <input
                    type="text"
                    value={formData.motherBirthDate}
                    onChange={(e) => setFormData({ ...formData, motherBirthDate: e.target.value })}
                    placeholder="e.g. 23.04.1965"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t.profiles.fatherDob}</label>
                  <input
                    type="text"
                    value={formData.fatherBirthDate}
                    onChange={(e) => setFormData({ ...formData, fatherBirthDate: e.target.value })}
                    placeholder="e.g. 11.11.1962"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm font-mono text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t.profiles.occupation}</label>
                  <input
                    type="text"
                    value={formData.occupation}
                    onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
                    placeholder="e.g. Private Equity Director"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">{t.profiles.incomeBracket}</label>
                  <select
                    value={formData.monthlyIncomeBracket}
                    onChange={(e) => setFormData({ ...formData, monthlyIncomeBracket: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                  >
                    <option value="Under $3,000">Under $3,000</option>
                    <option value="$3,000 - $7,000">$3,000 - $7,000</option>
                    <option value="$7,000 - $15,000">$7,000 - $15,000</option>
                    <option value="$15,000 - $30,000">$15,000 - $30,000</option>
                    <option value="$30,000+">$30,000+</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">{t.profiles.goals}</label>
                <textarea
                  rows={2}
                  value={formData.financialGoals}
                  onChange={(e) => setFormData({ ...formData, financialGoals: e.target.value })}
                  placeholder="e.g. Overcome conservative hesitation on large capital allocations..."
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-sm text-slate-200 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-medium text-slate-300 hover:bg-slate-800 cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-lg shadow-indigo-600/20 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? t.common.loading : editingProfileId ? t.common.save : t.common.save}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {/* Confirmation Modal when editing existing profile */}
      <ProfileChangeConfirmModal
        isOpen={showConfirmModal}
        profileName={`${formData.firstName} ${formData.lastName || ''}`.trim() || (t.profiles?.profile || 'Profile')}
        changes={detectedChanges}
        onConfirm={executeSave}
        onCancel={() => setShowConfirmModal(false)}
        isSaving={loading}
      />
    </div>
  );
};
