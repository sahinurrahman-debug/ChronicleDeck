# ADR 0006: Gemini is the primary model; Adaption supplies the creative enhancer and the judge

- **Status:** accepted (2026-11-16). Supersedes the Claude-based model plan in the original design.
- **Implemented:** live

## Context
The project will not use Claude. Gemini is the main model. The goal is more creative prose than a
general model gives by default, without giving up canon consistency. Adaption (docs.adaptionlabs.ai)
offers training tooling (Adaptive Data, AutoScientist) and hosted inference through one Python SDK
(`adaption`, `client.responses.create(...)`).

## Decision
Four model roles, each behind the model router so providers can change without touching stages:

| Role | Model | Used for |
|---|---|---|
| Primary | Gemini Pro | Canon compile, beat planning, draft generation, hard repairs |
| Utility | Gemini Flash | Claim extraction, summaries, NPC ticks, other cheap batched calls |
| Creative enhancer | A model fine-tuned with Adaption (**not trained yet**) | Rewriting the Gemini draft for voice, imagery and surprise (see ADR 0007) |
| Judge | A non-Google model hosted on Adaption's API (default `qwen3.5-397b`, fallback `deepseek-v4-flash`) | Lore, psyche and voice verdicts |

The judge must not be Gemini or Gemma (see ADR 0004). Gemini context caching replaces the earlier
prompt-caching plan for the canon prefix.

## Consequences
- Two vendors (Google, Adaption) instead of two (Anthropic, Google); the SDK for judge and enhancer is shared.
- **Open:** Adaption's docs describe AutoScientist producing a downloadable LoRA checkpoint, and hosted
  models called by ID, but no endpoint that deploys a tuned model, and the inference-stack docs don't say a
  stack can use one. Until that is settled the enhancer is a pluggable backend (`adaption` hosted model, or
  an `openai_compatible` endpoint for a self-hosted LoRA). With no model configured, the enhance stage is
  skipped and the Gemini draft passes through.
- Gemini and judge model IDs are pinned at the live build, not now.
