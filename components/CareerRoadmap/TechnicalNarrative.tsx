import React, { useState } from 'react';

export default function TechnicalNarrative() {
  const [showFullAnswer, setShowFullAnswer] = useState(false);

  return (
    <div style={containerStyle}>
      <h2 style={{ marginTop: 0, color: 'var(--text-main)' }}>Technical Evolution & Narrative</h2>
      <div style={gridStyle}>
        <div style={pivotCardStyle}>
          <h3 style={{ color: 'var(--accent-primary)', marginTop: 0 }}>Professional Pivot</h3>
          <p style={{ color: 'var(--text-main)', fontSize: '0.95rem', lineHeight: '1.6' }}>
            <strong style={{ color: 'var(--accent-primary)' }}>Focus:</strong> Scaling Technical Impact
          </p>
          <div style={quoteContainerStyle}>
            <p style={quoteStyle}>
              "Over the past year, I have dedicated myself to deep-skilling in modern technical domains. 
              I've mastered Next.js, Python for data analysis, and advanced SQL to bridge the gap between 
              business strategy and technical execution. My recent project, <a href="https://finsurf.net" target="_blank" rel="noopener noreferrer" style={linkStyle}>Finsurf.net</a>, 
              showcases this evolution—transforming complex data into actionable financial insights through AI."
            </p>
            {showFullAnswer && (
              <div style={{ marginTop: '1rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
                <p style={{ ...quoteStyle, marginBottom: '1rem' }}>
                  "This transition isn't just about learning new tools; it's about applying my years of 
                  Implementation Engineering and Customer Success experience to build more robust, 
                  user-centric technical solutions."
                </p>
                <p style={{ color: 'var(--text-main)', fontSize: '0.9rem', lineHeight: '1.6' }}>
                  By combining my background in <strong>Customer Success</strong> with modern <strong>SaaS architecture</strong>, 
                  I focus on:
                </p>
                <ul style={{ color: 'var(--text-muted)', fontSize: '0.85rem', paddingLeft: '1.2rem', marginTop: '0.5rem' }}>
                  <li>Automating ROI tracking via custom Python scripts and SQL views.</li>
                  <li>Designing intuitive user journeys that reduce technical friction.</li>
                  <li>Leading cross-functional teams to align technical roadmaps with business objectives.</li>
                </ul>
              </div>
            )}
            <button 
              onClick={() => setShowFullAnswer(!showFullAnswer)}
              aria-expanded={showFullAnswer}
              style={toggleButtonStyle}
            >
              {showFullAnswer ? 'Show Less ↑' : 'Show More Details ↓'}
            </button>
          </div>
        </div>

        <div style={competenciesCardStyle}>
          <h3 style={{ color: 'var(--accent-secondary)', marginTop: 0 }}>Core Competencies</h3>
          <div style={{ marginTop: '1rem' }}>
            {[
              { label: 'Technical Implementation', score: 85, description: 'Proficiency in Next.js, Python, and SQL for building production-grade tools.' },
              { label: 'Strategic Analysis', score: 90, description: 'Proven ability to interpret SaaS metrics and drive business growth through data.' },
              { label: 'Solution Architecture', score: 80, description: 'Designing scalable, user-centric solutions to bridge the gap between tech and business.' }
            ].map(skill => (
              <div key={skill.label} style={{ marginBottom: '1.2rem' }}>
                <div style={skillHeaderStyle}>
                  <span style={{ fontWeight: '600', color: 'var(--text-main)' }}>{skill.label}</span>
                  <span style={{ color: 'var(--accent-secondary)', fontWeight: 'bold' }}>{skill.score}%</span>
                </div>
                <div 
                  role="progressbar"
                  aria-valuenow={skill.score}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={skill.label}
                  style={progressBarStyle}
                >
                  <div style={{ width: `${skill.score}%`, height: '100%', backgroundColor: 'var(--accent-secondary)', borderRadius: '5px' }}></div>
                </div>
                <p style={skillDescriptionStyle}>{skill.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface)',
  padding: '2rem',
  borderRadius: '16px',
  border: '1px solid var(--border-subtle)'
};

const gridStyle: React.CSSProperties = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))',
  gap: '2rem',
  marginTop: '1.5rem',
  alignItems: 'stretch'
};

const pivotCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface-hover)',
  padding: '1.5rem',
  borderRadius: '12px',
  border: '1px solid var(--border-subtle)'
};

const quoteContainerStyle: React.CSSProperties = {
  borderLeft: '3px solid var(--accent-primary)',
  paddingLeft: '1rem',
  marginTop: '1rem'
};

const quoteStyle: React.CSSProperties = {
  fontStyle: 'italic',
  color: 'var(--text-main)',
  margin: 0
};

const linkStyle: React.CSSProperties = {
  color: 'var(--accent-primary)',
  fontWeight: 'bold',
  textDecoration: 'underline'
};

const toggleButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  color: 'var(--accent-primary)',
  cursor: 'pointer',
  padding: 0,
  marginTop: '0.5rem',
  fontWeight: 'bold'
};

const competenciesCardStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface-hover)',
  padding: '1.5rem',
  borderRadius: '12px',
  border: '1px solid var(--border-subtle)'
};

const skillHeaderStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  marginBottom: '0.5rem',
  fontSize: '0.95rem'
};

const progressBarStyle: React.CSSProperties = {
  width: '100%',
  height: '10px',
  backgroundColor: 'var(--bg-surface)',
  borderRadius: '5px',
  border: '1px solid var(--border-subtle)'
};

const skillDescriptionStyle: React.CSSProperties = {
  margin: '0.6rem 0 0 0',
  fontSize: '0.8rem',
  color: 'var(--text-muted)',
  lineHeight: '1.4'
};
