import { useState, useEffect } from 'react';

export function useTheme() {
  const [theme, setTheme] = useState('spring');

  useEffect(() => {
    // Initial sync
    const currentTheme = document.documentElement.getAttribute('data-theme') || 'spring';
    setTheme(currentTheme);

    // Observe changes
    const observer = new MutationObserver(() => {
      const updatedTheme = document.documentElement.getAttribute('data-theme') || 'spring';
      setTheme(updatedTheme);
    });

    observer.observe(document.documentElement, { 
      attributes: true, 
      attributeFilter: ['data-theme'] 
    });

    return () => observer.disconnect();
  }, []);

  return theme;
}
