"""Guards against the ORM models and the hand-checked Alembic migration drifting apart.

Runs the migration in offline mode (renders SQL, no database) and checks every table the models
declare is created, and that downgrade removes them again.
"""

import io
import re
from pathlib import Path

from alembic import command
from alembic.config import Config
from app.models import Base

ALEMBIC_INI = Path(__file__).resolve().parents[2] / "apps" / "api" / "alembic.ini"


def _render(direction: str) -> str:
    buf = io.StringIO()
    cfg = Config(str(ALEMBIC_INI), output_buffer=buf)
    cfg.set_main_option("script_location", str(ALEMBIC_INI.parent / "alembic"))
    if direction == "up":
        command.upgrade(cfg, "head", sql=True)
    else:
        command.downgrade(cfg, "0001:base", sql=True)
    return buf.getvalue()


def test_every_model_table_is_created_by_the_migration() -> None:
    created = set(re.findall(r"^CREATE TABLE (\w+)", _render("up"), flags=re.MULTILINE))
    assert created - {"alembic_version"} == set(Base.metadata.tables)


def test_downgrade_drops_every_table() -> None:
    dropped = set(re.findall(r"^DROP TABLE (\w+)", _render("down"), flags=re.MULTILINE))
    assert dropped == set(Base.metadata.tables)


def test_pgvector_extension_and_hnsw_index_are_present() -> None:
    sql = _render("up")
    assert "CREATE EXTENSION IF NOT EXISTS vector" in sql
    assert "USING hnsw (embedding vector_cosine_ops)" in sql
    assert "VECTOR(1536)" in sql
