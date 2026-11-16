import { create } from "zustand";

export type Strictness = 1 | 2 | 3; // 1 light (only serious issues) · 2 balanced · 3 thorough (everything)
export type EditorMode = "watch" | "cowrite" | "draft"; // I write · we write · draft for me
export type Creativity = "off" | "subtle" | "bold"; // plain · polished · vivid; plain skips the style pass

interface StudioState {
  strictness: Strictness;
  mode: EditorMode;
  creativity: Creativity;
  activeViolationId: string | null;
  setStrictness: (s: Strictness) => void;
  setMode: (m: EditorMode) => void;
  setCreativity: (c: Creativity) => void;
  setActiveViolation: (id: string | null) => void;
}

export const useStudio = create<StudioState>((set) => ({
  strictness: 2,
  mode: "cowrite",
  creativity: "subtle",
  activeViolationId: null,
  setStrictness: (strictness) => set({ strictness }),
  setMode: (mode) => set({ mode }),
  setCreativity: (creativity) => set({ creativity }),
  setActiveViolation: (activeViolationId) => set({ activeViolationId }),
}));

/** Flag, never block: this only changes what is surfaced, not what can be written. */
export function visibleSeverities(s: Strictness): readonly string[] {
  if (s === 1) return ["error"];
  if (s === 2) return ["warn", "error"];
  return ["info", "warn", "error"];
}
