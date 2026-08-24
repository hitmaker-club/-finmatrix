import React, { useState } from 'react';
import {
  X,
  LogIn,
  UserPlus,
  Mail,
  Lock,
  User,
  Gift,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { api } from '../services/api.js';
import { Account, Subscription } from '../types/domain.js';
import { useI18n } from '../i18n/context.js';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAuthSuccess: (account: Account, subscription?: Subscription) => void;
  initialMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onAuthSuccess,
  initialMode = 'login',
}) => {
  const { t } = useI18n();
  const [mode, setMode] = useState<'login' | 'register'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [referralCode, setReferralCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email) {
          throw new Error(t.auth?.pleaseEnterEmail || 'Please enter your email address');
        }
        const res = await api.login({ email, password });
        setSuccessMsg(t.auth?.authSuccess || 'Authentication successful');
        setTimeout(() => {
          onAuthSuccess(res.account, res.subscription);
          onClose();
        }, 500);
      } else {
        if (!name.trim()) {
          throw new Error(t.auth?.pleaseEnterName || 'Please enter your name');
        }
        if (!email.trim() || !email.includes('@')) {
          throw new Error(t.auth?.pleaseEnterValidEmail || 'Please enter a valid email address');
        }
        const res = await api.register({
          name: name.trim(),
          email: email.trim(),
          password,
          referralCode: referralCode.trim() || undefined,
        });
        setSuccessMsg(t.auth?.accountCreatedSuccess || 'Account created successfully!');
        setTimeout(() => {
          onAuthSuccess(res.account, res.subscription);
          onClose();
        }, 700);
      }
    } catch (err: any) {
      setError(err.message || t.auth?.authError || 'Authentication error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async (customEmail?: string) => {
    setError(null);
    setSuccessMsg(null);
    setGoogleLoading(true);
    try {
      const gEmail = customEmail || email.trim() || 'hitmaker.club@gmail.com';
      const gName = name.trim() || (gEmail.includes('@') ? gEmail.split('@')[0] : 'Google User');
      
      const res = await api.googleLogin({
        email: gEmail,
        name: gName,
      });

      setSuccessMsg(`${t.auth?.googleAuthSuccess || 'Signed in via Google:'} ${res.account.email}`);
      setTimeout(() => {
        onAuthSuccess(res.account, res.subscription);
        onClose();
      }, 500);
    } catch (err: any) {
      setError(err.message || t.auth?.googleAuthError || 'Failed to sign in with Google.');
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        id="auth-modal-card"
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-md bg-slate-900 border border-slate-700/80 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden max-h-[92vh] overflow-y-auto"
      >
        {/* Decorative Top Accent */}
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-500 via-emerald-500 to-indigo-500" />

        {/* Close Button */}
        <button
          id="close-auth-modal-btn"
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-slate-800/80 text-slate-400 hover:text-slate-100 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Mode Switcher Tabs */}
        <div className="flex bg-slate-950/80 p-1 rounded-2xl border border-slate-800 mb-5">
          <button
            type="button"
            id="auth-tab-login"
            onClick={() => {
              setMode('login');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'login'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{t.auth?.login || 'Вход'}</span>
          </button>
          <button
            type="button"
            id="auth-tab-register"
            onClick={() => {
              setMode('register');
              setError(null);
              setSuccessMsg(null);
            }}
            className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
              mode === 'register'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{t.auth?.register || 'Регистрация'}</span>
          </button>
        </div>

        {/* Header Title */}
        <div className="mb-5">
          <h2 className="text-xl font-black text-slate-100 flex items-center gap-2">
            {mode === 'login' ? (t.auth?.loginTitle || 'Вход в аккаунт FinMatrix') : (t.auth?.registerTitle || 'Создать аккаунт FinMatrix')}
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            {mode === 'login'
              ? (t.auth?.loginSubtitle || 'Авторизуйтесь для доступа к сохраненным профилям и аналитике')
              : (t.auth?.registerSubtitle || 'Зарегистрируйтесь для сохранения профилей и расчётов')}
          </p>
        </div>

        {/* Error / Success Feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2.5">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Google Sign-In Button */}
        <div className="mb-4">
          <button
            id="google-signin-btn"
            type="button"
            disabled={googleLoading}
            onClick={() => handleGoogleSignIn()}
            className="w-full py-3 px-4 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-semibold text-xs transition-all flex items-center justify-center gap-3 shadow-md hover:shadow-lg border border-slate-200 cursor-pointer disabled:opacity-60"
          >
            {googleLoading ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : (
              <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
                />
                <path
                  fill="#34A853"
                  d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.34 24 12 24z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
                />
                <path
                  fill="#EA4335"
                  d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.34 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
                />
              </svg>
            )}
            <span>{t.auth?.signInWithGoogle || 'Sign in with Google'}</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative flex py-2 items-center mb-4">
          <div className="flex-grow border-t border-slate-800"></div>
          <span className="flex-shrink mx-3 text-[11px] text-slate-500 uppercase font-medium">
            {t.auth?.orWithEmail || 'or with email'}
          </span>
          <div className="flex-grow border-t border-slate-800"></div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>{t.auth?.name || 'Name'} *</span>
              </label>
              <input
                id="auth-input-name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={t.auth?.namePlaceholder || 'e.g. Alex Vance'}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>{mode === 'login' ? `${t.auth?.emailOrLogin || 'Email or Login'} *` : `${t.auth?.email || 'Email'} *`}</span>
            </label>
            <input
              id="auth-input-email"
              type={mode === 'register' ? 'email' : 'text'}
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={mode === 'register' ? 'name@company.com' : t.auth?.emailPlaceholder || 'name@company.com or demo-user'}
              className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 focus:outline-none focus:border-indigo-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{t.auth?.password || 'Password'} {mode === 'register' ? '*' : ''}</span>
            </label>
            <div className="relative">
              <input
                id="auth-input-password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === 'login' ? (t.auth?.passwordPlaceholder || '••••••••') : (t.auth?.createPasswordPlaceholder || 'Create a password')}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 pr-10 focus:outline-none focus:border-indigo-500 transition-colors"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 transition-colors cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {mode === 'register' && (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                <Gift className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.auth?.referralCodeOptional || 'Referral Code (optional)'}</span>
              </label>
              <input
                id="auth-input-referral"
                type="text"
                value={referralCode}
                onChange={(e) => setReferralCode(e.target.value)}
                placeholder={t.auth?.referralPlaceholder || 'e.g. PROMO2026'}
                className="w-full bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2.5 text-xs text-slate-100 uppercase tracking-wider focus:outline-none focus:border-indigo-500 transition-colors"
              />
            </div>
          )}

          <button
            id="auth-submit-btn"
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-1"
          >
            {loading ? (
              <span className="inline-block animate-spin">⏳</span>
            ) : mode === 'login' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>{t.auth?.signIn || 'Войти'}</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>{t.auth?.createAccount || 'Зарегистрироваться'}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
