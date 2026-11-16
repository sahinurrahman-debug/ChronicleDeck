import type { CanonStatus, Severity, ViolationKind } from "./types";

/** Plain-language names for internal codes. Screens never show the raw codes. */
export const KIND_LABEL: Record<ViolationKind, string> = {
  lore: "World rules",
  psyche: "Character",
  timeline: "Timeline",
  voice: "Voice",
  language: "Invented language",
  knowledge_leak: "Who knows what",
};

export const SEVERITY_LABEL: Record<Severity, string> = {
  error: "Needs fixing",
  warn: "Worth a look",
  info: "Small note",
};

export const STATUS_LABEL: Record<CanonStatus, string> = {
  canon: "Approved",
  proposed: "Needs review",
  rejected: "Removed",
};
