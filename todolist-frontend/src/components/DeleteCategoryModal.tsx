import React from 'react';
import { useI18n } from '../contexts/I18nContext';

interface DeleteCategoryModalProps {
  isOpen: boolean;
  categoryName: string;
  todoCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteCategoryModal: React.FC<DeleteCategoryModalProps> = ({
  isOpen,
  categoryName,
  todoCount,
  onConfirm,
  onCancel,
}) => {
  const { t, formatMessage } = useI18n();

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content delete-category-modal">
        <h2>{t.deleteCategoryTitle}</h2>
        
        <div className="delete-category-warning">
          <p>
            {formatMessage('deleteCategoryMessage', { categoryName })}
          </p>
          
          {todoCount > 0 && (
            <p className="warning-text">
              <strong>⚠️ Warning:</strong><br />
              {formatMessage('deleteCategoryWarning', { todoCount: todoCount.toString() })}
            </p>
          )}
          
          {todoCount === 0 && (
            <p className="info-text">
              This category is empty and can be safely deleted.
            </p>
          )}
        </div>

        <div className="form-actions">
          <button onClick={onCancel} className="cancel-button">
            {t.cancel}
          </button>
          <button onClick={onConfirm} className="delete-button">
            {t.yesDeleteCategory}
          </button>
        </div>
      </div>
    </div>
  );
};