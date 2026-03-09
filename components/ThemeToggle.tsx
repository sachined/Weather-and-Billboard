import { useEffect, useState } from 'react';
import React from 'react';

export default function ThemeToggle() {
  const [theme, setTheme] = useState('spring');

  // Check localStorage on load so the user's choice "sticks"
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'spring';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);
  }, []);

  const toggleTheme = () => {
    let newTheme;
    if (theme === 'spring') newTheme = 'dark';
    else if (theme === 'dark') newTheme = 'light';
    else newTheme = 'spring';

    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const getThemeLabel = () => {
    if (theme === 'spring') return '🌸 Spring';
    if (theme === 'dark') return '🌌 Midnight';
    return '✨ Minimalist';
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '4px' }}>
      <button onClick={toggleTheme} style={buttonStyle} title="Click to toggle between Spring, Midnight, and Minimalist themes">
        {getThemeLabel()}
      </button>
      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>
        Easy Theme Toggle
      </span>
    </div>
  );
}

const buttonStyle = {
  padding: '10px 20px',
  borderRadius: '20px',
  border: 'none',
  cursor: 'pointer',
  fontWeight: 'bold' as const,
  backgroundColor: 'var(--nav-bg)',
  color: 'var(--text-main)',
  backdropFilter: 'blur(5px)'
};
