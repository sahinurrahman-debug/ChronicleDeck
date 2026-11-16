import type { ProposalCardData } from "@/lib/types";

export const KIND_NAME: Record<ProposalCardData["kind"], string> = {
  npc: "Side character",
  word: "New word",
  fact: "New fact",
};

export const PROPOSALS: ProposalCardData[] = [
  {
    id: "p1",
    kind: "npc",
    title: "Harbourmaster Tobb",
    detail: "Works at the harbour and remembers the Burning Tide. Knows six things about your world.",
    rationale: "He's mentioned in chapter 3 but isn't in your story bible yet.",
  },
  {
    id: "p2",
    kind: "word",
    title: "vael, meaning “ash-oath”",
    detail: "Fits the sound of Hearthspeak and doesn't clash with any word you already have.",
    rationale: "It appears in dialogue but isn't in your language's word list.",
  },
  {
    id: "p3",
    kind: "fact",
    title: "Corin lost the signet ring",
    detail: "About Corin, from chapter 4 onward.",
    rationale: "The scene implies it. It only becomes part of your story if you approve it.",
  },
];
