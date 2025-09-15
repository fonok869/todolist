import React from 'react';
import { ThemeProvider } from './contexts/ThemeContext';
import { BackendTodoProvider, useBackendTodos } from './contexts/BackendTodoContext';
import { I18nProvider, useI18n } from './contexts/I18nContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeToggle } from './components/ThemeToggle';
import { CategorySelector } from './components/CategorySelector';
import { TodoList } from './components/TodoList';
import { LoadingSpinner } from './components/LoadingSpinner';
import { ErrorMessage } from './components/ErrorMessage';
import { AuthWrapper } from './components/AuthWrapper';
import { UserMenu } from './components/UserMenu';
import './App.css'

const AuthenticatedApp: React.FC = () => {
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

const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading } = useAuth();
  
  if (isLoading) {
    return (
      <div className="App">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <AuthWrapper />;
  }
  
  return (
    <BackendTodoProvider>
      <AuthenticatedApp />
    </BackendTodoProvider>
  );
};

function App() {
  return (
    <I18nProvider>
      <ThemeProvider>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </ThemeProvider>
    </I18nProvider>
  );
}

export default App
