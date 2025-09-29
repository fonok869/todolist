import React, { useState } from 'react';
import { useTodos } from '../contexts/TodoContext';
import { useI18n } from '../contexts/I18nContext';
import { AddCategoryModal } from './AddCategoryModal';
import { DeleteCategoryModal } from './DeleteCategoryModal';

export const AnonymousCategorySelector: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, addCategory, removeCategory, todos } = useTodos();
  const { t } = useI18n();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string>('');

  const handleAddCategory = (name: string) => {
    // Check if category already exists (case-insensitive)
    const categoryExists = categories.some(
      category => category.name.toLowerCase() === name.toLowerCase()
    );

    if (categoryExists) {
      alert(t.categoryAlreadyExists);
      return;
    }

    addCategory(name);
    setSelectedCategory(name); // Switch to the newly created category
  };

  const handleRemoveCategory = (categoryName: string) => {
    setCategoryToDelete(categoryName);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      removeCategory(categoryToDelete);
      setDeleteModalOpen(false);
      setCategoryToDelete('');
    }
  };

  const cancelDeleteCategory = () => {
    setDeleteModalOpen(false);
    setCategoryToDelete('');
  };

  const getTodoCountForCategory = (categoryName: string): number => {
    return todos.filter(todo => todo.category === categoryName).length;
  };

  const getIncompleteTodoCountForCategory = (categoryName: string): number => {
    return todos.filter(todo => todo.category === categoryName && !todo.done).length;
  };

  return (
    <div className="category-selector-container">
      <div className="category-selector">
        {categories.map((category) => (
          <div key={category.id} className="category-item">
            <button
              className={`category-button ${selectedCategory === category.name ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.name)}
            >
              {category.name} ({getIncompleteTodoCountForCategory(category.name)})
            </button>
            {categories.length > 1 && (
              <button
                className="remove-category-button"
                onClick={() => handleRemoveCategory(category.name)}
                title={t.removeCategory}
              >
                ×
              </button>
            )}
          </div>
        ))}
        <button
          className="add-category-button"
          onClick={() => setIsAddModalOpen(true)}
        >
          + {t.addCategory}
        </button>
      </div>

      {isAddModalOpen && (
        <AddCategoryModal
          isOpen={isAddModalOpen}
          onAddCategory={handleAddCategory}
          onClose={() => setIsAddModalOpen(false)}
        />
      )}

      {deleteModalOpen && (
        <DeleteCategoryModal
          isOpen={deleteModalOpen}
          categoryName={categoryToDelete}
          todoCount={getTodoCountForCategory(categoryToDelete)}
          onConfirm={confirmDeleteCategory}
          onCancel={cancelDeleteCategory}
        />
      )}
    </div>
  );
};