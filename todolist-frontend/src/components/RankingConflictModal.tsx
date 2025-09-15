import React from 'react';
import type { TodoItem } from '../types/index';
import { useI18n } from '../contexts/I18nContext';

interface RankingConflictModalProps {
  isOpen: boolean;
  newTodo: { title: string; description: string; ranking: number };
  conflictingItem: TodoItem;
  affectedItems: TodoItem[];
  onConfirm: () => void;
  onCancel: () => void;
}

export const RankingConflictModal: React.FC<RankingConflictModalProps> = ({
  isOpen,
  newTodo,
  conflictingItem,
  affectedItems,
  onConfirm,
  onCancel,
}) => {
  const { t, formatMessage } = useI18n();
  
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content ranking-conflict-modal">
        <h2>{t.rankingConflictDetected}</h2>
        
        <div className="conflict-info">
          <p>
            {formatMessage('rankingConflictMessage', { ranking: newTodo.ranking.toString(), rankingPrefix: t.rankingPrefix })}
          </p>
          
          <div className="existing-item">
            <h3>{formatMessage('existingItemAtRanking', { ranking: conflictingItem.ranking.toString(), rankingPrefix: t.rankingPrefix })}</h3>
            <div className="item-preview">
              <div className="item-title">{conflictingItem.title}</div>
              <div className="item-description">{conflictingItem.description}</div>
              <div className="item-date">
                {t.created}: {conflictingItem.dateCreated.toLocaleDateString()}
              </div>
            </div>
          </div>

          <div className="new-item">
            <h3>{t.newItemToBeCreated}</h3>
            <div className="item-preview">
              <div className="item-title">{newTodo.title}</div>
              <div className="item-description">{newTodo.description}</div>
            </div>
          </div>

          {affectedItems.length > 0 && (
            <div className="cascade-info">
              <h3>{t.itemsMovedDown}</h3>
              <ul>
                {affectedItems.map((item) => (
                  <li key={item.id}>
                    {formatMessage('moveFromTo', {
                      title: item.title,
                      fromRanking: item.ranking.toString(),
                      toRanking: (item.ranking + 1).toString(),
                      rankingPrefix: t.rankingPrefix
                    })}
                  </li>
                ))}
              </ul>
              <p className="cascade-note">
                {formatMessage('continuousSequenceNote', { rankingPrefix: t.rankingPrefix })}
              </p>
            </div>
          )}
        </div>

        <div className="conflict-actions">
          <p><strong>{t.doYouWantToProceed}</strong></p>
          <p>{t.pushItemsDownMessage}</p>
        </div>
        
        <div className="form-actions">
          <button onClick={onCancel} className="cancel-button">
            {t.cancel}
          </button>
          <button onClick={onConfirm} className="confirm-button">
            {t.yesPushItemsDown}
          </button>
        </div>
      </div>
    </div>
  );
};