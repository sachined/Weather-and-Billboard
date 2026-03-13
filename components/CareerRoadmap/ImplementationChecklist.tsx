import React from 'react';
import styles from './ImplementationChecklist.module.css';

interface ChecklistItem {
  id: number;
  title: string;
  description: string;
}

interface ImplementationChecklistProps {
  items: ChecklistItem[];
  checkedItems: { [key: number]: boolean };
  progress: number;
  onToggle: (id: number) => void;
}

export default function ImplementationChecklist({ 
  items, 
  checkedItems, 
  progress, 
  onToggle 
}: ImplementationChecklistProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.title}>Implementation Checklist</h2>
        <div className={styles.progressContainer}>
          <div className={styles.progressText}>{Math.round(progress)}%</div>
          <div 
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Checklist Progress"
            className={styles.progressBar}
          >
            <div className={styles.progressBarFill} style={{ width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div className={styles.itemsList}>
        {items.map((item) => (
          <label 
            key={item.id} 
            className={`${styles.itemLabel} ${checkedItems[item.id] ? styles.itemLabelChecked : ''}`}
          >
            <input 
              type="checkbox" 
              checked={checkedItems[item.id] || false}
              onChange={() => onToggle(item.id)}
              className={styles.checkbox}
            />
            <div>
              <h4 className={`${styles.itemTitle} ${checkedItems[item.id] ? styles.itemTitleChecked : ''}`}>
                {item.title}
              </h4>
              <p className={`${styles.itemDescription} ${checkedItems[item.id] ? styles.itemDescriptionChecked : ''}`}>
                {item.description}
              </p>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}
