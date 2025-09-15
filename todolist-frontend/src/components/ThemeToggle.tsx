import React from 'react';
import { useTheme } from '../contexts/ThemeContext';
import { useI18n } from '../contexts/I18nContext';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();

  const ariaLabel = theme === 'light' ? t.switchToDarkMode : t.switchToLightMode;

  return (
    <button
      onClick={toggleTheme}
      className="theme-toggle"
      aria-label={ariaLabel}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  );
};