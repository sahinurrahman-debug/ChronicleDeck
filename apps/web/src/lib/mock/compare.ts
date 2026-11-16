export const STORYLINE_A = "Original";
export const STORYLINE_B = "Corin refuses";

export interface DiffRow {
  id: string;
  change: "added" | "removed" | "changed";
  subject: string;
  a: string | null;
  b: string | null;
  chapter: string;
}

export const WORLD_DIFF: DiffRow[] = [
  { id: "d1", change: "changed", subject: "Corin", a: "Alive and free", b: "Exiled", chapter: "Chapter 4" },
  { id: "d2", change: "removed", subject: "The Ember Court", a: "Destroyed in chapter 4", b: null, chapter: "Chapter 4" },
  { id: "d3", change: "added", subject: "Harbour blockade", a: null, b: "In force", chapter: "Chapter 4" },
];

export interface RelRow {
  pair: string;
  a: number;
  b: number;
}

// How much the first person trusts the second, from -1 (not at all) to 1 (completely).
export const RELATIONSHIPS: RelRow[] = [
  { pair: "Mara toward Corin", a: -0.7, b: -0.9 },
  { pair: "Corin toward Mara", a: 0.2, b: -0.4 },
  { pair: "Mara toward Tobb", a: 0.4, b: 0.5 },
  { pair: "Tobb toward Corin", a: -0.1, b: 0.6 },
];

export const ARC_SERIES = [
  { chapter: 1, original: 0.5, fork: 0.5 },
  { chapter: 2, original: 0.3, fork: 0.3 },
  { chapter: 3, original: -0.2, fork: -0.2 },
  { chapter: 4, original: -0.7, fork: -0.9 },
  { chapter: 5, original: -0.6, fork: -0.95 },
];
export const SPLIT_CHAPTER = 3;
