import React from 'react';
import { BackendTodoProvider, useBackendTodos } from '../contexts/BackendTodoContext';
import { useI18n } from '../contexts/I18nContext';
import { ThemeToggle } from '../components/ThemeToggle';
import { CategorySelector } from '../components/CategorySelector';
import { TodoList } from '../components/TodoList';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorMessage } from '../components/ErrorMessage';
import { UserMenu } from '../components/UserMenu';

const HomeContent: React.FC = () => {
  const { t } = useI18n();
  const { loading, error, refreshTodos } = useBackendTodos();

  if (loading) {
    return (
      <div className="App">
        <LoadingSpinner message="Loading your todo list..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <ErrorMessage error={error} onRetry={refreshTodos} />
      </div>
    );
  }

  return (
    <div className="App">
      <header className="app-header">
        <h1>{t.appTitle}</h1>
        <div className="header-actions">
          <ThemeToggle />
          <UserMenu />
        </div>
      </header>

      <main className="app-main">
        <CategorySelector />
        <TodoList />
      </main>
    </div>
  );
};

export const HomePage: React.FC = () => {
  return (
    <BackendTodoProvider>
      <HomeContent />
    </BackendTodoProvider>
  );
};