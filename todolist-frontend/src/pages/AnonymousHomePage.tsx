import React from 'react';
import { Link } from 'react-router-dom';
import { TodoProvider } from '../contexts/TodoContext';
import { useI18n } from '../contexts/I18nContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { AnonymousCategorySelector } from '../components/AnonymousCategorySelector';
import { AnonymousTodoList } from '../components/AnonymousTodoList';

const AnonymousHomeContent: React.FC = () => {
  const { t } = useI18n();

  return (
    <div className="App">
      <header className="app-header">
        <h1>{t.appTitle}</h1>
        <div className="header-actions">
          <ThemeToggle />
          <Link to="/login" className="btn-primary">
            Sign In
          </Link>
        </div>
      </header>

      <main className="app-main">
        <AnonymousCategorySelector />
        <AnonymousTodoList />
      </main>
    </div>
  );
};

export const AnonymousHomePage: React.FC = () => {
  return (
    <TodoProvider>
      <AnonymousHomeContent />
    </TodoProvider>
  );
};