import React from 'react';
import { RoleInfo, CHART_LABELS } from '../../lib/roles';
import RadarChart from './RadarChart';

export default function RoleDetails({ role }: { role: RoleInfo }) {
  return (
    <div style={containerStyle}>
      <h2 style={{ color: 'var(--accent-primary)', marginTop: 0 }}>{role.title}</h2>
      <div style={{ marginBottom: '1.5rem' }}>
        <h4 style={{ color: 'var(--text-main)', marginBottom: '0.5rem' }}>Core Skills Match:</h4>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {role.skills.map((skill) => (
            <span key={skill} style={tagStyle}>
              {skill}
            </span>
          ))}
        </div>
      </div>
      <RadarChart role={role} labels={CHART_LABELS} />
      <div style={insightStyle}>
        <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '0.9rem', color: 'var(--text-main)' }}>Chart Insights:</h4>
        <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)', lineHeight: '1.6' }}>
          {role.chartDescription}
        </p>
      </div>
      <div style={legendGridStyle}>
        <div style={legendItemStyle}>
          <strong style={{ color: 'var(--text-main)' }}>Technical Proficiency:</strong> Python, SQL, Next.js
        </div>
        <div style={legendItemStyle}>
          <strong style={{ color: 'var(--text-main)' }}>Stakeholder Strategy:</strong> Cross-functional communication
        </div>
        <div style={legendItemStyle}>
          <strong style={{ color: 'var(--text-main)' }}>Analytical Impact:</strong> Data-driven ROI tracking
        </div>
        <div style={legendItemStyle}>
          <strong style={{ color: 'var(--text-main)' }}>Operational Excellence:</strong> Project lifecycle management
        </div>
      </div>
    </div>
  );
}

const containerStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface)',
  padding: '2rem',
  borderRadius: '16px',
  border: '1px solid var(--border-subtle)',
  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
};

const tagStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface-hover)',
  color: 'var(--text-main)',
  padding: '0.4rem 0.8rem',
  borderRadius: '20px',
  fontSize: '0.85rem',
  border: '1px solid var(--border-subtle)'
};

const insightStyle: React.CSSProperties = {
  marginTop: '1.5rem',
  padding: '1rem',
  backgroundColor: 'var(--bg-surface-hover)',
  borderRadius: '12px',
  border: '1px solid var(--border-subtle)'
};

const legendGridStyle: React.CSSProperties = {
  marginTop: '1rem',
  display: 'grid',
  gridTemplateColumns: '1fr 1fr',
  gap: '1rem'
};

const legendItemStyle: React.CSSProperties = {
  fontSize: '0.75rem',
  color: 'var(--text-muted)'
};
