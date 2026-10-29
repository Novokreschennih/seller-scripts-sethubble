import { useState, useEffect } from 'react';

export interface SavedScript {
  id: string;
  businessName: string;
  methodology: string;
  category: string;
  createdAt: Date;
  content: string;
  isFavorite: boolean;
}

const STORAGE_KEY = 'scriptforge_history';
const MAX_SCRIPTS = 50;

export function useScriptHistory() {
  const [scripts, setScripts] = useState<SavedScript[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((s: any) => ({
          ...s,
          createdAt: new Date(s.createdAt)
        }));
      }
    } catch (error) {
      console.error('Error loading script history:', error);
    }
    return [];
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(scripts));
    } catch (error) {
      console.error('Error saving script history:', error);
    }
  }, [scripts]);

  const saveScript = (script: Omit<SavedScript, 'id' | 'createdAt' | 'isFavorite'>) => {
    const newScript: SavedScript = {
      ...script,
      id: Date.now().toString(),
      createdAt: new Date(),
      isFavorite: false
    };

    setScripts(prev => {
      const updated = [newScript, ...prev];
      // Ограничиваем до MAX_SCRIPTS
      if (updated.length > MAX_SCRIPTS) {
        return updated.slice(0, MAX_SCRIPTS);
      }
      return updated;
    });

    return newScript;
  };

  const deleteScript = (id: string) => {
    setScripts(prev => prev.filter(s => s.id !== id));
  };

  const toggleFavorite = (id: string) => {
    setScripts(prev =>
      prev.map(s => s.id === id ? { ...s, isFavorite: !s.isFavorite } : s)
    );
  };

  const clearHistory = () => {
    if (confirm('Вы уверены, что хотите очистить всю историю?')) {
      setScripts([]);
    }
  };

  return {
    scripts,
    saveScript,
    deleteScript,
    toggleFavorite,
    clearHistory
  };
}
