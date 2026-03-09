import React from 'react';

interface ArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ArchitectureModal({ isOpen, onClose }: ArchitectureModalProps) {
  if (!isOpen) return null;

  return (
    <div style={overlayStyle} onClick={onClose}>
      <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
        <div style={headerStyle}>
          <h2 style={{ margin: 0 }}>System Architecture</h2>
          <button onClick={onClose} style={closeButtonStyle}>×</button>
        </div>
        <div style={contentStyle}>
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Frontend (Next.js + TypeScript)</h3>
            <p>React-based UI with modular components and custom hooks for weather and portfolio logic.</p>
          </div>
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>State Management</h3>
            <p>React State + LocalStorage for persistent user data (resumes, checklist, portfolio positions).</p>
          </div>
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Data Visualization</h3>
            <p>Chart.js for real-time portfolio performance tracking and career roadmap analysis.</p>
          </div>
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>API Layer (Next.js API Routes)</h3>
            <p>Server-side integration with Yahoo Finance (stock data) and external weather services.</p>
          </div>
          <div style={sectionStyle}>
            <h3 style={sectionTitleStyle}>Styling</h3>
            <p>CSS Modules + Global CSS variables for a theme-able Midnight Slate / Minimalist interface.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

const overlayStyle: React.CSSProperties = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.7)',
  backdropFilter: 'blur(8px)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
  padding: '1rem'
};

const modalStyle: React.CSSProperties = {
  backgroundColor: 'var(--bg-surface)',
  borderRadius: '24px',
  padding: '2rem',
  maxWidth: '600px',
  width: '100%',
  maxHeight: '90vh',
  overflowY: 'auto',
  border: '1px solid var(--border-subtle)',
  boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
};

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem',
  color: 'var(--text-main)'
};

const closeButtonStyle: React.CSSProperties = {
  background: 'none',
  border: 'none',
  fontSize: '2rem',
  color: 'var(--text-muted)',
  cursor: 'pointer',
  padding: '0.5rem'
};

const contentStyle: React.CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '1.5rem'
};

const sectionStyle: React.CSSProperties = {
  padding: '1.2rem',
  backgroundColor: 'var(--bg-surface-hover)',
  borderRadius: '16px',
  border: '1px solid var(--border-subtle)'
};

const sectionTitleStyle: React.CSSProperties = {
  margin: '0 0 0.5rem 0',
  fontSize: '1.1rem',
  color: 'var(--accent-primary)',
  fontWeight: '700'
};
