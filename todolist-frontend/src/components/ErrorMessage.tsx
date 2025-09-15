import React from 'react';

interface ErrorMessageProps {
  error: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ error, onRetry }) => {
  return (
    <div className="error-message">
      <h3>Error</h3>
      <p>{error}</p>
      {onRetry && (
        <button onClick={onRetry} className="retry-button">
          Retry
        </button>
      )}
    </div>
  );
};