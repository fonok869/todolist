import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './UserMenu.css';

export const UserMenu: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    navigate('/logout');
    setIsOpen(false);
  };

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  if (!user) return null;

  return (
    <div className="user-menu">
      <button
        className="user-menu-trigger"
        onClick={toggleMenu}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <div className="user-avatar">
          {user.username.charAt(0).toUpperCase()}
        </div>
        <span className="user-name">{user.username}</span>
        <svg
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M4 6l4 4 4-4H4z" />
        </svg>
      </button>

      {isOpen && (
        <>
          <div className="user-menu-overlay" onClick={() => setIsOpen(false)} />
          <div className="user-menu-dropdown">
            <div className="user-info">
              <div className="user-details">
                <div className="user-username">{user.username}</div>
                <div className="user-email">{user.email}</div>
              </div>
            </div>
            <div className="user-menu-divider" />
            <button className="user-menu-item" onClick={handleLogout}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                <path d="M6 2a1 1 0 000 2h4a1 1 0 000-2H6zM3 6a3 3 0 013-3h4a3 3 0 013 3v6a3 3 0 01-3 3H6a3 3 0 01-3-3V6zm2-1a1 1 0 00-1 1v6a1 1 0 001 1h6a1 1 0 001-1V6a1 1 0 00-1-1H5z"/>
                <path d="M8 8a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3A.5.5 0 018 8z"/>
                <path d="M11.146 7.146a.5.5 0 01.708.708L10.707 9l1.147 1.146a.5.5 0 01-.708.708L10 9.707l-1.146 1.147a.5.5 0 01-.708-.708L9.293 9 8.146 7.854a.5.5 0 01.708-.708L10 8.293l1.146-1.147z"/>
              </svg>
              Sign Out
            </button>
          </div>
        </>
      )}
    </div>
  );
};