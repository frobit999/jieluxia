"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { todayKey } from "@/lib/habits";

export interface CheckinEntry {
  id: number;
  habit_id: string;
  value: number;
  note?: string;
  checked_at: string;
}

interface DailyRecord {
  date: string;
  count: number;
}

interface GoalRecord {
  habit_id: string;
  target: number;
}

export function useHabits(isAuthed: boolean) {
  const [entries, setEntries] = useState<CheckinEntry[]>([]);
  const [history, setHistory] = useState<Map<string, number>>(new Map());
  const [streak, setStreak] = useState(0);
  const [loading, setLoading] = useState(true);
  const [userGoals, setUserGoals] = useState<Map<string, number>>(new Map());

  const habitValues = useMemo(() => {
    const map = new Map<string, number>();
    for (const e of entries) {
      map.set(e.habit_id, (map.get(e.habit_id) ?? 0) + e.value);
    }
    return map;
  }, [entries]);

  const entriesByHabit = useMemo(() => {
    const map = new Map<string, CheckinEntry[]>();
    for (const e of entries) {
      const arr = map.get(e.habit_id) ?? [];
      arr.push(e);
      map.set(e.habit_id, arr);
    }
    return map;
  }, [entries]);

  const loadAllData = useCallback(async () => {
    if (!isAuthed) return;

    const fetchCheckins = async () => {
      try {
        const data = await apiGet<CheckinEntry[]>(`/api/habits/checkins?date=${todayKey()}`);
        setEntries(data);
      } catch (e) {
        console.error("fetchCheckins failed:", e);
      }
    };

    const fetchGoals = async () => {
      try {
        const data = await apiGet<GoalRecord[]>("/api/habits/goals");
        const map = new Map<string, number>();
        for (const r of data) map.set(r.habit_id, r.target);
        setUserGoals(map);
      } catch (e) {
        console.error("fetchGoals failed:", e);
      }
    };

    const fetchHistory = async () => {
      try {
        const data = await apiGet<DailyRecord[]>("/api/habits/history");
        const histMap = new Map<string, number>();
        const sorted = [...data].sort((a, b) => b.date.localeCompare(a.date));
        for (const rec of sorted) histMap.set(rec.date, rec.count);
        const now = new Date();
        let s = 0;
        for (let i = 0; i < 365; i++) {
          const d = new Date(now);
          d.setDate(d.getDate() - i);
          const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
          if (histMap.has(key) && histMap.get(key)! > 0) s++;
          else if (i > 0) break;
        }
        setHistory(histMap);
        setStreak(s);
      } catch (e) {
        console.error("fetchHistory failed:", e);
      }
    };

    await Promise.allSettled([fetchCheckins(), fetchGoals(), fetchHistory()]);
  }, [isAuthed]);

  useEffect(() => {
    if (!isAuthed) {
      setLoading(false);
      return;
    }
    loadAllData().finally(() => setLoading(false));
  }, [isAuthed, loadAllData]);

  const updateHabit = useCallback(
    async (habitId: string, value: number, note?: string) => {
      try {
        const result = await apiPost<{ ok: boolean; id: number }>("/api/habits/checkins", {
          habit_id: habitId,
          value,
          date: todayKey(),
          note: note || undefined,
        });
        const newEntry: CheckinEntry = {
          id: result.id,
          habit_id: habitId,
          value,
          note: note || undefined,
          checked_at: new Date().toISOString(),
        };
        setEntries((prev) => [...prev, newEntry]);
        return result.id;
      } catch {
        loadAllData();
        throw new Error("打卡失败");
      }
    },
    [loadAllData],
  );

  const deleteEntry = useCallback(
    async (id: number) => {
      setEntries((prev) => prev.filter((e) => e.id !== id));
      try {
        await apiDelete("/api/habits/checkins", { id });
      } catch {
        loadAllData();
      }
    },
    [loadAllData],
  );

  const saveGoals = useCallback(async (goals: Record<string, number>) => {
    await apiPut("/api/habits/goals", { goals });
    const map = new Map<string, number>();
    for (const [k, v] of Object.entries(goals)) map.set(k, v);
    setUserGoals(map);
  }, []);

  const updateNote = useCallback(
    async (id: number, note: string) => {
      setEntries((prev) => prev.map((e) => (e.id === id ? { ...e, note: note || undefined } : e)));
      try {
        await apiPut("/api/habits/checkins/note", { id, note });
      } catch {
        loadAllData();
      }
    },
    [loadAllData],
  );

  return { entries, entriesByHabit, habitValues, history, streak, loading, userGoals, saveGoals, updateHabit, deleteEntry, updateNote, reload: loadAllData };
}
