"""Story bible DTOs: entities, facts, rules, languages, lexemes, psyche and dialect rows."""

import uuid
from typing import Any

from pydantic import BaseModel, ConfigDict, Field

from app.schemas.common import CanonStatus, ORMModel, Severity


class EntityCreate(BaseModel):
    type: str = Field(min_length=1)
    name: str = Field(min_length=1)
    attrs: dict[str, Any] = Field(default_factory=dict)
    status: CanonStatus = "proposed"


class EntityUpdate(BaseModel):
    type: str | None = None
    name: str | None = None
    attrs: dict[str, Any] | None = None
    status: CanonStatus | None = None


class EntityOut(ORMModel):
    id: uuid.UUID
    universe_id: uuid.UUID
    type: str
    name: str
    attrs: dict[str, Any]
    status: CanonStatus


class FactCreate(BaseModel):
    subject_id: uuid.UUID
    predicate: str
    object: str
    source_ref: str | None = None
    status: CanonStatus = "proposed"
    valid_from_chapter: int = Field(default=0, ge=0)
    branch_scope: uuid.UUID | None = None


class FactUpdate(BaseModel):
    predicate: str | None = None
    object: str | None = None
    source_ref: str | None = None
    status: CanonStatus | None = None
    valid_from_chapter: int | None = Field(default=None, ge=0)


class FactOut(ORMModel):
    id: uuid.UUID
    universe_id: uuid.UUID
    subject_id: uuid.UUID
    predicate: str
    object: str
    source_ref: str | None
    status: CanonStatus
    valid_from_chapter: int
    branch_scope: uuid.UUID | None


class RuleCreate(BaseModel):
    entity_id: uuid.UUID | None = None
    kind: str
    rule_text: str
    rule_json: dict[str, Any] = Field(default_factory=dict)
    severity: Severity = "warn"


class RuleUpdate(BaseModel):
    kind: str | None = None
    rule_text: str | None = None
    rule_json: dict[str, Any] | None = None
    severity: Severity | None = None


class RuleOut(ORMModel):
    id: uuid.UUID
    universe_id: uuid.UUID
    entity_id: uuid.UUID | None
    kind: str
    rule_text: str
    rule_json: dict[str, Any]
    severity: Severity


class LanguageCreate(BaseModel):
    name: str
    phonotactics: dict[str, Any] = Field(default_factory=dict)
    morphology: dict[str, Any] = Field(default_factory=dict)
    word_order: str | None = None


class LanguageUpdate(BaseModel):
    name: str | None = None
    phonotactics: dict[str, Any] | None = None
    morphology: dict[str, Any] | None = None
    word_order: str | None = None


class LanguageOut(ORMModel):
    id: uuid.UUID
    universe_id: uuid.UUID
    name: str
    phonotactics: dict[str, Any]
    morphology: dict[str, Any]
    word_order: str | None


# The column is called `register` (linguistic register), which collides with ABCMeta.register on
# pydantic models. The DTO attribute is `register_`; the wire name stays `register` via the alias,
# so routes dump with by_alias=True before handing the dict to the ORM.
class LexemeCreate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    form: str
    gloss: str
    pos: str | None = None
    register_: str | None = Field(default=None, alias="register")
    status: CanonStatus = "proposed"


class LexemeUpdate(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    gloss: str | None = None
    pos: str | None = None
    register_: str | None = Field(default=None, alias="register")
    status: CanonStatus | None = None


class LexemeOut(ORMModel):
    model_config = ConfigDict(from_attributes=True, populate_by_name=True)

    id: uuid.UUID
    language_id: uuid.UUID
    form: str
    gloss: str
    pos: str | None
    register_: str | None = Field(default=None, alias="register")
    status: CanonStatus


class PsycheIn(BaseModel):
    traits: dict[str, Any] = Field(default_factory=dict)
    values: list[Any] = Field(default_factory=list)
    wounds: list[Any] = Field(default_factory=list)
    goals: list[Any] = Field(default_factory=list)
    beliefs: list[Any] = Field(default_factory=list)
    constraints: list[Any] = Field(default_factory=list)
    arc: dict[str, Any] = Field(default_factory=dict)


class PsycheOut(PsycheIn, ORMModel):
    id: uuid.UUID
    entity_id: uuid.UUID


class DialectIn(BaseModel):
    base_language_id: uuid.UUID | None = None
    phonology: list[Any] = Field(default_factory=list)
    lexicon: dict[str, Any] = Field(default_factory=dict)
    grammar: list[Any] = Field(default_factory=list)
    discourse: list[Any] = Field(default_factory=list)
    register_map: dict[str, Any] = Field(default_factory=dict)
    code_switch: list[Any] = Field(default_factory=list)
    intensity: float = Field(default=0.5, ge=0, le=1)


class DialectOut(DialectIn, ORMModel):
    id: uuid.UUID
    entity_id: uuid.UUID
