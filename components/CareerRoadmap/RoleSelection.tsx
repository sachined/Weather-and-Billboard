import React from 'react';
import { RolesData } from '@/lib/roles';
import {useTheme} from "@/hooks/useTheme";
import styles from './RoleSelection.module.css';

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
  const theme = useTheme();
  const isMinimalist = theme === 'light';
  const isSpring = theme === 'spring';

  return (
    <div className={styles.container}>
      {roleOrder.map((key) => {
        const role = roles[key];
        const isSelected = selectedRole === key;

        return (
          <button
            key={key}
            onClick={() => onSelectRole(key)}
            aria-pressed={isSelected}
            className={`
              ${styles.roleButton} 
              ${isSelected ? styles.selected : ''} 
              ${isMinimalist ? styles.minimalist : ''}
            `}
          >
            <div className={styles.header}>
              <h3 className={styles.title}>{role.title}</h3>
              <span className={`
                ${styles.badge} 
                ${isSelected ? styles.badgeSelected : ''} 
                ${isSpring ? styles.badgeSpring : ''}
              `}>
                {role.badge}
              </span>
            </div>
            <p className={styles.description}>{role.fit}</p>
          </button>
        );
      })}
    </div>
  );
}
