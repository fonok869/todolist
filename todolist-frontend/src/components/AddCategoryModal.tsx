import React, { useState } from 'react';
import { useI18n } from '../contexts/I18nContext';

interface AddCategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddCategory: (name: string) => void;
}

export const AddCategoryModal: React.FC<AddCategoryModalProps> = ({
  isOpen,
  onClose,
  onAddCategory,
}) => {
  const { t } = useI18n();
  const [categoryName, setCategoryName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (categoryName.trim()) {
      onAddCategory(categoryName.trim());
      setCategoryName('');
      onClose();
    }
  };

  const handleCancel = () => {
    setCategoryName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content add-category-modal">
        <h2>{t.addNewCategory}</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="categoryName">{t.categoryNameRequired}</label>
            <input
              type="text"
              id="categoryName"
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              placeholder={t.categoryNamePlaceholder}
              maxLength={100}
              required
              autoFocus
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={handleCancel} className="cancel-button">
              {t.cancel}
            </button>
            <button type="submit" className="submit-button">
              {t.addCategory}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};