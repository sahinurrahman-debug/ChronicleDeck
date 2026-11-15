import type { LintViolation } from "@/lib/types";

export const SAMPLE_HTML = [
  "<p>Mara Voss reached the harbour at dusk. She had not spoken to her brother since the night the Ember Court burned, and she did not plan to start now.</p>",
  "<p>“Corin,” she said, and the word came out warm, almost fond. He was waiting beneath the lamp, still wearing the crown he had sworn never to touch.</p>",
].join("");

// Quotes below match SAMPLE_HTML exactly; the real verifier checks this in code, here it is hand-kept.
export const SAMPLE_VIOLATIONS: LintViolation[] = [
  {
    id: "v1",
    quote: "the word came out warm, almost fond",
    kind: "psyche",
    severity: "warn",
    message: "Mara's trust in Corin is at -0.7. A jump to warmth needs a cause event.",
    suggestedFix: "the word came out flat, rehearsed",
    evidence: [
      {
        kind: "snapshot",
        label: "Relationship after ch. 3",
        quote: "trust(Mara → Corin) = -0.7",
        location: "Chapter 3 snapshot",
      },
      {
        kind: "rule",
        label: "Psyche transition rule",
        quote: "|Δtrust| ≤ 0.3 per chapter unless a major_event is declared",
      },
    ],
  },
  {
    id: "v2",
    quote: "still wearing the crown he had sworn never to touch",
    kind: "lore",
    severity: "error",
    message: "Corin renounced the crown in chapter 2. No event restores it.",
    suggestedFix: "standing where the crown had once rested on his brow",
    evidence: [
      {
        kind: "fact",
        label: "Canon fact",
        quote: "Corin renounced the Ember crown",
        location: "Chapter 2, scene 4",
      },
    ],
  },
  {
    id: "v3",
    quote: "the night the Ember Court burned",
    kind: "timeline",
    severity: "info",
    message: "The Ember Court burns in chapter 4. This scene is set in chapter 3.",
    suggestedFix: "the night the Ember Court was sealed",
    evidence: [
      {
        kind: "chapter_quote",
        label: "Later chapter",
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
