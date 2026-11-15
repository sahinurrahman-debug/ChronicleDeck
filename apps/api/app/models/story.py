"""Branch + episodic memory: branches, chapters, snapshots, psyche deltas, memory tree."""

import uuid
from datetime import datetime
from typing import Any

from pgvector.sqlalchemy import Vector
from sqlalchemy import CheckConstraint, Float, ForeignKey, Index, Integer, Text, UniqueConstraint
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, created_at, json_obj, uuid_pk

EMBEDDING_DIM = 1536


class Branch(Base):
    __tablename__ = "branch"

    id: Mapped[uuid.UUID] = uuid_pk()
    universe_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("universe.id", ondelete="CASCADE"), index=True
    )
    parent_branch_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("branch.id", ondelete="SET NULL"), nullable=True
    )
    # branch <-> chapter reference each other, so this FK is created after both tables exist
    fork_chapter_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("chapter.id", ondelete="SET NULL", use_alter=True), nullable=True
    )
    label: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = created_at()


class Chapter(Base):
    __tablename__ = "chapter"
    __table_args__ = (UniqueConstraint("branch_id", "idx"),)

    id: Mapped[uuid.UUID] = uuid_pk()
    branch_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("branch.id", ondelete="CASCADE"))
    idx: Mapped[int] = mapped_column(Integer)
    title: Mapped[str] = mapped_column(Text, default="", server_default="")
    text: Mapped[str] = mapped_column(Text, default="", server_default="")
    plan: Mapped[dict[str, Any] | None] = mapped_column(nullable=True)
    mode: Mapped[str] = mapped_column(Text, default="draft", server_default="draft")
    continuity_score: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = created_at()


class StateSnapshot(Base):
    """World state after a chapter: alive, location, ownership, relationships, knowledge."""

    __tablename__ = "state_snapshot"
    __table_args__ = (Index("ix_state_snapshot_branch_chapter", "branch_id", "chapter_id"),)

    id: Mapped[uuid.UUID] = uuid_pk()
    branch_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("branch.id", ondelete="CASCADE"))
    chapter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("chapter.id", ondelete="CASCADE"))
    state: Mapped[dict[str, Any]] = json_obj()


class PsycheDelta(Base):
    __tablename__ = "psyche_delta"
    __table_args__ = (Index("ix_psyche_delta_branch_entity", "branch_id", "entity_id"),)

    id: Mapped[uuid.UUID] = uuid_pk()
    branch_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("branch.id", ondelete="CASCADE"))
    chapter_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("chapter.id", ondelete="CASCADE"))
    entity_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("entity.id", ondelete="CASCADE"))
    delta: Mapped[dict[str, Any]] = json_obj()
    cause: Mapped[str] = mapped_column(Text, default="", server_default="")


class MemoryNode(Base):
    """Episodic memory tree: saga -> arc -> chapter -> scene."""

    __tablename__ = "memory_node"
    __table_args__ = (
        CheckConstraint("level in ('saga','arc','chapter','scene')", name="level"),
        Index("ix_memory_node_branch_level", "branch_id", "level"),
        Index(
            "ix_memory_node_embedding",
            "embedding",
            postgresql_using="hnsw",
            postgresql_ops={"embedding": "vector_cosine_ops"},
        ),
    )

    id: Mapped[uuid.UUID] = uuid_pk()
    universe_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("universe.id", ondelete="CASCADE"), index=True
    )
    branch_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("branch.id", ondelete="CASCADE"))
    level: Mapped[str] = mapped_column(Text)
    parent_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("memory_node.id", ondelete="CASCADE"), nullable=True
    )
    chapter_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("chapter.id", ondelete="SET NULL"), nullable=True
    )
    summary: Mapped[str] = mapped_column(Text)
    embedding: Mapped[list[float] | None] = mapped_column(Vector(EMBEDDING_DIM), nullable=True)
