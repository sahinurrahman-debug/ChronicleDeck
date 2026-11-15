# ADR 0003: Invented languages use a closed lexicon

- **Status:** accepted (pre-build)
- **Implemented:** live (`engines/language`)

## Context
LLMs invent plausible-looking words in constructed languages and silently drift. Judging "does this
word belong to the language?" with another model is unreliable.

## Decision
Each `language` has a closed `lexeme` set. A tokenizer finds conlang tokens in generated text; any
token not in the lexicon is a hard flag. New words may only arrive as proposals, validated by a
phonotactics finite-state machine before the author sees them.

## Consequences
- Language errors are deterministic and have a measurable out-of-lexicon rate.
- Authors must approve new words, which is the point, but adds friction for fast drafting.
- Morphology (`inflect()` / `analyze()`) must be implemented as rewrite rules for inflected forms to pass.
