/**
 * Hand-written view types for the pre-built screens.
 * During the live window these are replaced by types generated from the Pydantic schemas
 * (Pydantic -> JSON Schema -> TS), which are the single source of truth.
 */

export type Severity = "info" | "warn" | "error";
export type ViolationKind =
  | "lore"
  | "psyche"
  | "timeline"
  | "voice"
  | "language"
  | "knowledge_leak";
export type CanonStatus = "canon" | "proposed" | "rejected";

export interface EvidenceItem {
  kind: "fact" | "rule" | "snapshot" | "chapter_quote";
  label: string;
  quote: string;
  location?: string;
}

export interface LintViolation {
  id: string;
  quote: string;
  kind: ViolationKind;
  severity: Severity;
  message: string;
  suggestedFix: string;
  evidence: EvidenceItem[];
}

export type BibleSection = "character" | "place" | "rule" | "language" | "faction" | "npc";

export interface BibleCardData {
  id: string;
  section: BibleSection;
  name: string;
  summary: string;
  status: CanonStatus;
}

export interface ProposalCardData {
  id: string;
  kind: "npc" | "word" | "fact";
  title: string;
  detail: string;
  rationale: string;
}

export interface ChapterNodeData extends Record<string, unknown> {
  label: string;
  branch: string;
  score: number;
}
