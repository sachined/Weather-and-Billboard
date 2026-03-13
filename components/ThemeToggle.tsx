import { useEffect, useState } from 'react';
import React from 'react';
import styles from './ThemeToggle.module.css';

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
    <div className={styles.container}>
      <button onClick={toggleTheme} className={styles.button} title="Click to toggle between Spring, Midnight, and Minimalist themes">
        {getThemeLabel()}
      </button>
      <span className={styles.label}>
        Easy Theme Toggle
      </span>
    </div>
  );
}
