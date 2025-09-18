import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const LogoutPage: React.FC = () => {
  const { logout, isAuthenticated } = useAuth();

  useEffect(() => {
    logout();
  }, [logout]);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <div className="App">
      <div>Logging out...</div>
    </div>
  );
};