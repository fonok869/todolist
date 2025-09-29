import React, { useState, useEffect } from 'react';
import type {TodoItem} from '../types/index';
import { useTodos } from '../contexts/TodoContext';
import { useI18n } from '../contexts/I18nContext';
import { RankingConflictModal } from './RankingConflictModal';

interface TodoFormProps {
  onClose: () => void;
  editTodo?: TodoItem | null;
}

export const AnonymousTodoForm: React.FC<TodoFormProps> = ({ onClose, editTodo }) => {
  const { addTodo, addTodoWithRankingShift, updateTodo, selectedCategory, checkRankingConflict } = useTodos();
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
  }, [editTodo]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title.trim()) {
      alert(t.titleRequired);
      return;
    }

    if (formData.ranking < 1 || formData.ranking > 100) {
      alert(t.rankingRange);
      return;
    }

    const todoData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: selectedCategory,
      ranking: formData.ranking,
      done: editTodo?.done || false,
    };

    try {
      if (editTodo) {
        // Check for ranking conflicts when editing (excluding current todo)
        const conflictCheck = checkRankingConflict(selectedCategory, formData.ranking, editTodo.id);

        if (conflictCheck.conflictingItem) {
          setConflictData({
            conflictingItem: conflictCheck.conflictingItem,
            affectedItems: conflictCheck.affectedItems,
          });
          setConflictModalOpen(true);
          return;
        }

        updateTodo(editTodo.id, todoData);
      } else {
        // Check for ranking conflicts when adding new todo
        const conflictCheck = checkRankingConflict(selectedCategory, formData.ranking);

        if (conflictCheck.conflictingItem) {
          setConflictData({
            conflictingItem: conflictCheck.conflictingItem,
            affectedItems: conflictCheck.affectedItems,
          });
          setConflictModalOpen(true);
          return;
        }

        addTodo(todoData);
      }

      onClose();
    } catch (error) {
      console.error('Error saving todo:', error);
      alert(t.errorSavingTodo);
    }
  };

  const handleForceAdd = () => {
    const todoData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      category: selectedCategory,
      ranking: formData.ranking,
      done: editTodo?.done || false,
    };

    try {
      if (editTodo) {
        updateTodo(editTodo.id, todoData);
      } else {
        addTodoWithRankingShift(todoData);
      }

      setConflictModalOpen(false);
      onClose();
    } catch (error) {
      console.error('Error saving todo:', error);
      alert(t.errorSavingTodo);
    }
  };

  const handleCloseConflictModal = () => {
    setConflictModalOpen(false);
    setConflictData(null);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
          <h2>{editTodo ? t.editTodo : t.addTodo}</h2>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="title">{t.title}</label>
              <input
                type="text"
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder={t.titlePlaceholder}
                maxLength={100}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="description">{t.description}</label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder={t.descriptionPlaceholder}
                maxLength={500}
                rows={3}
              />
            </div>

            <div className="form-group">
              <label htmlFor="ranking">{t.ranking}</label>
              <input
                type="number"
                id="ranking"
                value={formData.ranking}
                onChange={(e) => setFormData(prev => ({ ...prev, ranking: parseInt(e.target.value) || 1 }))}
                min="1"
                max="100"
                required
              />
            </div>

            <div className="form-actions">
              <button type="button" className="cancel-button" onClick={onClose}>
                {t.cancel}
              </button>
              <button type="submit" className="submit-button">
                {editTodo ? t.updateTodo : t.addTodo}
              </button>
            </div>
          </form>
        </div>
      </div>

      {conflictModalOpen && conflictData && (
        <RankingConflictModal
          isOpen={conflictModalOpen}
          newTodo={{
            title: formData.title,
            description: formData.description,
            ranking: formData.ranking,
          }}
          conflictingItem={conflictData.conflictingItem}
          affectedItems={conflictData.affectedItems}
          onConfirm={handleForceAdd}
          onCancel={handleCloseConflictModal}
        />
      )}
    </>
  );
};