import React from 'react';
import { RolesData } from '../../lib/roles';

interface RoleSelectionProps {
  roles: RolesData;
  roleOrder: string[];
  selectedRole: string;
  onSelectRole: (key: string) => void;
}

export default function RoleSelection({ 
  roles, 
  roleOrder, 
  selectedRole, 
  onSelectRole 
}: RoleSelectionProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      {roleOrder.map((key) => {
        const role = roles[key];
        const isSelected = selectedRole === key;
        return (
          <button
            key={key}
            onClick={() => onSelectRole(key)}
            aria-pressed={isSelected}
            style={{
              textAlign: 'left',
              backgroundColor: isSelected ? 'var(--bg-surface-hover)' : 'var(--bg-surface)',
              padding: '1.2rem',
              borderRadius: '12px',
              border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-subtle)',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              width: '100%',
              boxShadow: isSelected ? '0 10px 15px -3px rgba(0, 0, 0, 0.1)' : 'none'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h3 style={{ margin: 0, color: 'var(--text-main)', fontSize: '1.1rem', fontWeight: '700' }}>{role.title}</h3>
              <span style={{ 
                fontSize: '0.75rem', 
                backgroundColor: isSelected ? 'var(--accent-primary)' : 'var(--bg-surface-hover)', 
                color: isSelected ? '#fff' : 'var(--accent-primary)', 
                padding: '0.2rem 0.6rem', 
                borderRadius: '6px', 
                fontWeight: '700' 
              }}>
                {role.badge}
              </span>
            </div>
            <p style={{ margin: 0, fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5' }}>{role.fit}</p>
          </button>
        );
      })}
    </div>
  );
}
