import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner } from '../components/LoadingSpinner';

export const EmailValidationPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    const token = searchParams.get('token');

    if (!token) {
      setMessage('Invalid validation link. Please check your email for the correct link.');
      setIsSuccess(false);
      setLoading(false);
      return;
    }

    validateEmail(token);
  }, [searchParams]);

  const validateEmail = async (token: string) => {
    try {
      const response = await fetch(`/api/email/validate-email?token=${token}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message || 'Email validated successfully! You can now log in.');
        setIsSuccess(true);
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setMessage(data.message || 'Email validation failed. Please try again or contact support.');
        setIsSuccess(false);
      }
    } catch (error) {
      console.error('Error validating email:', error);
      setMessage('An error occurred while validating your email. Please try again later.');
      setIsSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="App">
        <LoadingSpinner message="Validating your email..." />
      </div>
    );
  }

  return (
    <div className="App">
      <div className="container">
        <div className="validation-page">
          <h2>Email Validation</h2>
          <div className={`message ${isSuccess ? 'success' : 'error'}`}>
            {message}
          </div>
          {isSuccess && (
            <p className="redirect-message">
              Redirecting to login page in 3 seconds...
            </p>
          )}
          {!isSuccess && (
            <div className="actions">
              <button
                onClick={() => navigate('/login')}
                className="btn-primary"
              >
                Go to Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="btn-secondary"
              >
                Sign Up Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};