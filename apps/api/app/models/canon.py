"""Global + character memory: entities, facts, rules, languages, psyche, dialect."""

import uuid
from typing import Any

from sqlalchemy import (
    CheckConstraint,
    Float,
    ForeignKey,
    Index,
    Integer,
    Text,
    UniqueConstraint,
    text,
)
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, json_arr, json_obj, uuid_pk


class Entity(Base):
    __tablename__ = "entity"
    __table_args__ = (
        UniqueConstraint("universe_id", "type", "name"),
        CheckConstraint("status in ('canon','proposed','rejected')", name="status"),
        Index("ix_entity_universe_type", "universe_id", "type"),
    )

    id: Mapped[uuid.UUID] = uuid_pk()
    universe_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("universe.id", ondelete="CASCADE"))
    type: Mapped[str] = mapped_column(Text)  # character | location | faction | item | ... (extensible)
    name: Mapped[str] = mapped_column(Text)
    attrs: Mapped[dict[str, Any]] = json_obj()
    status: Mapped[str] = mapped_column(Text, default="proposed", server_default="proposed")


class Fact(Base):
    __tablename__ = "fact"
    __table_args__ = (
        CheckConstraint("status in ('canon','proposed','rejected')", name="status"),
        Index("ix_fact_universe_subject", "universe_id", "subject_id"),
    )

    id: Mapped[uuid.UUID] = uuid_pk()
    universe_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("universe.id", ondelete="CASCADE"))
    subject_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("entity.id", ondelete="CASCADE"))
    predicate: Mapped[str] = mapped_column(Text)
    object: Mapped[str] = mapped_column(Text)
    source_ref: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(Text, default="proposed", server_default="proposed")
    valid_from_chapter: Mapped[int] = mapped_column(Integer, default=0, server_default=text("0"))
    # NULL = applies to every branch
    branch_scope: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("branch.id", ondelete="CASCADE"), nullable=True, index=True
    )


class ConstraintRule(Base):
    __tablename__ = "constraint_rule"
    __table_args__ = (CheckConstraint("severity in ('info','warn','error')", name="severity"),)

    id: Mapped[uuid.UUID] = uuid_pk()
    universe_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("universe.id", ondelete="CASCADE"), index=True
    )
    entity_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("entity.id", ondelete="CASCADE"), nullable=True
    )
    kind: Mapped[str] = mapped_column(Text)
    rule_text: Mapped[str] = mapped_column(Text)
    rule_json: Mapped[dict[str, Any]] = json_obj()
    severity: Mapped[str] = mapped_column(Text, default="warn", server_default="warn")


class Language(Base):
    __tablename__ = "language"

    id: Mapped[uuid.UUID] = uuid_pk()
    universe_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("universe.id", ondelete="CASCADE"), index=True
    )
    name: Mapped[str] = mapped_column(Text)
    phonotactics: Mapped[dict[str, Any]] = json_obj()
    morphology: Mapped[dict[str, Any]] = json_obj()
    word_order: Mapped[str | None] = mapped_column(Text, nullable=True)


class Lexeme(Base):
    __tablename__ = "lexeme"
    __table_args__ = (
        UniqueConstraint("language_id", "form"),
        CheckConstraint("status in ('canon','proposed','rejected')", name="status"),
    )

    id: Mapped[uuid.UUID] = uuid_pk()
    language_id: Mapped[uuid.UUID] = mapped_column(ForeignKey("language.id", ondelete="CASCADE"))
    form: Mapped[str] = mapped_column(Text)
    gloss: Mapped[str] = mapped_column(Text)
    pos: Mapped[str | None] = mapped_column(Text, nullable=True)
    register: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(Text, default="proposed", server_default="proposed")


class Psyche(Base):
    __tablename__ = "psyche"

    id: Mapped[uuid.UUID] = uuid_pk()
    entity_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("entity.id", ondelete="CASCADE"), unique=True
    )
    traits: Mapped[dict[str, Any]] = json_obj()
    values: Mapped[list[Any]] = json_arr()
    wounds: Mapped[list[Any]] = json_arr()
    goals: Mapped[list[Any]] = json_arr()
    beliefs: Mapped[list[Any]] = json_arr()
    constraints: Mapped[list[Any]] = json_arr()
    arc: Mapped[dict[str, Any]] = json_obj()


class DialectProfile(Base):
    __tablename__ = "dialect_profile"

    id: Mapped[uuid.UUID] = uuid_pk()
    entity_id: Mapped[uuid.UUID] = mapped_column(
        ForeignKey("entity.id", ondelete="CASCADE"), unique=True
    )
    base_language_id: Mapped[uuid.UUID | None] = mapped_column(
        ForeignKey("language.id", ondelete="SET NULL"), nullable=True
    )
    phonology: Mapped[list[Any]] = json_arr()
    lexicon: Mapped[dict[str, Any]] = json_obj()
    grammar: Mapped[list[Any]] = json_arr()
    discourse: Mapped[list[Any]] = json_arr()
    register_map: Mapped[dict[str, Any]] = json_obj()
    code_switch: Mapped[list[Any]] = json_arr()
    intensity: Mapped[float] = mapped_column(Float, default=0.5, server_default=text("0.5"))
