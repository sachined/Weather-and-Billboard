import React, { useState } from 'react';
import styles from './TechnicalNarrative.module.css';

export default function TechnicalNarrative() {
  const [showFullAnswer, setShowFullAnswer] = useState(false);

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Technical Evolution & Narrative</h2>
      <div className={styles.grid}>
        <div className={styles.card}>
          <h3 className={styles.pivotTitle}>Professional Pivot</h3>
          <p className={styles.focusText}>
            <strong className={styles.accent}>Focus:</strong> Scaling Technical Impact
          </p>
          <div className={styles.quoteContainer}>
            <p className={styles.quote}>
              "Over the past year, I have dedicated myself to deep-skilling in modern technical domains. 
              I've mastered Next.js, Python for data analysis, and advanced SQL to bridge the gap between 
              business strategy and technical execution. My recent project, <a href="https://finsurf.net" target="_blank" rel="noopener noreferrer" className={styles.link}>Finsurf.net</a>, 
              showcases this evolution—transforming complex data into actionable financial insights through AI."
            </p>
            {showFullAnswer && (
              <div className={styles.expandedContent}>
                <p className={styles.quote} style={{ marginBottom: '1rem' }}>
                  "This transition isn't just about learning new tools; it's about applying my years of 
                  Implementation Engineering and Customer Success experience to build more robust, 
                  user-centric technical solutions."
                </p>
                <p className={styles.focusText} style={{ fontSize: '0.9rem' }}>
                  By combining my background in <strong>Customer Success</strong> with modern <strong>SaaS architecture</strong>, 
                  I focus on:
                </p>
                <ul className={styles.descriptionList}>
                  <li>Automating ROI tracking via custom Python scripts and SQL views.</li>
                  <li>Designing intuitive user journeys that reduce technical friction.</li>
                  <li>Leading cross-functional teams to align technical roadmaps with business objectives.</li>
                </ul>
              </div>
            )}
            <button 
              onClick={() => setShowFullAnswer(!showFullAnswer)}
              aria-expanded={showFullAnswer}
              className={styles.toggleButton}
            >
              {showFullAnswer ? 'Show Less ↑' : 'Show More Details ↓'}
            </button>
          </div>
        </div>

        <div className={styles.card}>
          <h3 className={styles.competenciesTitle}>Core Competencies</h3>
          <div style={{ marginTop: '1rem' }}>
            {[
              { label: 'Technical Implementation', score: 85, description: 'Proficiency in Next.js, Python, and SQL for building production-grade tools.' },
              { label: 'Strategic Analysis', score: 90, description: 'Proven ability to interpret SaaS metrics and drive business growth through data.' },
              { label: 'Solution Architecture', score: 80, description: 'Designing scalable, user-centric solutions to bridge the gap between tech and business.' }
            ].map(skill => (
              <div key={skill.label} className={styles.skillContainer}>
                <div className={styles.skillHeader}>
                  <span className={styles.skillLabel}>{skill.label}</span>
                  <span className={styles.skillScore}>{skill.score}%</span>
                </div>
                <div 
                  role="progressbar"
                  aria-valuenow={skill.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={skill.label}
                  className={styles.progressBar}
                >
                  <div className={styles.progressFill} style={{ width: `${skill.score}%` }}></div>
                </div>
                <p className={styles.skillDescription}>{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
