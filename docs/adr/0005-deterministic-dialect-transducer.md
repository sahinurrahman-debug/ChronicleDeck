# ADR 0005: Dialect is applied by a deterministic transducer

- **Status:** accepted (pre-build)
- **Implemented:** live (`engines/dialect`)

## Context
Asking an LLM to "write in this character's dialect" drifts across chapters and cannot be tested.

## Decision
Generate neutral prose, then apply the speaker's `dialect_profile` (lexicon, phonology, grammar,
discourse markers) with ordered rewrite rules at a given intensity. The active register comes from a
resolver using speaker, listener, emotion and setting (including screenplay parentheticals). A
separate voice judge checks fidelity to the profile and must cite the rule it relies on.

## Consequences
- Same input and profile always produce the same output, so it is unit- and property-testable.
- Expressiveness is limited to what rewrite rules can state; very idiosyncratic voices need more rules.
