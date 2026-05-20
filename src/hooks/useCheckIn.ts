"use client";

import useSWR from "swr";
import { apiGet } from "@/lib/api";

export function useCheckIn() {
  const { data, error, isLoading, mutate } = useSWR<{ checkedIn: boolean }>(
    "/api/checkin/today",
    apiGet
  );

  return {
    checkedIn: data?.checkedIn ?? false,
    isLoading,
    isError: error,
    mutate,
  };
}
