import React, { createContext, useContext, useState } from 'react';
import { translations, type Translations } from '../i18n/translations';

interface I18nContextType {
  language: string;
  t: Translations;
  setLanguage: (lang: string) => void;
  formatMessage: (key: string, params?: Record<string, string | number>) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export const I18nProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<string>(() => {
    const saved = localStorage.getItem('language');
    return saved || 'en';
  });

  const setLanguage = (lang: string) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
  };

  const t = translations[language] || translations.en;

  const formatMessage = (key: string, params?: Record<string, string | number>): string => {
    const message = (t as any)[key] || key;

    if (!params) return message;

    return Object.entries(params).reduce((text, [key, value]) => {
      return text.replaceAll(`{${key}}`, String(value));
    }, message);
  };

  return (
    <I18nContext.Provider value={{ language, t, setLanguage, formatMessage }}>
      {children}
    </I18nContext.Provider>
  );
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (context === undefined) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
};