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
  } catch (error) {
    console.warn('Error setting localStorage "materialProgress":', error);
  }
};

export function useMaterialProgress(materialId: string) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const store = getProgressStore();
    setProgress(store[materialId] || 0);
  }, [materialId]);

  const updateProgress = useCallback((newProgress: number | ((prevProgress: number) => number)) => {
    const store = getProgressStore();
    const currentProgress = store[materialId] || 0;
    const resolvedProgress = typeof newProgress === 'function' ? newProgress(currentProgress) : newProgress;
    const cappedProgress = Math.min(100, Math.max(0, resolvedProgress));
    store[materialId] = cappedProgress;
    setProgressStore(store);
    setProgress(cappedProgress);
  }, [materialId]);

  return { progress, updateProgress };
}
