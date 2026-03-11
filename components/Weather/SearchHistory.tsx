import React from 'react';
import styles from './Weather.module.css';

interface SearchHistoryProps {
  history: string[];
  onCityClick: (city: string) => void;
}

export default function SearchHistory({ history, onCityClick }: SearchHistoryProps) {
  if (history.length === 0) return null;

  return (
    <div className={styles.historyWrapper}>
      <span className={styles.historyLabel}>Recent:</span>
      <div className={styles.chipsContainer}>
        {history.map((hCity) => (
          <button
            key={hCity}
            onClick={() => onCityClick(hCity)}
            className={styles.chip}
          >
            {hCity}
          </button>
        ))}
      </div>
    </div>
  );
}