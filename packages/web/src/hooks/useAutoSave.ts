"use client";

import { useCallback, useEffect, useRef } from "react";

interface UseAutoSaveOptions<T> {
  data: T;
  onSave: (data: T) => Promise<void>;
  debounceMs?: number;
  enabled?: boolean;
}

export function useAutoSave<T>({
  data,
  onSave,
  debounceMs = 2000,
  enabled = true,
}: UseAutoSaveOptions<T>) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isSavingRef = useRef(false);
  const latestDataRef = useRef(data);
  const hasMountedRef = useRef(false);
  const onSaveRef = useRef(onSave);

  onSaveRef.current = onSave;
  latestDataRef.current = data;

  const save = useCallback(async () => {
    if (isSavingRef.current) return;
    isSavingRef.current = true;
    try {
      await onSaveRef.current(latestDataRef.current);
    } catch (err) {
      console.error("[useAutoSave] save failed:", err);
    } finally {
      isSavingRef.current = false;
    }
  }, []);

  const debouncedSave = useCallback(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(save, debounceMs);
  }, [save, debounceMs]);

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true;
      return;
    }
    if (!enabled) return;
    debouncedSave();
  }, [data, enabled, debouncedSave]);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  return { saveNow: save, isSaving: isSavingRef.current };
}
