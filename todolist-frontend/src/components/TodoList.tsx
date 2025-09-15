import React, { useState } from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
    type DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { TodoItem } from './TodoItem';
import { TodoForm } from './TodoForm';
import { ConfirmationModal } from './ConfirmationModal';
import { useBackendTodos } from '../contexts/BackendTodoContext';
import { useI18n } from '../contexts/I18nContext';
import type {TodoItem as TodoItemType} from '../types/index';

export const TodoList: React.FC = () => {
  const { todos, selectedCategory, reorderTodos } = useBackendTodos();
  const { t } = useI18n();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editTodo, setEditTodo] = useState<TodoItemType | null>(null);
  const [pendingReorder, setPendingReorder] = useState<TodoItemType[] | null>(null);
  const [confirmationOpen, setConfirmationOpen] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const categoryTodos = todos.filter(todo => todo.category === selectedCategory);
  
  // Separate incomplete and completed todos
  const incompleteTodos = categoryTodos
    .filter(todo => !todo.done)
    .sort((a, b) => a.ranking - b.ranking);
  
  const completedTodos = categoryTodos
    .filter(todo => todo.done)
    .sort((a, b) => a.ranking - b.ranking);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      // Only allow dragging within incomplete todos
      const activeItem = incompleteTodos.find(todo => todo.id === active.id);
      const overItem = incompleteTodos.find(todo => todo.id === over?.id);
      
      if (!activeItem || !overItem) {
        return; // Can't drag completed items or drag to completed items
      }

      const oldIndex = incompleteTodos.findIndex(todo => todo.id === active.id);
      const newIndex = incompleteTodos.findIndex(todo => todo.id === over?.id);
      
      const newOrder = arrayMove(incompleteTodos, oldIndex, newIndex);
      
      const updatedIncompleteTodos = newOrder.map((todo, index) => ({
        ...todo,
        ranking: index + 1,
      }));

      // Combine with completed todos for the confirmation
      const allUpdatedTodos = [...updatedIncompleteTodos, ...completedTodos];
      setPendingReorder(allUpdatedTodos);
      setConfirmationOpen(true);
    }
  };

  const confirmReorder = () => {
    if (pendingReorder) {
      const otherCategoryTodos = todos.filter(todo => todo.category !== selectedCategory);
      reorderTodos([...otherCategoryTodos, ...pendingReorder]);
    }
    setPendingReorder(null);
    setConfirmationOpen(false);
  };

  const cancelReorder = () => {
    setPendingReorder(null);
    setConfirmationOpen(false);
  };

  const handleEdit = (todo: TodoItemType) => {
    setEditTodo(todo);
    setIsFormOpen(true);
  };

  const handleFormClose = () => {
    setIsFormOpen(false);
    setEditTodo(null);
  };

  return (
    <div className="todo-list">
      <div className="todo-list-header">
        <h2>{selectedCategory}</h2>
        <button
          onClick={() => setIsFormOpen(true)}
          className="add-todo-button"
        >
          {t.addTodo}
        </button>
      </div>

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={incompleteTodos.map(todo => todo.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="todos-container">
            {incompleteTodos.map(todo => (
              <TodoItem
                key={todo.id}
                todo={todo}
                onEdit={handleEdit}
              />
            ))}
            
            {incompleteTodos.length === 0 && completedTodos.length === 0 && (
              <div className="empty-state">
                {t.noTodosInCategory}
              </div>
            )}
            
            {completedTodos.length > 0 && (
              <>
                {incompleteTodos.length > 0 && (
                  <div className="completed-separator">
                    <span>{t.completed} ({completedTodos.length})</span>
                  </div>
                )}
                {completedTodos.map(todo => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onEdit={handleEdit}
                  />
                ))}
              </>
            )}
          </div>
        </SortableContext>
      </DndContext>

      <TodoForm
        isOpen={isFormOpen}
        onClose={handleFormClose}
        editTodo={editTodo}
      />

      <ConfirmationModal
        isOpen={confirmationOpen}
        title={t.confirmReorder}
        message={t.confirmReorderMessage}
        onConfirm={confirmReorder}
        onCancel={cancelReorder}
      />
    </div>
  );
};