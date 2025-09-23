import React from 'react';
import { useNavigate } from 'react-router-dom';

export const EmailValidationPendingPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="App">
      <div className="container">
        <div className="validation-pending-page">
          <div className="icon">📧</div>
          <h2>Check Your Email</h2>
          <p className="main-message">
            We've sent a validation email to your email address.
          </p>
          <div className="instructions">
            <h3>Next Steps:</h3>
            <ol>
              <li>Check your email inbox (and spam folder)</li>
              <li>Click the validation link in the email</li>
              <li>You'll be redirected to login</li>
            </ol>
          </div>
          <div className="important-note">
            <strong>Important:</strong> You must validate your email within 24 hours.
            After that, your account will be automatically removed and you'll need to register again.
          </div>
          <div className="actions">
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
            >
              Back to Login
            </button>
            <button
              onClick={() => navigate('/signup')}
              className="btn-secondary"
            >
              Register Different Account
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};