"""Validation + canon ledger: violations, proposals, exception rules. Plus ops traces."""

import uuid
from datetime import datetime
from decimal import Decimal
from typing import Any

from sqlalchemy import CheckConstraint, ForeignKey, Index, Integer, Numeric, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, created_at, json_arr, json_obj, uuid_pk


class Violation(Base):
    __tablename__ = "violation"
    __table_args__ = (
        CheckConstraint(
            "kind in ('lore','psyche','timeline','voice','language','knowledge_leak')",
            name="kind",
        ),
        CheckConstraint("severity in ('info','warn','error')", name="severity"),
        CheckConstraint("status in ('open','fixed','intentional')", name="status"),
        Index("ix_violation_chapter_status", "chapter_id", "status"),
    )

    id: Mapped[uuid.UUID] = uuid_pk()
    chapter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("chapter.id", ondelete="CASCADE"))
    span_start: Mapped[int] = mapped_column(Integer)
    span_end: Mapped[int] = mapped_column(Integer)
    triggering_quote: Mapped[str] = mapped_column(Text)
    kind: Mapped[str] = mapped_column(Text)
    evidence: Mapped[list[Any]] = json_arr()  # list[Evidence]; min 1 is enforced in code live
    message: Mapped[str] = mapped_column(Text)
    suggested_fix: Mapped[str] = mapped_column(Text, default="", server_default="")
    severity: Mapped[str] = mapped_column(Text, default="warn", server_default="warn")
    status: Mapped[str] = mapped_column(Text, default="open", server_default="open")


class Proposal(Base):
    """The canon ledger: generated content may only ever create these rows."""

    __tablename__ = "proposal"
    __table_args__ = (
        CheckConstraint("status in ('pending','accepted','rejected')", name="status"),
        Index("ix_proposal_universe_status", "universe_id", "status"),
    )

    id: Mapped[uuid.UUID] = uuid_pk()
    universe_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("universe.id", ondelete="CASCADE"))
    kind: Mapped[str] = mapped_column(Text)  # npc | word | fact | rule | schema_extension | ...
    payload: Mapped[dict[str, Any]] = json_obj()
    rationale: Mapped[str] = mapped_column(Text, default="", server_default="")
    status: Mapped[str] = mapped_column(Text, default="pending", server_default="pending")
    created_at: Mapped[datetime] = created_at()


class ExceptionRule(Base):
    """'Intentional' on a violation becomes one of these so it is never re-flagged."""

    __tablename__ = "exception_rule"

    id: Mapped[uuid.UUID] = uuid_pk()
    universe_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("universe.id", ondelete="CASCADE"), index=True
    )
    violation_kind: Mapped[str] = mapped_column(Text)
    scope: Mapped[dict[str, Any]] = json_obj()
    note: Mapped[str] = mapped_column(Text, default="", server_default="")


class RunTrace(Base):
    __tablename__ = "run_trace"

    id: Mapped[uuid.UUID] = uuid_pk()
    chapter_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("chapter.id", ondelete="SET NULL"), nullable=True, index=True
    )
    stage: Mapped[str] = mapped_column(Text)
    model: Mapped[str] = mapped_column(Text)
    tokens_in: Mapped[int] = mapped_column(Integer, default=0)
    tokens_out: Mapped[int] = mapped_column(Integer, default=0)
    cached_tokens: Mapped[int] = mapped_column(Integer, default=0)
    slot_tokens: Mapped[dict[str, Any]] = json_obj()
    latency_ms: Mapped[int] = mapped_column(Integer, default=0)
    cost: Mapped[Decimal] = mapped_column(Numeric(12, 6), default=Decimal(0))
    created_at: Mapped[datetime] = created_at()
