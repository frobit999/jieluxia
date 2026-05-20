"use client";

import useSWR from "swr";
import { apiGet } from "@/lib/api";

interface User {
  id: string;
  email: string;
  nickname: string;
  avatarEmoji: string;
  level: number;
  title: string;
  createdAt?: string;
}

export function useUser() {
  const { data, error, isLoading, mutate } = useSWR<{ user: User }>(
    "/api/auth/me",
    apiGet
  );

  return {
    user: data?.user ?? null,
    isLoading,
    isError: error,
    mutate,
  };
}
