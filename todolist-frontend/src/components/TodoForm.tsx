import React, { useState, useEffect } from 'react';
import type {TodoItem} from '../types/index';
import { useBackendTodos } from '../contexts/BackendTodoContext';
import { useI18n } from '../contexts/I18nContext';
import { RankingConflictModal } from './RankingConflictModal';

interface TodoFormProps {
  isOpen: boolean;
  onClose: () => void;
  editTodo?: TodoItem | null;
}

export const TodoForm: React.FC<TodoFormProps> = ({ isOpen, onClose, editTodo }) => {
  const { addTodo, addTodoWithRankingShift, updateTodo, selectedCategory, checkRankingConflict } = useBackendTodos();
  const { t } = useI18n();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    ranking: 1,
  });
  const [conflictModalOpen, setConflictModalOpen] = useState(false);
  const [conflictData, setConflictData] = useState<{
    conflictingItem: TodoItem;
    affectedItems: TodoItem[];
  } | null>(null);

  useEffect(() => {
    if (editTodo) {
      setFormData({
        title: editTodo.title,
        description: editTodo.description,
        ranking: editTodo.ranking,
      });
    } else {
      setFormData({
        title: '',
        description: '',
        ranking: 1,
      });
    }
  }, [editTodo, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (editTodo) {
      updateTodo(editTodo.id, {
        title: formData.title,
        description: formData.description,
        ranking: formData.ranking,
      });
      onClose();
    } else {
      // Check for ranking conflicts when creating new todos
      const { conflictingItem, affectedItems } = checkRankingConflict(
        selectedCategory,
        formData.ranking
      );

      if (conflictingItem) {
        // Show conflict modal
        setConflictData({ conflictingItem, affectedItems });
        setConflictModalOpen(true);
      } else {
        // No conflict, add normally
        addTodo({
          title: formData.title,
          description: formData.description,
          category: selectedCategory,
          ranking: formData.ranking,
          done: false,
        });
        onClose();
      }
    }
  };

  const handleConflictConfirm = () => {
    // Add todo with ranking shift
    addTodoWithRankingShift({
      title: formData.title,
      description: formData.description,
      category: selectedCategory,
      ranking: formData.ranking,
      done: false,
    });
    
    setConflictModalOpen(false);
    setConflictData(null);
    onClose();
  };

  const handleConflictCancel = () => {
    setConflictModalOpen(false);
    setConflictData(null);
  };

  const sanitizeInput = (input: string): string => {
    return input.trim().replace(/[<>]/g, '');
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'ranking' ? parseInt(value) || 1 : sanitizeInput(value),
    }));
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="modal-overlay">
        <div className="modal-content">
          <h2>{editTodo ? t.editTodo : t.addNewTodo}</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">{t.titleRequired}</label>
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                maxLength={100}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">{t.description}</label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                maxLength={500}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ranking">{t.rankingRequired}</label>
              <input
                type="number"
                id="ranking"
                name="ranking"
                value={formData.ranking}
                onChange={handleChange}
                min={1}
                max={100}
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" onClick={onClose} className="cancel-button">
                {t.cancel}
              </button>
              <button type="submit" className="submit-button">
                {editTodo ? t.update : t.addTodoButton}
              </button>
            </div>
          </form>
        </div>
      </div>

      {conflictData && (
        <RankingConflictModal
          isOpen={conflictModalOpen}
          newTodo={formData}
          conflictingItem={conflictData.conflictingItem}
          affectedItems={conflictData.affectedItems}
          onConfirm={handleConflictConfirm}
          onCancel={handleConflictCancel}
        />
      )}
    </>
  );
};