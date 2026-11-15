import type { ProposalCardData } from "@/lib/types";

export const PROPOSALS: ProposalCardData[] = [
  {
    id: "p1",
    kind: "npc",
    title: "Harbourmaster Tobb",
    detail: "Anchored to: Harbour, Burning Tide (year 212). Knows 6 facts.",
    rationale: "Named in chapter 3 with no entry in the bible.",
  },
  {
    id: "p2",
    kind: "word",
    title: "vael (n.) · “ash-oath”",
    detail: "Hearthspeak · passes phonotactics · no collision with the lexicon.",
    rationale: "Used in dialogue; not in the closed lexicon.",
  },
  {
    id: "p3",
    kind: "fact",
    title: "Corin lost the signet ring",
    detail: "Subject: Corin · valid from chapter 4.",
    rationale: "Implied by the generated scene; needs author approval to become canon.",
  },
];
