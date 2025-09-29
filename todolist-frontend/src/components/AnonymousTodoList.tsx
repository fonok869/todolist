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
import { AnonymousTodoForm } from './AnonymousTodoForm';
import { ConfirmationModal } from './ConfirmationModal';
import { useTodos } from '../contexts/TodoContext';
import { useI18n } from '../contexts/I18nContext';
import type {TodoItem as TodoItemType} from '../types/index';

export const AnonymousTodoList: React.FC = () => {
  const { todos, selectedCategory, reorderTodos } = useTodos();
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

    if (over && active.id !== over.id) {
      const oldIndex = incompleteTodos.findIndex(todo => todo.id === active.id);
      const newIndex = incompleteTodos.findIndex(todo => todo.id === over.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const newOrder = arrayMove(incompleteTodos, oldIndex, newIndex);
        const reorderedTodos = [
          ...todos.filter(todo => todo.category !== selectedCategory || todo.done),
          ...newOrder,
          ...completedTodos
        ];

        setPendingReorder(reorderedTodos);
        setConfirmationOpen(true);
      }
    }
  };

  const handleConfirmReorder = () => {
    if (pendingReorder) {
      reorderTodos(pendingReorder);
      setPendingReorder(null);
    }
    setConfirmationOpen(false);
  };

  const handleCancelReorder = () => {
    setPendingReorder(null);
    setConfirmationOpen(false);
  };

  const handleEditTodo = (todo: TodoItemType) => {
    setEditTodo(todo);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditTodo(null);
  };

  return (
    <div className="todo-list">
      <div className="todo-list-header">
        <h2>{selectedCategory}</h2>
        <button
          className="add-todo-button"
          onClick={() => setIsFormOpen(true)}
        >
          {t.addTodo}
        </button>
      </div>

      {incompleteTodos.length === 0 && completedTodos.length === 0 ? (
        <div className="empty-state">
          {t.emptyState}
        </div>
      ) : (
        <>
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
                {incompleteTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onEdit={handleEditTodo}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>

          {completedTodos.length > 0 && (
            <>
              <div className="completed-separator">
                <span>{t.completed}</span>
              </div>
              <div className="todos-container">
                {completedTodos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onEdit={handleEditTodo}
                  />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {isFormOpen && (
        <AnonymousTodoForm
          editTodo={editTodo}
          onClose={handleCloseForm}
        />
      )}

      {confirmationOpen && (
        <ConfirmationModal
          isOpen={confirmationOpen}
          title={t.confirmReorder}
          message={t.confirmReorderMessage}
          onConfirm={handleConfirmReorder}
          onCancel={handleCancelReorder}
        />
      )}
    </div>
  );
};