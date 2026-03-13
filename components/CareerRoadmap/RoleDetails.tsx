import React from 'react';
import { RoleInfo, CHART_LABELS } from '@/lib/roles';
import RadarChart from './RadarChart';
import { useTheme } from '@/hooks/useTheme';
import styles from './RoleDetails.module.css'

export default function RoleDetails({ role }: { role: RoleInfo }) {
  const theme = useTheme();
  const isMinimalist = theme === 'light';
  const MINIMALIST_LABELS = [
  ['Tech', 'Skills'],
  ['Client', 'Strategy'],
  ['Data', 'Impact'],
  ['Ops', 'Flow']
];

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{role.title}</h2>
      <div className={styles.skillsMatchContainer}>
        <h4 className={styles.skillsMatchTitle}>Core Skills Match:</h4>
        <div className={styles.skillsList}>
          {role.skills.map((skill, index) => (
            <span key={skill.name} className={styles.skillTag} title={skill.description} style={{
                backgroundColor: (index % 2 === 0 ? 'var(--tag-bg-1)' : 'var(--tag-bg-2)'),
                cursor: 'help',
              }}
            >
              {skill.name}
            </span>
          ))}
        </div>
          <div style={{ marginTop: '1rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            {
                role.skills.map((skill) => (
                    <div key={skill.name} style={{ marginBottom: '0.4rem' }}>
                    <strong>{skill.name}:</strong> {skill.description}
                    </div>
                    )
                )
            }
          </div>

      </div>
      <RadarChart role={role} labels={isMinimalist ? MINIMALIST_LABELS : CHART_LABELS}
 />

      <div className={styles.insight}>
        <h4 className={styles.takeawaysTitle}>Key Takeaways:</h4>
        <ul className={styles.takeawaysList}>
          {role.chartDescription.split('. ').map((sentence, i) => (
              <li key={i} className={styles.takeawaysItem}>{sentence}</li>
          ))}
        </ul>
      </div>

      <div className={styles.legendGrid}>
        <div className={styles.legendItem}>
          <strong className={styles.legendLabel}>
            {isMinimalist ? 'Tech Skills' : 'Technical Proficiency:'}
          </strong> {role.legendDetails.technical}
        </div>
        <div className={styles.legendItem}>
          <strong className={styles.legendLabel}>
            {isMinimalist ? 'Client Strategy' : 'Stakeholder Strategy:'}
          </strong> {role.legendDetails.stakeholder}
        </div>
        <div className={styles.legendItem}>
          <strong className={styles.legendLabel}>
            {isMinimalist ? 'Data Impact' : 'Analytical Impact:'}
          </strong> {role.legendDetails.analytical}
        </div>
        <div className={styles.legendItem}>
          <strong className={styles.legendLabel}>
            {isMinimalist ? 'Project Management' : 'Operational Excellence:'}
          </strong> {role.legendDetails.operational}
        </div>
      </div>
    </div>
  );
}

// Styles have been moved to RoleDetails.module.css