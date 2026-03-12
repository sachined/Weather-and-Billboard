import React from 'react';
import styles from './Weather.module.css';

interface SearchHistoryProps {
  history: string[];
  onCityClick: (city: string) => void;
  onRemove: (city: string) => void;
}

export default function SearchHistory({ history, onCityClick, onRemove }: SearchHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className={styles.historyWrapper}>
      <span className={styles.historyLabel}>Recent:</span>
      <div className={styles.chipsContainer}>
        {history.map((hCity) => (
          <div key={hCity} className={styles.chipWrapper}>
            <button onClick={() => onCityClick(hCity)} className={styles.chip}>
              {hCity}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); onRemove(hCity); }}
              className={styles.deleteButton}
            >
              ×
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}