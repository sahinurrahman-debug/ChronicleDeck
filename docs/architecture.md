# Architecture

> Status: design. The shell, schema and CRUD are pre-built; everything inside the **Orchestrator**,
> **Model Router** and the five engines is built live.

## System

```mermaid
flowchart LR
  web["Next.js<br/>(apps/web)"] -- "REST / SSE" --> api["FastAPI<br/>(apps/api)"]
  api --> orch["Orchestrator<br/>Stage DAG"]
  orch --> router["Model Router"]
  router --> gemini["Gemini (primary)<br/>Pro: plan, draft, compile<br/>Flash: claims, summaries"]
  router --> adaption["Adaption<br/>creative enhancer (tuned)<br/>judge (non-Google)"]
  orch --> lore["Lore engine"] & psyche["Psyche engine"] & dialect["Dialect + language"] & sandbox["Sandbox engine"] & validation["Validation engine"]
  lore & psyche & dialect & sandbox & validation --> pg[("Postgres + pgvector")]
  api --> pg
  api <--> redis[("Redis<br/>queue, SSE fan-out")]
  worker["Arq worker"] --> redis
  worker --> pg
```

| Box | Where | Pre-built? |
|---|---|---|
| Next.js shell, 8 screens | `apps/web` | Yes, with mock data |
| FastAPI app, auth, CRUD | `apps/api` | Yes |
| Postgres + pgvector schema, migration | `apps/api/alembic`, `apps/api/app/models` | Yes |
| Orchestrator, router, adapters, Stage | `pipeline/core` | **Live** |
| Engines | `engines/*` | **Live** |
| Memory tree + retriever | `memory/` | **Live** |

## Per-scene pipeline (Stage DAG)

```mermaid
flowchart TD
  A["assemble_working_memory<br/>(5 slots)"] --> B[plan_beats]
  B --> C["validate_plan<br/>canon refs exist · motives fit psyche · NPC knowledge scope"]
  C --> D["generate (Gemini, stream)"]
  D --> D2["creative_enhance (Adaption)<br/>skipped if Off or no model"]
  D2 --> D3["enhance_guard (code)<br/>falls back to the draft"]
  D3 --> E[dialect_transduce]
  E --> F[extract_claims]
  F --> G[lore_check] & H[psyche_check] & I[language_gate] & J[voice_check]
  G & H & I & J --> K[verify_evidence]
  K --> L[aggregate]
  L --> M["repair (spans) ≤ 2"]
  M --> N[propose_canon]
  N --> O[author_review]
  O --> P["commit (snapshot + memory)"]
```

## Model roles

| Role | Model | Details |
|---|---|---|
| Primary | Gemini Pro | Planning, drafting, canon compile, hard repairs |
| Utility | Gemini Flash | Claim extraction, summaries, NPC ticks |
| Creative enhancer | Adaption-tuned model, **not trained yet** | Rewrites the draft for voice and imagery. Output is untrusted and checked afterwards ([ADR 0007](adr/0007-creative-enhancer-is-untrusted.md), [tuning plan](creative-model.md)) |
| Judge | Non-Google model on Adaption (`qwen3.5-397b`, fallback `deepseek-v4-flash`) | Verdicts with evidence ([ADR 0004](adr/0004-cross-family-judge.md)) |

Why these providers: [ADR 0006](adr/0006-gemini-primary-adaption-enhancer-and-judge.md).

## Where the pre-built API stops

`apps/api/app/routers/live.py` declares every endpoint the live build adds, each returning
`501 Built live: …`. That keeps the route contract (and OpenAPI) fixed from hour 0 so the frontend
and the pipeline can be built in parallel. A test (`tests/unit/test_api_smoke.py`) asserts that every
one of them is declared and honest about being unimplemented.

## Boundaries worth knowing

- **Ledger rule.** Proposals can be created and read through CRUD, never edited or deleted. Their
  accept/reject path (which materialises canon) is a live endpoint.
- **Branch scoping.** `fact.branch_scope IS NULL` means "all branches". Ancestry lookup is a live
  recursive CTE in `memory/`.
- **Circular FK.** `branch.fork_chapter_id → chapter.id` and `chapter.branch_id → branch.id`
  reference each other, so the migration adds the first FK after both tables exist.
