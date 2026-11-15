import type { BibleCardData, BibleSection } from "@/lib/types";

export const BIBLE_SECTIONS: { id: BibleSection; label: string }[] = [
  { id: "character", label: "Characters" },
  { id: "rule", label: "World rules" },
  { id: "language", label: "Languages" },
  { id: "faction", label: "Factions" },
  { id: "npc", label: "NPCs" },
];

export const BIBLE_CARDS: BibleCardData[] = [
  { id: "c1", section: "character", name: "Mara Voss", status: "canon", summary: "Harbour smuggler. Wound: abandoned at the Ember Court. Values loyalty over law." },
  { id: "c2", section: "character", name: "Corin Voss", status: "canon", summary: "Mara's brother. Renounced the Ember crown in chapter 2." },
  { id: "c3", section: "character", name: "Ilse Marrow", status: "proposed", summary: "Court archivist the compiler found in your notes. Needs a goal." },
  { id: "r1", section: "rule", name: "Ash binds oaths", status: "canon", summary: "An oath sworn over ash cannot be broken without visible cost." },
  { id: "r2", section: "rule", name: "No fire at sea", status: "proposed", summary: "Open flame is forbidden aboard ships after the Burning Tide." },
  { id: "l1", section: "language", name: "Hearthspeak", status: "canon", summary: "Closed lexicon · 214 words · SOV · agglutinative suffixes." },
  { id: "f1", section: "faction", name: "The Ember Court", status: "canon", summary: "Ruling council. Destroyed in chapter 4." },
  { id: "n1", section: "npc", name: "Harbourmaster Tobb", status: "proposed", summary: "Knows about the smuggling routes, not about the oath." },
];
