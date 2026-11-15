import { create } from "zustand";

export type Strictness = 1 | 2 | 3; // 1 relaxed (errors only) · 2 balanced · 3 strict (everything)
export type EditorMode = "watch" | "cowrite" | "draft";

interface StudioState {
  strictness: Strictness;
  mode: EditorMode;
  activeViolationId: string | null;
  setStrictness: (s: Strictness) => void;
  setMode: (m: EditorMode) => void;
  setActiveViolation: (id: string | null) => void;
}

export const useStudio = create<StudioState>((set) => ({
  strictness: 2,
  mode: "cowrite",
  activeViolationId: null,
  setStrictness: (strictness) => set({ strictness }),
  setMode: (mode) => set({ mode }),
  setActiveViolation: (activeViolationId) => set({ activeViolationId }),
}));

/** Flag, never block: strictness only changes what is surfaced, not what can be written. */
export function visibleSeverities(s: Strictness): readonly string[] {
  if (s === 1) return ["error"];
  if (s === 2) return ["warn", "error"];
  return ["info", "warn", "error"];
}
