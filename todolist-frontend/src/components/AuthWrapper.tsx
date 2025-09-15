import React, { useState } from 'react';
import { Login } from './Login';
import { Register } from './Register';

type AuthMode = 'login' | 'register';

export const AuthWrapper: React.FC = () => {
  const [authMode, setAuthMode] = useState<AuthMode>('login');

  const switchToRegister = () => setAuthMode('register');
  const switchToLogin = () => setAuthMode('login');

  if (authMode === 'login') {
    return <Login onSwitchToRegister={switchToRegister} />;
  }

  return <Register onSwitchToLogin={switchToLogin} />;
};