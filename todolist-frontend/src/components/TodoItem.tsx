import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import type {TodoItem as TodoItemType} from '../types/index';
import { useTodos } from '../contexts/TodoContext';
import { useI18n } from '../contexts/I18nContext';

interface TodoItemProps {
  todo: TodoItemType;
  onEdit: (todo: TodoItemType) => void;
}

const getRankingColor = (ranking: number): string => {
  if (ranking <= 3) return 'red';
  if (ranking <= 6) return 'yellow';
  return 'grey';
};

export const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const { toggleTodo } = useTodos();
  const { t } = useI18n();
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id: todo.id,
    disabled: todo.done // Disable dragging for completed items
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const rankingColor = getRankingColor(todo.ranking);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      className={`todo-item ${todo.done ? 'completed' : ''} ${rankingColor}-priority`}
    >
      <div className="todo-item-content">
        {!todo.done ? (
          <input
            type="checkbox"
            checked={todo.done}
            onChange={() => toggleTodo(todo.id)}
            className="todo-checkbox"
          />
        ) : (
          <div className="todo-completed-indicator">
            ✓
          </div>
        )}
        
        <div className="todo-info">
          <div className="todo-header">
            <span className={`todo-title ${todo.done ? 'crossed-out' : ''}`}>
              {todo.title}
            </span>
            <span className="todo-ranking">{t.rankingPrefix}{todo.ranking}</span>
          </div>
          {todo.description && (
            <div className={`todo-description ${todo.done ? 'crossed-out' : ''}`}>
              {todo.description}
            </div>
          )}
          <div className="todo-date">
            {t.createdLabel}: {todo.dateCreated.toLocaleDateString()}
          </div>
        </div>

        {!todo.done && (
          <button
            onClick={() => onEdit(todo)}
            className="edit-button"
          >
            {t.edit}
          </button>
        )}

        {!todo.done && (
          <div
            {...listeners}
            className="drag-handle"
            aria-label={t.dragToReorder}
          >
            ⋮⋮
          </div>
        )}
      </div>
    </div>
  );
};