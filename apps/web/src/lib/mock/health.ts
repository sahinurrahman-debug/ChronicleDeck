// How much of your story the assistant reads at each step of one chapter (sample numbers).
export const SLOT_TOKENS = [
  { stage: "Planning", global: 3200, character: 900, branch: 600, episodic: 700, task: 300 },
  { stage: "Drafting", global: 3200, character: 1300, branch: 800, episodic: 1100, task: 500 },
  { stage: "Polishing", global: 1800, character: 900, branch: 0, episodic: 0, task: 1400 },
  { stage: "Checking", global: 0, character: 700, branch: 500, episodic: 0, task: 1500 },
];

export const SLOT_KEYS = ["global", "character", "branch", "episodic", "task"] as const;

export const SLOT_LABEL: Record<(typeof SLOT_KEYS)[number], string> = {
  global: "Your world",
  character: "Characters",
  branch: "This storyline",
  episodic: "Earlier chapters",
  task: "This scene",
};

export const HEALTH_STATS = [
  { label: "Consistency", value: "82%", note: "12 open notes" },
  { label: "Context reused", value: "71%", note: "keeps checks quick and cheap" },
  { label: "Check time", value: "14 sec", note: "per chapter" },
  { label: "Cost", value: "$0.18", note: "per chapter" },
];

export const SCORE_BREAKDOWN = [
  { kind: "lore", open: 2, tone: "error" },
  { kind: "psyche", open: 5, tone: "warn" },
  { kind: "timeline", open: 1, tone: "info" },
  { kind: "voice", open: 3, tone: "warn" },
  { kind: "language", open: 0, tone: "ok" },
  { kind: "knowledge_leak", open: 1, tone: "warn" },
] as const;
