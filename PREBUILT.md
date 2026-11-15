# PREBUILT.md

Everything committed before the live window starts, mapped to the allowed pre-build categories.
Anything not listed here is built live. Proof of compliance: the `prebuild-final` git tag (see the end).

## What is pre-built

| Area | Paths | Category | Notes |
|---|---|---|---|
| Next.js shell | `apps/web/src/app/layout.tsx`, `components/shell/`, `components/providers.tsx` | Shell, layouts | Sidebar nav, strictness control, TanStack Query provider |
| UI kit | `apps/web/src/components/ui/` | Tailwind/shadcn | Hand-written shadcn-style primitives (button, card, badge, input, segmented) |
| All 8 screens, mock data | `apps/web/src/app/{new,bible,editor,screenplay,map,whatif,inbox,health}/` | Screens empty/mock | Data comes from `apps/web/src/lib/mock/` and is labelled on each screen |
| TipTap scaffold | `apps/web/src/components/editor/` | TipTap scaffold | Empty decoration hook: `setLintMarks(editor, marks, activeId)`. Fed with mock marks only |
| React Flow scaffold | `apps/web/src/components/map/` | React Flow scaffold | Static mock branch graph |
| Recharts scaffolds | `apps/web/src/components/{whatif,health}/` | Recharts scaffold | Mock series |
| Web state + API client | `apps/web/src/lib/{store,api,types,utils}.ts` | Plain plumbing | `api.ts` is a thin fetch wrapper; screens don't call it yet |
| FastAPI app | `apps/api/app/{main,config,db,deps}.py` | Plain CRUD plumbing | Lazy async engine; no DB access at import |
| Auth routes | `apps/api/app/routers/auth.py`, `security.py` | Auth | Email + password, scrypt, JWT |
| CRUD routes | `apps/api/app/routers/{universes,bible,story}.py`, `_crud.py`, `schemas/` | Plain CRUD | Universes, entities, facts, rules, languages, lexemes, psyche/dialect rows, branches, chapters, proposals (create/read only), violations (read only) |
| ORM models | `apps/api/app/models/` | ORM models | All tables from the spec |
| Migration | `apps/api/alembic/` | Alembic migrations | `0001_initial`: 22 tables, `vector` extension, HNSW index |
| Live route contract | `apps/api/app/routers/live.py` | Route declarations only | 12 endpoints that return `501 Built live: …`. No logic |
| Worker wiring | `apps/api/app/worker.py` | Infra | Arq settings + a `ping` job only |
| Docker, CI, tooling | `infra/`, `.github/workflows/ci.yml`, `Makefile`, `.pre-commit-config.yaml`, `pyproject.toml`, `.env.example` | Docker, CI skeleton | |
| Architecture docs | `docs/architecture.md`, `docs/memory.md`, `docs/adr/` | Architecture diagram | ADRs record decisions; implementations are live |
| Tests for the above | `tests/unit/` | n/a | 28 tests: API surface, auth helpers, migration ↔ model drift guard |
| Empty live-build folders | `pipeline/`, `engines/`, `memory/`, `universes/`, `evals/`, `tests/{integration,e2e}/` | Structure only | Packages contain a docstring and nothing else |

## What is deliberately NOT pre-built (★ built live)

Prompts (all of them, zero- and few-shot) · model router and provider adapters · Stage contract and DAG ·
streaming SSE · context assembly and the memory tree · psyche, dialect, conlang, sandbox and validation
logic · claim extraction, judges, evidence verification, repair, proposals · compare API · lint wiring and
score click-through · eval harness and runs · video, deck, Devfolio submission.

Real behaviour of the pre-built code you should not mistake for live work:
- The 12 routes in `live.py` are stubs; a test asserts they all return 501.
- The editor's squiggles come from hand-written mock violations, not from any validation.
- `make eval`, `make seed` and `make demo` exit with an error saying they are built live.

## Open questions (confirm with organisers)

These are marked "confirm" in the plan and are **not** included:

1. **Pydantic schemas** for the pipeline (`BeatPlan`, `Claim`, `Evidence`, `Violation`, `Psyche`,
   `DialectProfile`, `NPC`). `pipeline/schemas/` is empty. The CRUD DTOs in `apps/api/app/schemas/` are
   plain request/response models for the pre-built routes, not these.
2. **Seed universe content** (`universes/ashfall`, `halcyon`, `ledger`). Empty. The UI mock data is generic
   sample text, not a seed universe.

## Deviations from the spec's data model

- `app_user.password_hash` (nullable) added for the pre-built auth routes.
- `created_at` added to `branch`, `proposal`, `run_trace` and `sandbox_event` for ordering and ops.
- `CHECK` constraints added on the enumerated status/kind/severity/level columns.
- `proposal.status` is `pending | accepted | rejected` (the spec left it unspecified).

## Not in the repo: manual pre-build items

Keys and spend caps (Anthropic, Google, embeddings), Langfuse project, Vercel/Railway/Neon accounts,
Figma wireframes (see `docs/figma/README.md`), deck template. None of these can be created from code.

## Verified vs not verified

Verified locally (Windows, Python 3.12 venv, Node 24): `ruff`, `mypy --strict`, `pytest` (28 pass),
`next lint`, `tsc --noEmit`, `next build`, and the editor squiggles/strictness/click behaviour in a browser.
The migration was validated by rendering Postgres SQL offline (upgrade and downgrade).

**Not run:** the migration against a live Postgres, the CRUD routes against a database, Docker images and
`docker compose`, and the GitHub Actions workflow. Docker and Postgres were not available on this machine;
CI's `api` job applies the migration up/down/up against a pgvector service container, so the first push will
exercise it.

## Proof-of-compliance commands

Run these once you are happy with the tree (the folder is not a git repository yet):

```bash
git init -b main
git add -A
git commit -m "chore: pre-build scaffold (see PREBUILT.md)"
git tag prebuild-final
```

Then keep commits small and descriptive during the live window.
