import React, { useState, useRef, useEffect } from 'react';
import {
  Users,
  History,
  ShieldCheck,
  LogIn,
  LogOut,
  User,
  ChevronDown,
  Shield,
  Layers,
  Zap,
  Download,
  Brain,
} from 'lucide-react';
import { Account, PersonProfile, Subscription } from '../types/domain.js';
import { useI18n } from '../i18n/context.js';
import { LanguageSelector } from './LanguageSelector.js';
import { ThemeToggle } from './ThemeToggle.js';
import { FinMatrixLogo } from './FinMatrixLogo.js';

interface NavigationProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  account: Account | null;
  subscription?: Subscription;
  profiles: PersonProfile[];
  selectedProfileId: string | null;
  onSelectProfile: (id: string) => void;
  onOpenNewProfileModal: () => void;
  onSwitchRole: (role: 'USER' | 'ADMIN') => void;
  onOpenPlannedModules: () => void;
  onOpenSubscriptionModal: () => void;
  onOpenAuthModal: (mode?: 'login' | 'register') => void;
  onOpenPwaModal?: () => void;
  onLogout: () => void;
}

export const Navigation: React.FC<NavigationProps> = ({
  currentTab,
  setCurrentTab,
  account,
  profiles,
  onSwitchRole,
  onOpenPlannedModules,
  onOpenAuthModal,
  onOpenPwaModal,
  onLogout,
}) => {
  const { t } = useI18n();
  const isAdmin = account?.role === 'ADMIN';
  const hasAdminPrivilege = account && (
    account.role === 'ADMIN' ||
    account.id === 'acc_desadmin' ||
    account.email?.toLowerCase() === 'desadmin' ||
    account.name?.toLowerCase() === 'desadmin' ||
    account.subscriptionTier === 'ENTERPRISE'
  );
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
        setUserMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getInitials = (name: string) => {
    if (!name) return 'U';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.substring(0, 2).toUpperCase();
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 dark:bg-slate-900/95 light:bg-white/95 backdrop-blur-md border-b border-slate-800 dark:border-slate-800 light:border-slate-200 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-3">
          
          {/* FinMatrix Logo & Branding */}
          <div
            onClick={() => setCurrentTab('diagnostic')}
            className="flex items-center gap-3 shrink-0 cursor-pointer group"
          >
            <FinMatrixLogo className="w-10 h-10 transition-transform duration-200 group-hover:scale-105" />
            <div className="hidden lg:block">
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-base text-slate-100 dark:text-slate-100 light:text-slate-900 tracking-tight">
                  Fin Matrix
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  v1.4
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium truncate max-w-xs">
                {t.nav?.subtitle || 'Финансовая матрица и системная диагностика'}
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1">
            {/* 1. FinMatrix Tab */}
            <button
              id="nav-diagnostic-tab"
              onClick={() => setCurrentTab('diagnostic')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                currentTab === 'diagnostic'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <FinMatrixLogo className="w-4 h-4 shrink-0" />
              <span>{t.nav?.matrix || 'Fin Matrix'}</span>
            </button>

            {/* 2. Socionics Tab */}
            <button
              id="nav-socionics-tab"
              onClick={() => setCurrentTab('socionics')}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                currentTab === 'socionics'
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-slate-800/60'
              }`}
            >
              <Brain className="w-4 h-4 text-purple-400" />
              <span>{t.nav?.socionics || 'Соционика'}</span>
            </button>

            {/* 2. Profiles Tab (ONLY when logged in) */}
            {account && (
              <button
                id="nav-profiles-tab"
                onClick={() => setCurrentTab('profiles')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'profiles'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <Users className="w-4 h-4 text-emerald-400" />
                <span>{t.nav?.profiles || 'Профили'} ({profiles.length})</span>
              </button>
            )}

            {/* 3. History Tab (ONLY when logged in) */}
            {account && (
              <button
                id="nav-history-tab"
                onClick={() => setCurrentTab('history')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'history'
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                    : 'text-slate-300 dark:text-slate-300 light:text-slate-700 hover:text-white hover:bg-slate-800/60'
                }`}
              >
                <History className="w-4 h-4 text-amber-400" />
                <span>{t.nav?.historyCalculations || t.nav?.history || 'История расчётов'}</span>
              </button>
            )}

            {/* 4. Admin Console (For Admins) */}
            {isAdmin && (
              <button
                id="nav-admin-tab"
                onClick={() => setCurrentTab('admin')}
                className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  currentTab === 'admin'
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
                    : 'text-rose-400 hover:text-rose-200 hover:bg-rose-950/40 border border-rose-500/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-rose-400" />
                <span>{t.nav?.adminConsole || 'Админ-панель'}</span>
              </button>
            )}
          </nav>

          {/* Right Action Controls: PWA Download, Language, Theme, User Profile */}
          <div className="flex items-center gap-2">
            
            {/* PWA Download / Install Button */}
            {onOpenPwaModal && (
              <button
                id="nav-download-pwa-btn"
                type="button"
                onClick={onOpenPwaModal}
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-950/60 hover:bg-cyan-900/80 text-cyan-300 border border-cyan-500/40 hover:border-cyan-400 text-xs font-bold transition-all shadow-sm shadow-cyan-950/30 cursor-pointer"
                title={t.pwa?.installApp || 'Скачать приложение Fin Matrix (PWA)'}
              >
                <Download className="w-3.5 h-3.5 text-cyan-400" />
                <span>{t.pwa?.installAppShort || 'Скачать Fin Matrix'}</span>
              </button>
            )}

            {/* Language Dropdown Selector */}
            <LanguageSelector />

            {/* Theme Toggle */}
            <ThemeToggle />

            {/* User Profile & Auth Menu */}
            {account ? (
              <div className="relative" ref={userMenuRef}>
                <button
                  id="user-profile-menu-btn"
                  type="button"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-slate-100 transition-all cursor-pointer"
                >
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center font-black text-xs ${
                      isAdmin
                        ? 'bg-rose-600 text-white shadow-sm'
                        : 'bg-indigo-600 text-white shadow-sm'
                    }`}
                  >
                    {getInitials(account.name)}
                  </div>
                  <div className="hidden sm:block text-left">
                    <span className="block text-xs font-bold leading-tight truncate max-w-[110px]">
                      {account.name}
                    </span>
                    <span
                      className={`text-[9px] font-extrabold uppercase tracking-wider ${
                        isAdmin ? 'text-rose-400' : 'text-indigo-400'
                      }`}
                    >
                      {isAdmin ? (t.nav?.administrator || 'ADMIN') : (t.nav?.account || 'АККАУНТ')}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
                </button>

                {/* User Dropdown Menu */}
                {userMenuOpen && (
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-slate-900 border border-slate-700 shadow-2xl p-2 z-50 animate-in fade-in zoom-in-95 duration-100"
                  >
                    {/* User Header */}
                    <div className="px-3 py-2.5 border-b border-slate-800 mb-2">
                      <p className="text-xs font-bold text-slate-100 truncate">{account.name}</p>
                      <p className="text-[11px] text-slate-400 truncate">{account.email}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span
                          className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full ${
                            isAdmin
                              ? 'bg-rose-500/20 text-rose-300 border border-rose-500/30'
                              : 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                          }`}
                        >
                          {isAdmin ? (t.nav?.administrator || 'Администратор') : (t.nav?.account || 'Аккаунт')}
                        </span>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-800 text-emerald-300 border border-slate-700">
                          {t.nav?.fullAccess || '● Полный доступ'}
                        </span>
                      </div>
                    </div>

                    {/* Menu Actions */}
                    <button
                      type="button"
                      onClick={() => {
                        setCurrentTab('profiles');
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <Users className="w-4 h-4 text-emerald-400" />
                      <span>{t.nav?.myProfiles || t.nav?.profiles || 'Мои профили'} ({profiles.length})</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        onOpenPlannedModules();
                        setUserMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 hover:text-white transition-colors cursor-pointer text-left"
                    >
                      <Layers className="w-4 h-4 text-cyan-400" />
                      <span>{t.nav?.diagnosticTypes || t.nav?.modulesBlueprint || 'Виды диагностики'}</span>
                    </button>

                    {/* PWA Install Option in Menu */}
                    {onOpenPwaModal && (
                      <button
                        type="button"
                        onClick={() => {
                          onOpenPwaModal();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-cyan-300 hover:bg-cyan-950/50 transition-colors cursor-pointer text-left"
                      >
                        <Download className="w-4 h-4 text-cyan-400" />
                        <span>{t.pwa?.installApp || 'Скачать приложение Fin Matrix'}</span>
                      </button>
                    )}

                    {/* Fast Switch Role (Exclusively for accounts with Admin privileges) */}
                    {hasAdminPrivilege && (
                      <div className="pt-2 mt-1 border-t border-slate-800">
                        <p className="text-[10px] font-bold uppercase text-amber-400 px-3 mb-1 flex items-center justify-between">
                          <span>{t.nav?.roleMode || 'Режим (Админ):'}</span>
                          <span className="text-[9px] text-slate-500 font-mono">mode</span>
                        </p>
                        <div className="grid grid-cols-2 gap-1 px-1">
                          <button
                            type="button"
                            onClick={() => {
                              onSwitchRole('USER');
                              setUserMenuOpen(false);
                            }}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              !isAdmin
                                ? 'bg-indigo-600 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <User className="w-3 h-3" />
                            <span>USER</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              onSwitchRole('ADMIN');
                              setUserMenuOpen(false);
                            }}
                            className={`px-2 py-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 cursor-pointer ${
                              isAdmin
                                ? 'bg-rose-600 text-white'
                                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                            }`}
                          >
                            <Shield className="w-3 h-3" />
                            <span>ADMIN</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Switch Account & Logout */}
                    <div className="pt-2 mt-2 border-t border-slate-800">
                      <button
                        type="button"
                        onClick={() => {
                          onOpenAuthModal('login');
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 hover:bg-slate-800 transition-colors cursor-pointer text-left"
                      >
                        <LogIn className="w-4 h-4 text-emerald-400" />
                        <span>{t.auth?.switchAccount || 'Сменить аккаунт / Вход'}</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          onLogout();
                          setUserMenuOpen(false);
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs font-medium text-rose-400 hover:bg-rose-950/40 transition-colors cursor-pointer text-left mt-1"
                      >
                        <LogOut className="w-4 h-4 text-rose-400" />
                        <span>{t.auth?.logout || 'Выйти'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('login')}
                  className="px-3 py-1.5 rounded-xl bg-slate-800 text-slate-200 hover:bg-slate-700 text-xs font-bold transition-colors cursor-pointer flex items-center gap-1.5"
                >
                  <LogIn className="w-3.5 h-3.5 text-indigo-400" />
                  <span>{t.auth?.login || 'Войти'}</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAuthModal('register')}
                  className="px-3 py-1.5 rounded-xl bg-indigo-600 text-white hover:bg-indigo-500 text-xs font-bold transition-colors shadow-md cursor-pointer flex items-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{t.auth?.register || 'Регистрация'}</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 dark:bg-slate-950/95 light:bg-white/95 backdrop-blur-lg border-t border-slate-800 dark:border-slate-800 light:border-slate-200 px-2 py-1.5 flex justify-around items-center">
        {/* 1. FinMatrix Tab */}
        <button
          onClick={() => setCurrentTab('diagnostic')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[9px] font-semibold ${
            currentTab === 'diagnostic' ? 'text-indigo-400 font-bold' : 'text-slate-400'
          }`}
        >
          <FinMatrixLogo className="w-5 h-5 mb-0.5" />
          <span>Fin Matrix</span>
        </button>

        {/* 2. Socionics Tab */}
        <button
          onClick={() => setCurrentTab('socionics')}
          className={`flex flex-col items-center py-1 px-2 rounded-lg text-[9px] font-semibold ${
            currentTab === 'socionics' ? 'text-purple-400 font-bold' : 'text-slate-400'
          }`}
        >
          <Brain className="w-5 h-5 mb-0.5 text-purple-400" />
          <span>{t.nav?.socionics || 'Соционика'}</span>
        </button>

        {/* 2. Profiles Tab (ONLY when logged in) */}
        {account && (
          <button
            onClick={() => setCurrentTab('profiles')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[9px] font-semibold ${
              currentTab === 'profiles' ? 'text-emerald-400 font-bold' : 'text-slate-400'
            }`}
          >
            <Users className="w-5 h-5 mb-0.5" />
            <span>{t.nav?.profiles || 'Профили'}</span>
          </button>
        )}

        {/* 3. History Tab (ONLY when logged in) */}
        {account && (
          <button
            onClick={() => setCurrentTab('history')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[9px] font-semibold ${
              currentTab === 'history' ? 'text-amber-400 font-bold' : 'text-slate-400'
            }`}
          >
            <History className="w-5 h-5 mb-0.5" />
            <span>{t.nav?.history || 'История'}</span>
          </button>
        )}

        {/* 4. Download PWA button on mobile */}
        {onOpenPwaModal && (
          <button
            onClick={onOpenPwaModal}
            className="flex flex-col items-center py-1 px-2 rounded-lg text-[9px] font-semibold text-cyan-400"
          >
            <Download className="w-5 h-5 mb-0.5 text-cyan-400" />
            <span>PWA</span>
          </button>
        )}

        {/* 5. Admin or Auth / Account button */}
        {isAdmin ? (
          <button
            onClick={() => setCurrentTab('admin')}
            className={`flex flex-col items-center py-1 px-2 rounded-lg text-[9px] font-semibold ${
              currentTab === 'admin' ? 'text-rose-400 font-bold' : 'text-rose-500/70'
            }`}
          >
            <ShieldCheck className="w-5 h-5 mb-0.5" />
            <span>{t.common?.admin || 'Админ'}</span>
          </button>
        ) : (
          <button
            onClick={() => {
              if (account) {
                setUserMenuOpen(true);
              } else {
                onOpenAuthModal('login');
              }
            }}
            className="flex flex-col items-center py-1 px-2 rounded-lg text-[9px] font-semibold text-slate-400 hover:text-indigo-400"
          >
            <User className="w-5 h-5 mb-0.5" />
            <span>{account ? (t.nav?.account || 'Аккаунт') : (t.auth?.login || 'Войти')}</span>
          </button>
        )}
      </div>
    </header>
  );
};

