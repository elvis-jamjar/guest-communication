"use client";

import { useCallback, useRef, useState } from "react";

const MAX_HISTORY = 50;
const DEBOUNCE_MS = 400;

function deepEqual(a: unknown, b: unknown): boolean {
  if (a === b) return true;
  try {
    return JSON.stringify(a) === JSON.stringify(b);
  } catch {
    return false;
  }
}

function deepClone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value));
}

export interface UseUndoRedoReturn<T> {
  value: T;
  set: (value: T | ((prev: T) => T)) => void;
  undo: () => void;
  redo: () => void;
  reset: (value: T) => void;
  canUndo: boolean;
  canRedo: boolean;
}

/**
 * Hook for undo/redo with debounced history to avoid excessive entries during rapid edits.
 */
export function useUndoRedo<T>(initialValue: T): UseUndoRedoReturn<T> {
  const [state, setState] = useState<{
    past: T[];
    present: T;
    future: T[];
  }>({
    past: [],
    present: deepClone(initialValue),
    future: [],
  });

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const pendingPastRef = useRef<T | null>(null);

  const flushPendingToPast = useCallback(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
    const pending = pendingPastRef.current;
    pendingPastRef.current = null;
    return pending;
  }, []);

  const set = useCallback(
    (valueOrUpdater: T | ((prev: T) => T)) => {
      setState((prev) => {
        const newValue =
          typeof valueOrUpdater === "function"
            ? (valueOrUpdater as (p: T) => T)(prev.present)
            : valueOrUpdater;

        if (deepEqual(prev.present, newValue)) return prev;

        // Clear redo stack on new change
        const newFuture: T[] = [];

        // Debounce: schedule adding current present to past
        if (debounceRef.current) {
          clearTimeout(debounceRef.current);
        }

        const previousPresent = prev.present;
        pendingPastRef.current = previousPresent;

        debounceRef.current = setTimeout(() => {
          debounceRef.current = null;
          const toPush = pendingPastRef.current;
          pendingPastRef.current = null;
          if (toPush !== null) {
            setState((p) => {
              if (deepEqual(toPush, p.present)) return p;
              const newPast = [...p.past, toPush].slice(-MAX_HISTORY);
              return { ...p, past: newPast };
            });
          }
        }, DEBOUNCE_MS);

        return {
          past: prev.past,
          present: deepClone(newValue),
          future: newFuture,
        };
      });
    },
    []
  );

  const undo = useCallback(() => {
    const pending = flushPendingToPast();
    setState((prev) => {
      let past = prev.past;
      if (pending !== null && !deepEqual(pending, prev.present)) {
        past = [...past, pending].slice(-MAX_HISTORY);
      }
      if (past.length === 0) return prev;
      const previous = past[past.length - 1];
      const newPast = past.slice(0, -1);
      return {
        past: newPast,
        present: deepClone(previous),
        future: [prev.present, ...prev.future].slice(0, MAX_HISTORY),
      };
    });
  }, [flushPendingToPast]);

  const redo = useCallback(() => {
    flushPendingToPast();
    setState((prev) => {
      if (prev.future.length === 0) return prev;
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        past: [...prev.past, prev.present].slice(-MAX_HISTORY),
        present: deepClone(next),
        future: newFuture,
      };
    });
  }, [flushPendingToPast]);

  const reset = useCallback((newValue: T) => {
    flushPendingToPast();
    setState({
      past: [],
      present: deepClone(newValue),
      future: [],
    });
  }, [flushPendingToPast]);

  return {
    value: state.present,
    set,
    undo,
    redo,
    reset,
    canUndo: state.past.length > 0,
    canRedo: state.future.length > 0,
  };
}
