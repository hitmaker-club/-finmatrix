import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '../theme/context.js';
import { useI18n } from '../i18n/context.js';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  return (
    <button
      id="theme-toggle-btn"
      type="button"
      onClick={toggleTheme}
      className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/90 text-slate-200 border border-slate-700/60 dark:bg-slate-800/80 dark:border-slate-700/60 dark:text-slate-200 dark:hover:bg-slate-700/80 transition-all cursor-pointer shadow-sm flex items-center justify-center"
      title={`${t.theme.toggle}: ${theme === 'dark' ? t.theme.light : t.theme.dark}`}
      aria-label={t.theme.toggle}
    >
      {theme === 'dark' ? (
        <Sun className="w-4 h-4 text-amber-400 animate-in fade-in" />
      ) : (
        <Moon className="w-4 h-4 text-indigo-400 animate-in fade-in" />
      )}
    </button>
  );
};
