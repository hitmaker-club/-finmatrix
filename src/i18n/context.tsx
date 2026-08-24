import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Language, TranslationDictionary } from './types.js';
import { ru } from './translations/ru.js';
import { en } from './translations/en.js';
import { es } from './translations/es.js';

interface I18nContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: TranslationDictionary;
}

const dictionaries: Record<Language, TranslationDictionary> = {
  ru,
  en,
  es,
};

const I18nContext = createContext<I18nContextType | null>(null);

const STORAGE_KEY = 'diag_app_locale';

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === 'ru' || saved === 'en' || saved === 'es') {
        return saved;
      }
      // Detect browser language
      const browserLang = navigator.language.toLowerCase();
      if (browserLang.startsWith('ru')) return 'ru';
      if (browserLang.startsWith('es')) return 'es';
      return 'ru'; // Default to Russian as per user priority
    } catch {
      return 'ru';
    }
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    try {
      localStorage.setItem(STORAGE_KEY, lang);
    } catch (e) {
      console.warn('Failed to save language preference:', e);
    }
  };

  const t = useMemo(() => dictionaries[language] || dictionaries.en, [language]);

  return (
    <I18nContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = (): I18nContextType => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};
