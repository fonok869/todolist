import React, { useState } from 'react';
import { useBackendTodos } from '../contexts/BackendTodoContext';
import { useI18n } from '../contexts/I18nContext';
import { AddCategoryModal } from './AddCategoryModal';
import { DeleteCategoryModal } from './DeleteCategoryModal';

export const CategorySelector: React.FC = () => {
  const { categories, selectedCategory, setSelectedCategory, addCategory, removeCategory, todos } = useBackendTodos();
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

    addCategory(name).catch(error => alert(error.message));
    setSelectedCategory(name); // Switch to the newly created category
  };

  const handleRemoveCategory = (categoryName: string) => {
    setCategoryToDelete(categoryName);
    setDeleteModalOpen(true);
  };

  const confirmDeleteCategory = () => {
    if (categoryToDelete) {
      removeCategory(categoryToDelete).catch(error => alert(error.message));
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

  return (
    <>
      <div className="category-selector-container">
        <div className="category-selector">
          {categories.map(category => (
            <div key={category.id} className="category-item">
              <button
                onClick={() => setSelectedCategory(category.name)}
                className={`category-button ${selectedCategory === category.name ? 'active' : ''}`}
              >
                {category.name}
              </button>
              
              {categories.length > 1 && (
                <button
                  onClick={() => handleRemoveCategory(category.name)}
                  className="remove-category-button"
                  title={t.removeCategory}
                >
                  ×
                </button>
              )}
            </div>
          ))}
        </div>
        
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="add-category-button"
          title={t.addNewCategory}
        >
          {t.addCategory}
        </button>
      </div>

      <AddCategoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddCategory={handleAddCategory}
      />

      <DeleteCategoryModal
        isOpen={deleteModalOpen}
        categoryName={categoryToDelete}
        todoCount={getTodoCountForCategory(categoryToDelete)}
        onConfirm={confirmDeleteCategory}
        onCancel={cancelDeleteCategory}
      />
    </>
  );
};