"""Importing this package registers every table on ``Base.metadata`` (Alembic relies on that)."""

from app.models.base import Base
from app.models.canon import (
    ConstraintRule,
    DialectProfile,
    Entity,
    Fact,
    Language,
    Lexeme,
    Psyche,
)
from app.models.identity import AppUser, SchemaExtension, Universe
from app.models.ledger import ExceptionRule, Proposal, RunTrace, Violation
from app.models.sandbox import Npc, NpcMemory, SandboxEvent
from app.models.story import Branch, Chapter, MemoryNode, PsycheDelta, StateSnapshot

__all__ = [
    "AppUser",
    "Base",
    "Branch",
    "Chapter",
    "ConstraintRule",
    "DialectProfile",
    "Entity",
    "ExceptionRule",
    "Fact",
    "Language",
    "Lexeme",
    "MemoryNode",
    "Npc",
    "NpcMemory",
    "Proposal",
    "Psyche",
    "PsycheDelta",
    "RunTrace",
    "SandboxEvent",
    "SchemaExtension",
    "StateSnapshot",
    "Universe",
    "Violation",
]
