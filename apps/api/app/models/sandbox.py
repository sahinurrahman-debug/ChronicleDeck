"""Sandbox: NPCs, their branch-scoped memories, and dropped events."""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import ARRAY, ForeignKey, Text, text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, created_at, json_arr, json_obj, uuid_pk


class Npc(Base):
    __tablename__ = "npc"

    id: Mapped[uuid.UUID] = uuid_pk()
    entity_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("entity.id", ondelete="CASCADE"), unique=True
    )
    backstory: Mapped[dict[str, Any]] = json_obj()
    # fact ids this NPC is allowed to know; enforced by code live (no FK on array elements)
    knowledge_scope: Mapped[list[uuid.UUID]] = mapped_column(
        ARRAY(UUID(as_uuid=True)), default=list, server_default=text("'{}'::uuid[]")
    )
    agenda: Mapped[list[Any]] = json_arr()


class NpcMemory(Base):
    __tablename__ = "npc_memory"

    id: Mapped[uuid.UUID] = uuid_pk()
    npc_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("npc.id", ondelete="CASCADE"), index=True
    )
    branch_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("branch.id", ondelete="CASCADE"))
    chapter_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("chapter.id", ondelete="SET NULL"), nullable=True
    )
    event: Mapped[str] = mapped_column(Text)
    source_fact_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("fact.id", ondelete="SET NULL"), nullable=True
    )


class SandboxEvent(Base):
    __tablename__ = "sandbox_event"

    id: Mapped[uuid.UUID] = uuid_pk()
    universe_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("universe.id", ondelete="CASCADE"), index=True
    )
    branch_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("branch.id", ondelete="CASCADE"))
    description: Mapped[str] = mapped_column(Text)
    created_at: Mapped[datetime] = created_at()
