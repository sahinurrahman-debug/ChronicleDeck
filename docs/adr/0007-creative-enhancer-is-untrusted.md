# ADR 0007: The creative enhancer's output is untrusted and runs before every check

- **Status:** accepted (2026-11-16)
- **Implemented:** live

## Context
A model tuned for creativity is also more likely to invent: a new character, a new place, a word in the
invented language, a changed fact. If it ran after the checks, the final text would be unchecked.

## Decision
The pipeline order is `generate (Gemini) → creative_enhance (Adaption) → enhance_guard (code) →
dialect_transduce → extract_claims → checks → verify_evidence → repair`.

`enhance_guard` is deterministic. It rejects an enhanced passage that drops planned beats or canon
references, introduces named entities that are not in the plan, introduces conlang tokens outside the
lexicon, or falls outside length bounds. On rejection the Gemini draft is used for that passage. Whatever
survives is then linted exactly like any other generated text.

The author controls it with a creativity setting (Off / Subtle / Bold). Off skips the stage.

## Consequences
- Creativity can never bypass canon: the enhancer is just another untrusted generator.
- Worst case (guard rejects, model unavailable, or no model configured) is the plain Gemini draft.
- Costs one more model call and some latency per scene; the Health screen shows it as its own stage.
- The eval can measure the enhancer directly: violations introduced per 1,000 words, and creativity
  preference with and without it.
