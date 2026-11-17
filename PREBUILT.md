# PREBUILT.md

Everything committed before the live window starts, mapped to the allowed pre-build categories.
Anything not listed here is built live. Proof of compliance: the `prebuild-final` git tag (see the end).

## What is pre-built

| Area | Paths | Category | Notes |
|---|---|---|---|
| Next.js shell | `apps/web/src/app/{layout,template,loading,not-found}.tsx`, `components/shell/`, `components/providers.tsx` | Shell, layouts | Navbar (mobile menu), footer, light/dark toggle, page transition, TanStack Query provider |
| Landing page | `apps/web/src/app/page.tsx` | Hero, CTA banner | Hero, how it works, features, closing banner |
| UI kit | `apps/web/src/components/ui/` | Tailwind/shadcn | Hand-written shadcn-style primitives (button, card, badge, input, segmented) |
| All 8 screens, mock data | `apps/web/src/app/{start,write,screenplay,bible,storylines,compare,suggestions,health}/` | Screens empty/mock | Sample data from `apps/web/src/lib/mock/`, served through `use-mock.ts` so each screen already has loading and empty states. Labelled on each screen |
| TipTap scaffold | `apps/web/src/components/editor/` | TipTap scaffold | Empty decoration hook: `setLintMarks(editor, marks, activeId)`. Fed with mock marks only |
| React Flow scaffold | `apps/web/src/components/map/` | React Flow scaffold | Static mock branch graph |
| Recharts scaffolds | `apps/web/src/components/{compare,health}/` | Recharts scaffold | Mock series, theme-aware colours |
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
| Tests for the above | `tests/unit/` | n/a | 31 tests: API surface, auth helpers, migration ↔ model drift guard, provider config (judge is never Gemini/Gemma) |
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


## Model plan 

Gemini is the primary model; Adaption hosts the judge (a non-Google model) and, once
trained, the creative enhancer. See [ADR 0006](docs/adr/0006-gemini-primary-adaption-enhancer-and-judge.md)
and [ADR 0007](docs/adr/0007-creative-enhancer-is-untrusted.md). What this changed in the pre-build is
configuration and docs only: provider settings in `apps/api/app/config.py` and `.env.example` (no code reads
them yet), the `llm` extras in `pyproject.toml`, a creativity control and an "enhance" row on mock screens, and
a test that the judge is never Gemini/Gemma.

## Deviations from the spec's data model

- `app_user.password_hash` (nullable) added for the pre-built auth routes.
- `created_at` added to `branch`, `proposal`, `run_trace` and `sandbox_event` for ordering and ops.
- `CHECK` constraints added on the enumerated status/kind/severity/level columns.
- `proposal.status` is `pending | accepted | rejected` (the spec left it unspecified).

## Not in the repo: manual pre-build items

Keys and spend caps (Gemini, Adaption, embeddings), Langfuse project, Vercel/Railway/Neon accounts,
Figma wireframes (see `docs/figma/README.md`), deck template. None of these can be created from code.

## Verified 

Verified locally (Windows, Python 3.12 venv, Node 24): `ruff`, `mypy --strict`, `pytest` (31 pass),
`next lint`, `tsc --noEmit`, `next build`, and the editor squiggles/strictness/click behaviour in a browser.
The migration was validated by rendering Postgres SQL offline (upgrade and downgrade).



## Proof-of-compliance commands

Run these once you are happy with the tree (the folder is not a git repository yet):

```bash
git init -b main
git add -A
git commit -m "chore: pre-build scaffold (see PREBUILT.md)"
git tag prebuild-final
```

Then keep commits small and descriptive during the live window.
