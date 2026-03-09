import { useState, useEffect } from 'react';

export function useChecklist(totalItems: number) {
  const [checkedItems, setCheckedItems] = useState<{ [key: number]: boolean }>({});
  
  // 1. Initial Load
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('career-checklist-v1');
      if (saved) {
        try {
          setCheckedItems(JSON.parse(saved));
        } catch (e) {
          console.error("Failed to parse checklist data", e);
        }
      }
    }
  }, []);

  const completed = Object.values(checkedItems).filter(Boolean).length;
  const progress = totalItems > 0 ? (completed / totalItems) * 100 : 0;

  const toggleItem = (id: number) => {
    const updated = {
      ...checkedItems,
      [id]: !checkedItems[id]
    };
    setCheckedItems(updated);
    localStorage.setItem('career-checklist-v1', JSON.stringify(updated));
  };

  return { checkedItems, progress, toggleItem };
}
