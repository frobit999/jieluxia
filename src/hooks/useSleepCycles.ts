"use client";
import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPut } from "@/lib/api";
import { todayKey } from "@/lib/habits";

export interface SleepCycle {
  id: number;
  date: string;
  wake_time: string | null;
  sleep_time: string | null;
}

export function useSleepCycles(isAuthed: boolean) {
  const [cycles, setCycles] = useState<SleepCycle[]>([]);

  const loadCycles = useCallback(
    async (date?: string) => {
      if (!isAuthed) return;
      try {
        const d = date || todayKey();
        const data = await apiGet<SleepCycle[]>(`/api/habits/sleep-cycles?date=${d}`);
        setCycles(data);
      } catch (e) {
        console.error("loadCycles failed:", e);
      }
    },
    [isAuthed],
  );

  useEffect(() => {
    if (isAuthed) loadCycles();
  }, [isAuthed, loadCycles]);

  const isAwake = cycles.some((c) => c.wake_time != null && c.sleep_time == null);

  const tapWake = useCallback(
    async (wakeTime?: string) => {
      const time = wakeTime || new Date().toTimeString().slice(0, 5);
      const date = todayKey();
      const result = await apiPost<{ id: number; merged?: boolean }>("/api/habits/sleep-cycles", { date, wake_time: time });
      setCycles((prev) => {
        if (result.merged) {
          return prev.map((c) => (c.id === result.id ? { ...c, wake_time: time } : c));
        }
        return [...prev, { id: result.id, date, wake_time: time, sleep_time: null }];
      });
      return result;
    },
    [],
  );

  const tapSleep = useCallback(
    async (sleepTime?: string) => {
      const time = sleepTime || new Date().toTimeString().slice(0, 5);
      const date = todayKey();
      const result = await apiPost<{ id: number; merged?: boolean }>("/api/habits/sleep-cycles", { date, sleep_time: time });
      setCycles((prev) => {
        if (result.merged) {
          return prev.map((c) => (c.id === result.id ? { ...c, sleep_time: time } : c));
        }
        return [...prev, { id: result.id, date, wake_time: null, sleep_time: time }];
      });
      return { ok: true };
    },
    [],
  );

  return { cycles, isAwake, loadCycles, tapWake, tapSleep };
}
