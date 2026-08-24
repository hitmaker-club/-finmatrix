import React, { useState, useRef, useEffect } from 'react';
import { Globe, Check, ChevronDown, X } from 'lucide-react';
import { useI18n } from '../i18n/context.js';
import { Language } from '../i18n/types.js';

interface LanguageOption {
  code: Language;
  name: string;
  nativeName: string;
  flag: string;
}

const languages: LanguageOption[] = [
  { code: 'ru', name: 'Russian', nativeName: 'Русский', flag: '🇷🇺' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
  { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸' },
];

export const LanguageSelector: React.FC<{ compact?: boolean }> = ({ compact = false }) => {
  const { language, setLanguage } = useI18n();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentLang = languages.find(l => l.code === language) || languages[0];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, []);

  const selectLanguage = (code: Language) => {
    setLanguage(code);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block" ref={dropdownRef} id="language-selector-root">
      {/* Trigger Button */}
      <button
        id="language-selector-button"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-100 border border-slate-600 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-200 transition-all text-xs font-bold shadow-md cursor-pointer touch-manipulation active:scale-95"
        title="Сменить язык / Change language"
        aria-expanded={isOpen}
      >
        <span className="text-base leading-none">{currentLang.flag}</span>
        <span className="font-bold">
          {currentLang.nativeName}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-300 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Mobile Backdrop & Dropdown Container */}
      {isOpen && (
        <>
          {/* Backdrop for easy tap-to-close on mobile */}
          <div
            className="fixed inset-0 z-[9990] bg-black/40 backdrop-blur-xs sm:hidden"
            onClick={() => setIsOpen(false)}
          />

          {/* Menu */}
          <div
            id="language-dropdown-menu"
            className="fixed sm:absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 sm:top-full sm:left-0 sm:translate-x-0 sm:translate-y-0 mt-0 sm:mt-2 w-[85vw] max-w-[280px] sm:w-56 rounded-2xl bg-slate-900 border-2 border-indigo-500/40 shadow-2xl p-2 z-[9999] animate-in fade-in zoom-in-95 duration-150"
          >
            <div className="flex items-center justify-between px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400 border-b border-slate-800 mb-1.5">
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400" />
                <span>Выберите язык</span>
              </div>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="sm:hidden p-1 text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-1">
              {languages.map(opt => {
                const isSelected = opt.code === language;
                return (
                  <button
                    key={opt.code}
                    id={`lang-opt-${opt.code}`}
                    type="button"
                    onClick={() => selectLanguage(opt.code)}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-xl text-sm font-semibold transition-all text-left cursor-pointer touch-manipulation active:scale-98 ${
                      isSelected
                        ? 'bg-indigo-600 text-white font-bold shadow-md shadow-indigo-600/30'
                        : 'text-slate-200 hover:bg-slate-800 hover:text-white active:bg-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-xl">{opt.flag}</span>
                      <div>
                        <span className="block leading-snug">{opt.nativeName}</span>
                        <span className="block text-[11px] text-slate-400 font-normal">{opt.name}</span>
                      </div>
                    </div>
                    {isSelected && <Check className="w-5 h-5 text-white" />}
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
};
