import React from 'react';
import { useI18n } from '../contexts/I18nContext';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
}) => {
  const { t } = useI18n();
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content confirmation-modal">
        <h2>{title}</h2>
        <p>{message}</p>
        
        <div className="form-actions">
          <button onClick={onCancel} className="cancel-button">
            {t.cancel}
          </button>
          <button onClick={onConfirm} className="confirm-button">
            {t.confirm}
          </button>
        </div>
      </div>
    </div>
  );
};