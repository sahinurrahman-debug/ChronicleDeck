"""Identity: users, universes, per-universe schema extensions."""

import uuid
from datetime import datetime
from typing import Any

from sqlalchemy import ARRAY, Boolean, ForeignKey, Integer, Text, UniqueConstraint, text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, created_at, uuid_pk


class AppUser(Base):
    __tablename__ = "app_user"

    id: Mapped[uuid.UUID] = uuid_pk()
    email: Mapped[str] = mapped_column(Text, unique=True)
    # Not in the original spec table; needed for the pre-built email+password auth routes.
    password_hash: Mapped[str | None] = mapped_column(Text, nullable=True)
    created_at: Mapped[datetime] = created_at()


class Universe(Base):
    __tablename__ = "universe"

    id: Mapped[uuid.UUID] = uuid_pk()
    owner_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("app_user.id", ondelete="CASCADE"), index=True
    )
    title: Mapped[str] = mapped_column(Text)
    genre_tags: Mapped[list[str]] = mapped_column(
        ARRAY(Text), default=list, server_default=text("'{}'::text[]")
    )
    schema_version: Mapped[int] = mapped_column(Integer, default=1, server_default=text("1"))
    created_at: Mapped[datetime] = created_at()


class SchemaExtension(Base):
    __tablename__ = "schema_extension"
    __table_args__ = (UniqueConstraint("universe_id", "version"),)

    id: Mapped[uuid.UUID] = uuid_pk()
    universe_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("universe.id", ondelete="CASCADE"), index=True
    )
    version: Mapped[int] = mapped_column(Integer)
    json_schema: Mapped[dict[str, Any]]
    approved: Mapped[bool] = mapped_column(Boolean, default=False, server_default=text("false"))
