export const BRANCH_A = "main";
export const BRANCH_B = "corin-refuses";

export interface DiffRow {
  id: string;
  change: "added" | "removed" | "changed";
  subject: string;
  a: string | null;
  b: string | null;
  chapter: string;
}

export const WORLD_DIFF: DiffRow[] = [
  { id: "d1", change: "changed", subject: "Corin · status", a: "alive", b: "exiled", chapter: "Ch 4′" },
  { id: "d2", change: "removed", subject: "Ember Court", a: "destroyed (ch 4)", b: null, chapter: "Ch 4" },
  { id: "d3", change: "added", subject: "Harbour blockade", a: null, b: "in force", chapter: "Ch 4′" },
];

export interface RelRow {
  pair: string;
  a: number;
  b: number;
}

// Values are -1..1 (trust). Sorted by divergence on render.
export const RELATIONSHIPS: RelRow[] = [
  { pair: "Mara → Corin", a: -0.7, b: -0.9 },
  { pair: "Corin → Mara", a: 0.2, b: -0.4 },
  { pair: "Mara → Tobb", a: 0.4, b: 0.5 },
  { pair: "Tobb → Corin", a: -0.1, b: 0.6 },
];

export const ARC_SERIES = [
  { chapter: 1, main: 0.5, fork: 0.5 },
  { chapter: 2, main: 0.3, fork: 0.3 },
  { chapter: 3, main: -0.2, fork: -0.2 },
  { chapter: 4, main: -0.7, fork: -0.9 },
  { chapter: 5, main: -0.6, fork: -0.95 },
];
export const FORK_CHAPTER = 3;
