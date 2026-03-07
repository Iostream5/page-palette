import { useState, useCallback } from 'react';

export function useHistory<T>(initialState: T) {
  const [index, setIndex] = useState(0);
  const [history, setHistory] = useState<T[]>([initialState]);

  const setState = useCallback((newState: T | ((prev: T) => T)) => {
    setHistory(prev => {
      const current = prev[index];
      const resolvedNewState = typeof newState === 'function' ? (newState as any)(current) : newState;

      // Don't add to history if state hasn't changed
      if (JSON.stringify(resolvedNewState) === JSON.stringify(current)) {
        return prev;
      }

      const newHistory = prev.slice(0, index + 1);
      newHistory.push(resolvedNewState);

      // Limit history size to 50
      if (newHistory.length > 50) {
        newHistory.shift();
      } else {
        setIndex(newHistory.length - 1);
      }

      return newHistory;
    });
  }, [index]);

  const undo = useCallback(() => {
    if (index > 0) {
      setIndex(prev => prev - 1);
    }
  }, [index]);

  const redo = useCallback(() => {
    if (index < history.length - 1) {
      setIndex(prev => prev + 1);
    }
  }, [index, history.length]);

  return {
    state: history[index],
    setState,
    undo,
    redo,
    canUndo: index > 0,
    canRedo: index < history.length - 1,
    history,
    reset: (newState: T) => {
      setIndex(0);
      setHistory([newState]);
    }
  };
}
