import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { I18nProvider } from './contexts/I18nContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LoadingSpinner } from './components/LoadingSpinner';
import { HomePage } from './pages/HomePage';
import { AnonymousHomePage } from './pages/AnonymousHomePage';
import { LoginPage } from './pages/LoginPage';
import { LogoutPage } from './pages/LogoutPage';
import { SignUpPage } from './pages/SignUpPage.tsx';
import { EmailValidationPage } from './pages/EmailValidationPage';
import { EmailValidationPendingPage } from './pages/EmailValidationPendingPage';
import './App.css'

const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="App">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

const AuthRedirectWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="App">
        <LoadingSpinner message="Loading..." />
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

const AppContent: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />
        <Route path="/logout" element={<LogoutPage />} />
        <Route path="/validate-email" element={<EmailValidationPage />} />
        <Route path="/email-validation-pending" element={<EmailValidationPendingPage />} />
        <Route path="/" element={
          <AuthRedirectWrapper>
            <AnonymousHomePage />
          </AuthRedirectWrapper>
        } />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
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
