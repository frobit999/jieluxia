"use client";
import { useState, useEffect, useCallback } from "react";
import { apiGet, apiPost, apiPut, apiDelete } from "@/lib/api";
import { CustomGoal, customGoalHabitId } from "@/lib/customGoals";

export function useCustomGoals(
  isAuthed: boolean,
  habitValues: Map<string, number>,
  updateHabit: (habitId: string, value: number) => Promise<number | undefined>,
) {
  const [customGoals, setCustomGoals] = useState<CustomGoal[]>([]);
  const [loading, setLoading] = useState(false);

  const loadGoals = useCallback(async () => {
    if (!isAuthed) return;
    setLoading(true);
    try {
      const data = await apiGet<CustomGoal[]>("/api/habits/custom-goals");
      setCustomGoals(data);
    } catch (e) {
      console.error("loadGoals failed:", e);
    } finally {
      setLoading(false);
    }
  }, [isAuthed]);

  useEffect(() => {
    if (!isAuthed) return;
    loadGoals();
  }, [isAuthed, loadGoals]);

  const createGoal = useCallback(
    async (data: {
      name: string;
      icon: string;
      color: string;
      daily_target: number;
      unit: string;
      deadline: string;
      category: string;
      goal_type: string;
    }) => {
      await apiPost("/api/habits/custom-goals", data);
      await loadGoals();
    },
    [loadGoals],
  );

  const updateGoal = useCallback(
    async (
      id: number,
      data: Partial<{
        name: string;
        icon: string;
        color: string;
        daily_target: number;
        unit: string;
        deadline: string;
        status: string;
        category: string;
        goal_type: string;
      }>,
    ) => {
      await apiPut("/api/habits/custom-goals", { id, ...data });
      await loadGoals();
    },
    [loadGoals],
  );

  const deleteGoal = useCallback(
    async (id: number) => {
      await apiDelete("/api/habits/custom-goals", { id });
      await loadGoals();
    },
    [loadGoals],
  );

  const checkInGoal = useCallback(
    async (goalId: number, value: number) => {
      await updateHabit(customGoalHabitId(goalId), value);
    },
    [updateHabit],
  );

  const getTodayValue = useCallback(
    (goalId: number) => {
      return habitValues.get(customGoalHabitId(goalId)) ?? 0;
    },
    [habitValues],
  );

  return { customGoals, loading, createGoal, updateGoal, deleteGoal, checkInGoal, getTodayValue, loadGoals };
}
