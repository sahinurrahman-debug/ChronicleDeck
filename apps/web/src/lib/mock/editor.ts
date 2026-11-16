import type { LintViolation } from "@/lib/types";

export const SAMPLE_HTML = [
  "<p>Mara Voss reached the harbour at dusk. She had not spoken to her brother since the night the Ember Court burned, and she did not plan to start now.</p>",
  "<p>“Corin,” she said, and the word came out warm, almost fond. He was waiting beneath the lamp, still wearing the crown he had sworn never to touch.</p>",
].join("");

// Each quote must match the text above exactly (the real checker verifies this in code).
export const SAMPLE_VIOLATIONS: LintViolation[] = [
  {
    id: "v1",
    quote: "the word came out warm, almost fond",
    kind: "psyche",
    severity: "warn",
    message: "Mara deeply distrusts Corin at this point. Sounding warm toward him needs a reason.",
    suggestedFix: "the word came out flat, rehearsed",
    evidence: [
      {
        kind: "snapshot",
        label: "Where your story stood",
        quote: "Mara's trust in Corin is very low after chapter 3.",
        location: "Chapter 3",
      },
      {
        kind: "rule",
        label: "A rule you set",
        quote: "Trust shouldn't swing sharply in one chapter unless something big happens.",
      },
    ],
  },
  {
    id: "v2",
    quote: "still wearing the crown he had sworn never to touch",
    kind: "lore",
    severity: "error",
    message: "Corin gave up the crown in chapter 2, and nothing in your story gives it back.",
    suggestedFix: "standing where the crown had once rested on his brow",
    evidence: [
      {
        kind: "fact",
        label: "In your story bible",
        quote: "Corin renounced the Ember crown.",
        location: "Chapter 2, scene 4",
      },
    ],
  },
  {
    id: "v3",
    quote: "the night the Ember Court burned",
    kind: "timeline",
    severity: "info",
    message: "The Ember Court doesn't burn until chapter 4, but this scene is set in chapter 3.",
    suggestedFix: "the night the Ember Court was sealed",
    evidence: [
      {
        kind: "chapter_quote",
        label: "Later in your story",
        quote: "The Ember Court burned until dawn.",
        location: "Chapter 4, scene 1",
      },
    ],
  },
];

export const SAMPLE_SCREENPLAY = `INT. HARBOUR - DUSK

Lamps gutter along the quay. MARA VOSS (30s, salt-stiff coat) stops at the edge of the light.

MARA
(flat, rehearsed)
Corin.

CORIN (O.S.)
You came.

MARA
(furious)
Don't mistake it for forgiveness.
`;
