import React from 'react';

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
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h2 style={{ margin: 0, color: 'var(--text-main)' }}>Implementation Checklist</h2>
        <div style={{ textAlign: 'right' }}>
          <div style={progressTextStyle}>{Math.round(progress)}%</div>
          <div 
            role="progressbar"
            aria-valuenow={Math.round(progress)}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Checklist Progress"
            style={progressContainerStyle}
          >
            <div style={{ ...progressBarInnerStyle, width: `${progress}%` }}></div>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {items.map((item) => (
          <label 
            key={item.id} 
            style={{ 
              ...itemLabelStyle, 
              backgroundColor: checkedItems[item.id] ? 'var(--bg-surface-hover)' : 'var(--bg-surface)' 
            }}
          >
            <input 
              type="checkbox" 
              checked={checkedItems[item.id] || false}
              onChange={() => onToggle(item.id)}
              style={checkboxStyle}
            />
            <div>
              <h4 style={{ 
                margin: 0, 
                color: checkedItems[item.id] ? 'var(--text-muted)' : 'var(--text-main)', 
                textDecoration: checkedItems[item.id] ? 'line-through' : 'none' 
              }}>
                {item.title}
              </h4>
              <p style={{ ...itemDescriptionStyle, color: checkedItems[item.id] ? 'var(--text-muted)' : 'var(--text-muted)' }}>{item.description}</p>
            </div>
          </label>
        ))}
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

const headerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: '2rem'
};

const progressTextStyle: React.CSSProperties = {
  fontSize: '1.5rem',
  fontWeight: 'bold',
  color: 'var(--accent-primary)'
};

const progressContainerStyle: React.CSSProperties = {
  width: '150px',
  height: '10px',
  backgroundColor: 'var(--bg-surface-hover)',
  borderRadius: '5px',
  marginTop: '0.5rem',
  border: '1px solid var(--border-subtle)'
};

const progressBarInnerStyle: React.CSSProperties = {
  height: '100%',
  backgroundColor: 'var(--accent-primary)',
  borderRadius: '5px',
  transition: 'width 0.3s ease'
};

const itemLabelStyle: React.CSSProperties = {
  display: 'flex',
  gap: '1.5rem',
  padding: '1.2rem',
  borderRadius: '12px',
  border: '1px solid var(--border-subtle)',
  cursor: 'pointer',
  transition: 'background-color 0.2s'
};

const checkboxStyle: React.CSSProperties = {
  width: '20px',
  height: '20px',
  cursor: 'pointer',
  marginTop: '0.2rem',
  accentColor: 'var(--accent-primary)'
};

const itemDescriptionStyle: React.CSSProperties = {
  margin: '0.4rem 0 0 0',
  color: 'var(--text-muted)',
  fontSize: '0.9rem',
  lineHeight: '1.4'
};
