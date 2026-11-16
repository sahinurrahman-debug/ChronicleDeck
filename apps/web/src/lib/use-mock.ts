"use client";

import { useQuery } from "@tanstack/react-query";

/**
 * Serves sample data through TanStack Query after a short delay, so every screen already has its
 * loading (skeleton) state. When a screen is wired to the real API, swap this call for `useQuery`
 * with a real fetcher; the screen code doesn't change.
 */
export function useMock<T>(key: string, data: T, delayMs = 600) {
  return useQuery({
    queryKey: ["sample", key],
    queryFn: () => new Promise<T>((resolve) => setTimeout(() => resolve(data), delayMs)),
    staleTime: Infinity, // sample data never changes, so revisits are instant
  });
}
