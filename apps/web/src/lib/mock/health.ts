// Tokens per memory slot for one generated chapter (the real numbers come from run_trace.slot_tokens).
export const SLOT_TOKENS = [
  { stage: "plan", global: 3200, character: 900, branch: 600, episodic: 700, task: 300 },
  { stage: "generate", global: 3200, character: 1300, branch: 800, episodic: 1100, task: 500 },
  { stage: "judge", global: 0, character: 700, branch: 500, episodic: 0, task: 1500 },
];

export const SLOT_KEYS = ["global", "character", "branch", "episodic", "task"] as const;

export const HEALTH_STATS = [
  { label: "Continuity score", value: "0.82", note: "12 open flags" },
  { label: "Cache hit", value: "71%", note: "canon prefix" },
  { label: "Latency", value: "14.2s", note: "plan → verdicts" },
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
