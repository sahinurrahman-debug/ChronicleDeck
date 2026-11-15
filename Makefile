# Run from an activated virtualenv (python -m venv .venv), or override: make test PY=.venv/Scripts/python
PY ?= python
COMPOSE = docker compose -f infra/docker-compose.yml

.PHONY: install dev dev-deps api web migrate lint typecheck test eval seed demo

install:           ## venv deps + web deps
	$(PY) -m pip install -e ".[dev]"
	npm --prefix apps/web install

dev:               ## everything in containers: db, redis, api, worker, web
	$(COMPOSE) up --build

dev-deps:          ## just db + redis, for running api/web on the host
	$(COMPOSE) up -d db redis

api:               ## API on the host (needs dev-deps + migrate)
	cd apps/api && $(PY) -m uvicorn app.main:app --reload --port 8000

web:
	npm --prefix apps/web run dev

migrate:
	cd apps/api && $(PY) -m alembic upgrade head

lint:
	$(PY) -m ruff check .
	npm --prefix apps/web run lint

typecheck:
	$(PY) -m mypy
	npm --prefix apps/web run typecheck

test:
	$(PY) -m pytest

# --- built live ---------------------------------------------------------------------------
eval:              ## writes evals/results.md (A/B/C runs)
	@echo "evals/run_eval.py is built live" && exit 1

seed:              ## loads universes/* into the DB
	@echo "seed universes are built live (see PREBUILT.md)" && exit 1

demo:              ## runs the 3-minute abandonment-cascade scenario
	@echo "demo scenario is built live (see docs/demo-script.md)" && exit 1
