import React, { useState, useEffect, useMemo } from 'react';
import {
  Calendar,
  Sparkles,
  Calculator,
  User,
  ShieldAlert,
  Info,
  CheckCircle2,
  Users,
  LogIn,
  UserPlus,
  Save,
  Check,
} from 'lucide-react';
import { PersonProfile, Account } from '../types/domain.js';
import { useI18n } from '../i18n/context.js';
import { LanguageSelector } from './LanguageSelector.js';
import { ThemeToggle } from './ThemeToggle.js';
import { ProfileChangeConfirmModal, FieldChange } from './ProfileChangeConfirmModal.js';
import { CustomDateSaveModal } from './CustomDateSaveModal.js';

interface FinancialMatrixFormProps {
  profiles: PersonProfile[];
  selectedProfile: PersonProfile | null;
  onSelectProfile: (profile: PersonProfile) => void;
  onCreateProfile?: (profileData: Partial<PersonProfile>) => Promise<PersonProfile>;
  onUpdateProfile?: (id: string, profile: Partial<PersonProfile>) => Promise<PersonProfile | void>;
  onRunDiagnostic: (data: {
    profileId?: string;
    firstName?: string;
    lastName?: string;
    userBirthDate: string;
    motherBirthDate?: string;
    fatherBirthDate?: string;
    occupation?: string;
    financialGoals?: string;
    notes?: string;
    lang?: string;
  }) => Promise<void>;
  isDiagnosing: boolean;
  error: string | null;
  account?: Account | null;
  onOpenAuthModal?: (mode?: 'login' | 'register') => void;
  onSwitchRole?: (role: 'USER' | 'ADMIN') => void;
}

