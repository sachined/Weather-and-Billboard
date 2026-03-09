// components/Portfolio/StrategySummary.tsx
import styles from '../../styles/Portfolio.module.css';
import { STRATEGY_METRICS } from '../../lib/portfolio-logic';
import { useState } from 'react';

export const StrategySummary = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.strategySummaryCompact}>
      <div className={styles.summaryHeaderCompact} onClick={() => setIsOpen(!isOpen)} style={{ cursor: 'pointer' }}>
        <div className={styles.summaryTitle}>
          <span className={styles.philosophyLabel}>{STRATEGY_METRICS.philosophy}</span>
          <span className={styles.objectiveLabel}>{STRATEGY_METRICS.objective}</span>
        </div>
        <button className={styles.toggleButton}>{isOpen ? 'Collapse Details' : 'View Strategy Details'}</button>
      </div>
      
      {isOpen && (
        <div className={styles.expandedDetails}>
          <div className={styles.metricsGridCompact}>
            {STRATEGY_METRICS.allocations.map((alloc) => (
              <div key={alloc.name} className={styles.metricItemCompact}>
                <span className={styles.metricNameSmall}>{alloc.name}</span>
                <span className={styles.metricTargetSmall}>{alloc.target}</span>
                <span className={styles.metricFocusSmall}>{alloc.focus}</span>
              </div>
            ))}
          </div>

          <div className={styles.rulesSectionSmall}>
            <h4>Execution Rules</h4>
            <ul>
              {STRATEGY_METRICS.rules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};
