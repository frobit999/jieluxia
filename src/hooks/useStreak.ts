"use client";

import useSWR from "swr";
import { apiGet } from "@/lib/api";

export function useStreak() {
  const { data, error, isLoading, mutate } = useSWR<{
    current: number;
    longest: number;
  }>("/api/streak", apiGet);

  return {
    current: data?.current ?? 0,
    longest: data?.longest ?? 0,
    isLoading,
    isError: error,
    mutate,
  };
}
