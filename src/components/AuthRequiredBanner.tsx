import React from 'react';
import { Lock, LogIn, UserPlus, Shield, Sparkles } from 'lucide-react';
import { useI18n } from '../i18n/context.js';

interface AuthRequiredBannerProps {
  onOpenAuthModal: (mode: 'login' | 'register') => void;
  moduleName?: string;
  className?: string;
  compact?: boolean;
}

export const AuthRequiredBanner: React.FC<AuthRequiredBannerProps> = ({
  onOpenAuthModal,
  moduleName,
  className = '',
  compact = false,
}) => {
  const { t, language } = useI18n();

  if (compact) {
    return (
      <div
        className={`bg-slate-900/95 border border-amber-500/30 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-lg shadow-amber-950/20 backdrop-blur-sm ${className}`}
      >
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-9 h-9 rounded-xl bg-amber-500/15 border border-amber-500/30 flex items-center justify-center shrink-0 text-amber-400">
            <Lock className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                {t.auth?.authRequiredBadge || (language === 'ru' ? 'Вход обязателен' : 'Login Required')}
              </span>
              <h4 className="text-xs sm:text-sm font-bold text-slate-100">
                {t.auth?.authRequiredTitle || (language === 'ru' ? 'Требуется вход для прохождения теста' : 'Account login required')}
              </h4>
            </div>
            <p className="text-[11px] sm:text-xs text-slate-400 mt-1 leading-relaxed">
              {t.auth?.authRequiredSubtitle ||
                (language === 'ru'
                  ? 'Без входа в личный кабинет нельзя запускать тестирование. Войдите или зарегистрируйтесь, чтобы сохранить результаты.'
                  : 'You must log in or register before starting diagnostic tests to preserve your data.')}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={() => onOpenAuthModal('login')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold transition-all border border-slate-700 cursor-pointer"
          >
            <LogIn className="w-3.5 h-3.5 text-indigo-400" />
            <span>{t.auth?.login || 'Войти'}</span>
          </button>
          <button
            type="button"
            onClick={() => onOpenAuthModal('register')}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-600 hover:from-indigo-500 hover:to-cyan-500 text-white text-xs font-bold transition-all shadow-md cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.auth?.register || 'Регистрация'}</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-b from-slate-900/95 to-slate-950/95 border-2 border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-amber-950/30 backdrop-blur-md ${className}`}
    >
      {/* Decorative Glow */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/40 flex items-center justify-center shrink-0 text-amber-400 shadow-inner">
            <Lock className="w-6 h-6 sm:w-7 sm:h-7" />
          </div>

          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 bg-amber-500/15 border border-amber-500/30 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                <Shield className="w-3 h-3 text-amber-400" />
                {t.auth?.authRequiredBadge || (language === 'ru' ? 'Вход в личный кабинет обязателен' : 'Authentication Required')}
              </span>
              {moduleName && (
                <span className="text-[10px] font-bold text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded border border-slate-700">
                  {moduleName}
                </span>
              )}
            </div>

            <h3 className="text-base sm:text-lg font-bold text-slate-100">
              {t.auth?.authRequiredTitle ||
                (language === 'ru'
                  ? 'Для прохождения тестирования необходимо войти в личный кабинет'
                  : 'Registration or Login Required for Testing')}
            </h3>

            <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
              {t.auth?.authRequiredSubtitle ||
                (language === 'ru'
                  ? 'Без входа в личный кабинет нельзя запускать расчеты и тестирование. Это необходимо для персональной калибровки алгоритмов, сохранения результатов в вашем профиле и обеспечения конфиденциальности ваших данных.'
                  : 'You cannot perform tests or calculations without logging into your account. This ensures personalized calibration, secure history tracking, and strict data privacy.')}
            </p>

            <div className="flex items-center gap-2 pt-1 text-[11px] text-slate-400">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
              <span>
                {language === 'ru'
                  ? 'Быстрая регистрация занимает всего 10 секунд и открывает доступ ко всем 4 слоям анализа.'
                  : 'Quick registration takes 10 seconds and grants access to full 4-layer diagnostic analysis.'}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row md:flex-col lg:flex-row gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onOpenAuthModal('login')}
            className="px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 text-xs sm:text-sm font-bold transition-all border border-slate-700 hover:border-slate-600 flex items-center justify-center gap-2 cursor-pointer shadow-md"
          >
            <LogIn className="w-4 h-4 text-indigo-400" />
            <span>{t.auth?.authRequiredLoginBtn || (language === 'ru' ? 'Войти в аккаунт' : 'Log In')}</span>
          </button>

          <button
            type="button"
            onClick={() => onOpenAuthModal('register')}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-cyan-500 hover:from-indigo-500 hover:to-cyan-400 text-white text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xl shadow-indigo-600/30"
          >
            <UserPlus className="w-4 h-4 text-cyan-200" />
            <span>{t.auth?.authRequiredRegisterBtn || (language === 'ru' ? 'Зарегистрироваться' : 'Create Account')}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
