import type { BibleCardData, BibleSection } from "@/lib/types";

export const BIBLE_SECTIONS: { id: BibleSection; label: string; singular: string }[] = [
  { id: "character", label: "Characters", singular: "character" },
  { id: "place", label: "Places", singular: "place" },
  { id: "rule", label: "World rules", singular: "world rule" },
  { id: "language", label: "Languages", singular: "language" },
  { id: "faction", label: "Groups", singular: "group" },
  { id: "npc", label: "Side characters", singular: "side character" },
];

// Sample story. "Places" is empty on purpose, so the empty state is visible.
export const BIBLE_CARDS: BibleCardData[] = [
  { id: "c1", section: "character", name: "Mara Voss", status: "canon", summary: "A harbour smuggler, still hurt by being left behind at the Ember Court. Loyal to people before laws." },
  { id: "c2", section: "character", name: "Corin Voss", status: "canon", summary: "Mara's brother. Gave up the Ember crown in chapter 2." },
  { id: "c3", section: "character", name: "Ilse Marrow", status: "proposed", summary: "The court archivist we found in your notes. Still needs a goal." },
  { id: "r1", section: "rule", name: "Ash binds oaths", status: "canon", summary: "An oath sworn over ash can't be broken without a visible cost." },
  { id: "r2", section: "rule", name: "No fire at sea", status: "proposed", summary: "Open flame is forbidden aboard ships after the Burning Tide." },
  { id: "l1", section: "language", name: "Hearthspeak", status: "canon", summary: "A closed vocabulary of 214 words. Verb comes last; endings change a word's meaning." },
  { id: "f1", section: "faction", name: "The Ember Court", status: "canon", summary: "The ruling council. It falls in chapter 4." },
  { id: "n1", section: "npc", name: "Harbourmaster Tobb", status: "proposed", summary: "Knows the smuggling routes, but not about the oath." },
];