export const FinancialMatrixForm: React.FC<FinancialMatrixFormProps> = ({
  profiles,
  selectedProfile,
  onSelectProfile,
  onCreateProfile,
  onUpdateProfile,
  onRunDiagnostic,
  isDiagnosing,
  error,
  account,
  onOpenAuthModal,
  onSwitchRole,
}) => {
  const { t, language } = useI18n();
  const [useCustomDates, setUseCustomDates] = useState(false);

  // Form input fields
  const [userBirthDate, setUserBirthDate] = useState('');
  const [motherBirthDate, setMotherBirthDate] = useState('');
  const [fatherBirthDate, setFatherBirthDate] = useState('');
  const [subjectName, setSubjectName] = useState('');
  const [occupation, setOccupation] = useState('');
  const [financialGoals, setFinancialGoals] = useState('');

  // Confirmation modal state
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showCustomDateSaveModal, setShowCustomDateSaveModal] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [savedSuccessFlash, setSavedSuccessFlash] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  const hasAdminPrivilege = account && (
    account.role === 'ADMIN' ||
    account.id === 'acc_desadmin' ||
    account.email?.toLowerCase() === 'desadmin' ||
    account.name?.toLowerCase() === 'desadmin'
  );

  // Sync state when selectedProfile changes
  useEffect(() => {
    if (selectedProfile && !useCustomDates) {
      setUserBirthDate(selectedProfile.birthDate || '');
      setMotherBirthDate(selectedProfile.motherBirthDate || '');
      setFatherBirthDate(selectedProfile.fatherBirthDate || '');
      const fullName = `${selectedProfile.firstName || ''} ${selectedProfile.lastName || ''}`.trim();
      setSubjectName(fullName);
      setOccupation(selectedProfile.occupation || '');
      setFinancialGoals(selectedProfile.financialGoals || '');
      setValidationError(null);
    }
  }, [selectedProfile, useCustomDates]);

  // Compute detected changes compared to saved profile baseline
  const detectedChanges = useMemo<FieldChange[]>(() => {
    if (useCustomDates || !selectedProfile) return [];

    const changes: FieldChange[] = [];
    const savedDob = (selectedProfile.birthDate || '').trim();
    const currentDob = userBirthDate.trim();
    if (currentDob && currentDob !== savedDob) {
      changes.push({
        key: 'dob',
        label: t.form.fieldSubjectDob,
        oldValue: savedDob,
        newValue: currentDob,
      });
    }

    const savedMotherDob = (selectedProfile.motherBirthDate || '').trim();
    const currentMotherDob = motherBirthDate.trim();
    if (currentMotherDob !== savedMotherDob) {
      changes.push({
        key: 'motherDob',
        label: t.form.fieldMotherDob,
        oldValue: savedMotherDob,
        newValue: currentMotherDob,
      });
    }

    const savedFatherDob = (selectedProfile.fatherBirthDate || '').trim();
    const currentFatherDob = fatherBirthDate.trim();
    if (currentFatherDob !== savedFatherDob) {
      changes.push({
        key: 'fatherDob',
        label: t.form.fieldFatherDob,
        oldValue: savedFatherDob,
        newValue: currentFatherDob,
      });
    }

    const savedFullName = `${selectedProfile.firstName || ''} ${selectedProfile.lastName || ''}`.trim();
    const currentFullName = subjectName.trim();
    if (currentFullName && currentFullName !== savedFullName) {
      changes.push({
        key: 'name',
        label: t.form.fieldName,
        oldValue: savedFullName,
        newValue: currentFullName,
      });
    }

    const savedOccupation = (selectedProfile.occupation || '').trim();
    const currentOccupation = occupation.trim();
    if (currentOccupation !== savedOccupation) {
      changes.push({
        key: 'occupation',
        label: t.form.fieldOccupation,
        oldValue: savedOccupation,
        newValue: currentOccupation,
      });
    }

    const savedGoals = (selectedProfile.financialGoals || '').trim();
    const currentGoals = financialGoals.trim();
    if (currentGoals !== savedGoals) {
      changes.push({
        key: 'goals',
        label: t.form.fieldGoals,
        oldValue: savedGoals,
        newValue: currentGoals,
      });
    }

    return changes;
  }, [selectedProfile, useCustomDates, userBirthDate, motherBirthDate, fatherBirthDate, subjectName, occupation, financialGoals, t]);

  const hasUnsavedProfileChanges = detectedChanges.length > 0;

  // Build payload
  const getPayload = () => {
    const nameParts = subjectName.trim().split(/\s+/);
    const firstName = nameParts[0] || selectedProfile?.firstName || (t.common?.subject || 'Subject');
    const lastName = nameParts.slice(1).join(' ') || selectedProfile?.lastName || '';

    return {
      profileId: !useCustomDates && selectedProfile ? selectedProfile.id : undefined,
      firstName,
      lastName,
      userBirthDate: userBirthDate.trim(),
      motherBirthDate: motherBirthDate.trim() || undefined,
      fatherBirthDate: fatherBirthDate.trim() || undefined,
      occupation: occupation.trim() || undefined,
      financialGoals: financialGoals.trim() || undefined,
      lang: language,
    };
  };

  // Perform profile update & sync
  const performProfileSync = async () => {
    if (!selectedProfile || !onUpdateProfile) return;

    const nameParts = subjectName.trim().split(/\s+/);
    const firstName = nameParts[0] || selectedProfile.firstName;
    const lastName = nameParts.slice(1).join(' ') || selectedProfile.lastName;

    await onUpdateProfile(selectedProfile.id, {
      firstName,
      lastName,
      birthDate: userBirthDate.trim(),
      motherBirthDate: motherBirthDate.trim(),
      fatherBirthDate: fatherBirthDate.trim(),
      occupation: occupation.trim(),
      financialGoals: financialGoals.trim(),
    });
  };

  // Direct manual save button handler
  const handleDirectSaveProfile = async () => {
    if (!hasUnsavedProfileChanges || !selectedProfile || !onUpdateProfile) return;
    setIsSavingProfile(true);
    setValidationError(null);
    try {
      await performProfileSync();
      setSavedSuccessFlash(true);
      setTimeout(() => setSavedSuccessFlash(false), 3000);
    } catch (err: any) {
      setValidationError(err.message || t.profiles?.errorSaving || 'Profile save error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Single Diagnostic trigger handler
  const handleDiagnosticClick = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const trimmedDob = userBirthDate.trim();
    if (!trimmedDob) {
      setValidationError(t.form?.subjectDobDesc || 'Please specify subject birth date (DD.MM.YYYY)');
      return;
    }

    // If custom dates are entered, prompt user to select/create a profile so that data is saved and persisted without errors
    if (useCustomDates) {
      setShowCustomDateSaveModal(true);
      return;
    }

    // If modifications are detected in an existing selected profile, open confirmation modal
    if (!useCustomDates && selectedProfile && hasUnsavedProfileChanges) {
      setShowConfirmModal(true);
      return;
    }

    // Otherwise run directly
    await executeDiagnostic();
  };

  // Handler when profile is selected / created from CustomDateSaveModal
  const handleCustomDateProceed = async (profile: PersonProfile) => {
    setShowCustomDateSaveModal(false);
    onSelectProfile(profile);
    setUseCustomDates(false);

    // Run diagnostic with profile ID
    const nameParts = (profile.firstName + ' ' + (profile.lastName || '')).trim();
    await onRunDiagnostic({
      profileId: profile.id,
      firstName: profile.firstName,
      lastName: profile.lastName,
      userBirthDate: profile.birthDate,
      motherBirthDate: profile.motherBirthDate,
      fatherBirthDate: profile.fatherBirthDate,
      occupation: profile.occupation,
      financialGoals: profile.financialGoals,
      lang: language,
    });
  };

  // Confirmed in modal -> sync and run diagnostic
  const handleConfirmAndRun = async () => {
    setIsSavingProfile(true);
    setShowConfirmModal(false);
    try {
      await performProfileSync();
      await executeDiagnostic();
    } catch (err: any) {
      setValidationError(err.message || 'Sync error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const executeDiagnostic = async () => {
    const payload = getPayload();
    await onRunDiagnostic(payload);
  };

  return (
    <div className="bg-slate-900/70 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xl relative overflow-hidden">
      {/* Glow highlight */}
      <div className="absolute -top-24 -right-24 w-64 h-64 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Top Quick Settings Bar (Language, Theme, Auth & Admin Role) */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 pb-4 mb-4 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <LanguageSelector />
          <ThemeToggle />
        </div>

        {/* Account / Login & Role Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {account ? (
            <div className="flex items-center gap-2 bg-slate-950/80 px-2.5 py-1.5 rounded-xl border border-slate-800">
              <div className="flex items-center gap-1.5 text-xs text-slate-200 font-bold">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span className="truncate max-w-[110px]">{account.name}</span>
              </div>

              {/* Quick Role Switcher ONLY for Admin Users */}
              {hasAdminPrivilege && onSwitchRole ? (
                <div className="flex items-center bg-slate-900 p-0.5 rounded-lg border border-slate-700/60 ml-1">
                  <button
                    type="button"
                    onClick={() => onSwitchRole('USER')}
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all cursor-pointer ${
                      account.role === 'USER'
                        ? 'bg-indigo-600 text-white shadow'
                        : 'text-slate-400 hover:text-white'
                    }`}
                  >
                    USER
                  </button>
                  <button
                    type="button"
                    onClick={() => onSwitchRole('ADMIN')}
                    className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all cursor-pointer ${
                      account.role === 'ADMIN'
                        ? 'bg-rose-600 text-white shadow'
                        : 'text-rose-400 hover:text-rose-200'
                    }`}
                  >
                    ADMIN
                  </button>
                </div>
              ) : (
                <span className="px-1.5 py-0.5 rounded text-[10px] font-bold uppercase bg-slate-900 text-indigo-300 border border-slate-800 ml-0.5">
                  {t.nav?.account || 'ACCOUNT'}
                </span>
              )}

              {onOpenAuthModal && (
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('login')}
                  className="text-[11px] font-semibold text-slate-400 hover:text-indigo-400 ml-1 underline cursor-pointer"
                >
                  {t.auth?.switchAccount || t.common?.switch || 'Switch'}
                </button>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              {onOpenAuthModal && (
                <>
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal('login')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
                  >
                    <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                    <span>{t.auth?.login || 'Login'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAuthModal('register')}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>{t.auth?.register || 'Register'}</span>
                  </button>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Header with Title and Mode Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
        <div>
          <h2 className="text-lg font-bold text-slate-100 flex items-center gap-2">
            <Calculator className="w-5 h-5 text-indigo-400" />
            <span>{t.form.title}</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            {t.form.subtitle}
          </p>
        </div>

        {/* Profile Mode Switcher */}
        <div className="flex items-center gap-2 bg-slate-950 p-1 rounded-xl border border-slate-800 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setUseCustomDates(false)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              !useCustomDates
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>{t.form.fromProfile}</span>
          </button>
          <button
            type="button"
            onClick={() => setUseCustomDates(true)}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 cursor-pointer ${
              useCustomDates
                ? 'bg-indigo-600 text-white shadow'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            <span>{t.form.customDates}</span>
          </button>
        </div>
      </div>

      {(error || validationError) && (
        <div className="mt-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 flex-shrink-0" />
          <span>{validationError || error}</span>
        </div>
      )}

      {/* Profile Selector if mode is 'From Profile' */}
      {!useCustomDates && profiles.length > 0 && (
        <div className="mt-5">
          <div className="flex items-center justify-between mb-2">
            <label className="text-xs font-semibold text-slate-300">{t.form.selectProfileLabel}</label>
            {hasUnsavedProfileChanges && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-medium text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  {t.form.profileDataChangedBadge}
                </span>
                <button
                  type="button"
                  onClick={handleDirectSaveProfile}
                  disabled={isSavingProfile}
                  className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  {savedSuccessFlash ? (
                    <span className="text-emerald-400 flex items-center gap-1">
                      <Check className="w-3.5 h-3.5" /> {t.common?.saved || 'Saved'}
                    </span>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>{t.form.saveProfileDirectBtn}</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
            {profiles.map((p) => {
              const isSelected = selectedProfile?.id === p.id;
              const relationLabel = t.profiles.relations[p.relationType as keyof typeof t.profiles.relations] || p.relationType;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => onSelectProfile(p)}
                  className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500/80 shadow-md shadow-indigo-950 ring-1 ring-indigo-500/50'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="truncate">
                    <p className="text-xs font-semibold text-slate-200 truncate">
                      {p.firstName} {p.lastName}
                    </p>
                    <p className="text-[10px] text-slate-400">{relationLabel} • {p.birthDate}</p>
                  </div>
                  {isSelected && <CheckCircle2 className="w-4 h-4 text-indigo-400 flex-shrink-0" />}
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Date Fields & Context Form */}
      <form onSubmit={handleDiagnosticClick} className="mt-5 space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          
          {/* User Date */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <label className="block text-xs font-semibold text-indigo-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.form.subjectDob}</span>
            </label>
            <input
              type="text"
              required
              value={userBirthDate}
              onChange={(e) => setUserBirthDate(e.target.value)}
              placeholder="DD.MM.YYYY"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-indigo-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">{t.form.subjectDobDesc}</span>
          </div>

          {/* Mother Date */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <label className="block text-xs font-semibold text-rose-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-rose-400" />
              <span>{t.form.motherDob}</span>
            </label>
            <input
              type="text"
              value={motherBirthDate}
              onChange={(e) => setMotherBirthDate(e.target.value)}
              placeholder="DD.MM.YYYY"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-rose-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">{t.form.motherDobDesc}</span>
          </div>

          {/* Father Date */}
          <div className="bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            <label className="block text-xs font-semibold text-blue-300 mb-1 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-blue-400" />
              <span>{t.form.fatherDob}</span>
            </label>
            <input
              type="text"
              value={fatherBirthDate}
              onChange={(e) => setFatherBirthDate(e.target.value)}
              placeholder="DD.MM.YYYY"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm font-mono text-slate-100 focus:outline-none focus:border-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">{t.form.fatherDobDesc}</span>
          </div>
        </div>

        {/* Name & Context Fields */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t.form.fieldName}</label>
            <input
              type="text"
              value={subjectName}
              onChange={(e) => setSubjectName(e.target.value)}
              placeholder={t.form.subjectNamePlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t.form.fieldOccupation}</label>
            <input
              type="text"
              value={occupation}
              onChange={(e) => setOccupation(e.target.value)}
              placeholder={t.profiles?.occupationPlaceholder || 'e.g. Entrepreneur / IT'}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">{t.form.fieldGoals}</label>
            <input
              type="text"
              value={financialGoals}
              onChange={(e) => setFinancialGoals(e.target.value)}
              placeholder={t.form.financialGoalPlaceholder}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Single Primary Action Bar */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            id="btn-diagnose-main"
            type="submit"
            disabled={isDiagnosing || isSavingProfile}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold flex items-center justify-center gap-2.5 shadow-xl shadow-indigo-600/30 transition-all cursor-pointer disabled:opacity-50"
          >
            <Sparkles className="w-4 h-4 text-cyan-200 animate-pulse flex-shrink-0" />
            <span>{isDiagnosing ? t.form.btnDiagnoseLoading : t.form.btnDiagnose}</span>
          </button>
        </div>
      </form>

      {/* Confirmation Modal when existing profile values were modified */}
      <ProfileChangeConfirmModal
        isOpen={showConfirmModal}
        profileName={selectedProfile ? `${selectedProfile.firstName} ${selectedProfile.lastName || ''}`.trim() : (t.common?.subject || 'Subject')}
        changes={detectedChanges}
        onConfirm={handleConfirmAndRun}
        onCancel={() => setShowConfirmModal(false)}
        isSaving={isSavingProfile}
      />

      {/* Modal to choose/create a profile when arbitrary dates are entered */}
      {showCustomDateSaveModal && (
        <CustomDateSaveModal
          isOpen={showCustomDateSaveModal}
          userBirthDate={userBirthDate}
          motherBirthDate={motherBirthDate}
          fatherBirthDate={fatherBirthDate}
          subjectName={subjectName}
          occupation={occupation}
          financialGoals={financialGoals}
          profiles={profiles}
          onSaveToNewProfile={async (profileData) => {
            if (onCreateProfile) {
              return await onCreateProfile(profileData);
            }
            throw new Error('Create profile handler unavailable');
          }}
          onSaveToExistingProfile={async (id, profileData) => {
            if (onUpdateProfile) {
              const res = await onUpdateProfile(id, profileData);
              if (res && 'id' in res) return res as PersonProfile;
              const found = profiles.find((p) => p.id === id);
              if (found) return { ...found, ...profileData } as PersonProfile;
            }
            throw new Error('Update profile handler unavailable');
          }}
          onProceedWithProfile={handleCustomDateProceed}
          onCancel={() => setShowCustomDateSaveModal(false)}
        />
      )}
    </div>
  );
};
