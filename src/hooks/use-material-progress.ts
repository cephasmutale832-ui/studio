'use client';

import { useState, useEffect, useCallback } from 'react';

type ProgressStore = {
  [materialId: string]: number;
};

const getProgressStore = (): ProgressStore => {
  if (typeof window === 'undefined') {
    return {};
  }
  try {
    const item = window.localStorage.getItem('materialProgress');
    return item ? JSON.parse(item) : {};
  } catch (error) {
    console.warn('Error reading localStorage "materialProgress":', error);
    return {};
  }
};

const setProgressStore = (store: ProgressStore) => {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem('materialProgress', JSON.stringify(store));
    // Dispatch a custom event to notify other components on the same page
    window.dispatchEvent(new Event('progress-update'));
  } catch (error) {
    console.warn('Error setting localStorage "materialProgress":', error);
  }
};

export function useMaterialProgress(materialId: string) {
  const [progress, setProgress] = useState(() => {
    if (!materialId) return 0;
    const store = getProgressStore();
    return store[materialId] || 0;
  });

  useEffect(() => {
    if (!materialId) return;

    const handleStorageUpdate = () => {
      const store = getProgressStore();
      setProgress(store[materialId] || 0);
    };

    // Listen for custom event from the same page
    window.addEventListener('progress-update', handleStorageUpdate);
    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageUpdate);
    
    // Initial sync
    handleStorageUpdate();

    return () => {
      window.removeEventListener('progress-update', handleStorageUpdate);
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [materialId]);

  const updateProgress = useCallback((newProgress: number | ((prevProgress: number) => number)) => {
    if (!materialId) return;
    
    const store = getProgressStore();
    const currentProgress = store[materialId] || 0;
    const resolvedProgress = typeof newProgress === 'function' ? newProgress(currentProgress) : newProgress;
    const cappedProgress = Math.min(100, Math.max(0, resolvedProgress));
    
    if (store[materialId] !== cappedProgress) {
        store[materialId] = cappedProgress;
        setProgressStore(store);
        setProgress(cappedProgress); // Eagerly update state for the component that initiated the change
    }
  }, [materialId]);

  return { progress, updateProgress };
}
