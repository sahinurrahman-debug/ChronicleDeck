# ADR 0004: A different model family judges the generator

- **Status:** accepted; revised 2026-11-16 (the model pairing changed, the principle did not)
- **Implemented:** live

## Context
A model judging its own output shares its blind spots, so it tends to approve its own mistakes.

## Decision
The judge is never from the same family as the generator. Gemini (Pro for drafting, Flash for utility
calls) generates, so verdicts come from a non-Google model hosted on Adaption's API: `qwen3.5-397b` by
default, with `deepseek-v4-flash` as the fallback when the primary judge's circuit breaker is open. Gemma
models count as Google-lineage and are not used to judge.

Verdicts must carry evidence. Both the triggering quote and the evidence quote are checked as exact
substrings of their sources in code; a flag that fails either check is dropped.

## Consequences
- Claim *extraction* (Gemini Flash) is a decomposition step, not a verdict, so it stays on Gemini.
- Two providers to keep keys, quotas and spend caps for.
- Evidence verification removes unsupported flags, which can cost recall. The eval compares a
  non-Google judge against Gemini-judging-Gemini instead of assuming the gap.

## History
Originally: Claude generates, Gemini judges, Haiku as fallback judge. Replaced when Claude was dropped
(ADR 0006).
