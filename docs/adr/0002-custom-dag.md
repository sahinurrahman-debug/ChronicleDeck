# ADR 0002: A small custom Stage DAG instead of an agent framework

- **Status:** accepted (pre-build)
- **Implemented:** live

## Context
The pipeline is a fixed graph of typed steps with retries and post-validation, not an open-ended
agent loop. Every stage must validate its input and output schemas and emit a trace.

## Decision
A `Stage[I, O]` contract (input model, output model, model tier, `post_validate`) plus a minimal DAG
runner. Validation errors are fed back into the retry. No third-party orchestration framework.

## Consequences
- Total control over retries, schema validation, tracing and per-slot token accounting.
- Easy to unit-test a stage with recorded fixtures.
- We own the scheduling code (parallel fan-out for the four checks), which is small but ours to maintain.
