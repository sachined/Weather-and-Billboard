import React from 'react';
import { RoleInfo } from '@/lib/roles';
import styles from './RoleDetails.module.css';

export default function RoleDetails({ role }: { role: RoleInfo }) {
  return (
    <div className={styles.container}>
      <h2 className={styles.title}>{role.title}</h2>
      <p className={styles.fit}>{role.fit}</p>

      <h4 className={styles.sectionTitle}>Core Competencies</h4>
      <div className={styles.skillsGrid}>
        {role.skills.map((skill) => (
          <div key={skill.name} className={styles.skillCard}>
            <div className={styles.skillHeader}>
              <span className={styles.skillName}>{skill.name}</span>
              <span className={`${styles.proficiency} ${styles[skill.proficiency.toLowerCase()]}`}>
                {skill.proficiency}
              </span>
            </div>
            <p className={styles.skillProof}>{skill.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}