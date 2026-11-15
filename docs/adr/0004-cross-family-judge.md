# ADR 0004: A different model family judges the generator

- **Status:** accepted (pre-build)
- **Implemented:** live

## Context
A model judging its own output shares its blind spots, so it tends to approve its own mistakes.

## Decision
Claude generates; Gemini (Flash for claim extraction, Pro for verdicts) judges. Verdicts must carry
evidence, and both the triggering quote and the evidence quote are checked as exact substrings of
their sources in code. A flag that fails either check is dropped. Haiku is the fallback judge when
the Gemini circuit breaker is open.

## Consequences
- Two providers to keep keys, quotas and spend caps for.
- Evidence verification removes unsupported flags, which can cost recall; the eval (run B vs run C)
  measures that trade-off instead of assuming it.
