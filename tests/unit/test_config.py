import pytest
from app.config import Settings
from pydantic import ValidationError

GOOGLE_LINEAGE = ("gemini", "gemma")


def _clean() -> Settings:
    return Settings(_env_file=None)


def test_judges_are_never_google_lineage() -> None:
    """Cross-family rule (ADR 0004): Gemini generates, so neither judge may be Gemini or Gemma."""
    s = _clean()
    for model in (s.judge_model, s.judge_fallback_model):
        assert not any(tag in model.lower() for tag in GOOGLE_LINEAGE), model


def test_enhancer_is_off_until_a_model_is_configured() -> None:
    """No tuned model exists yet; an empty creative_model means the enhance stage is skipped."""
    s = _clean()
    assert s.creative_model == ""
    assert s.creative_backend == "adaption"


def test_creative_backend_rejects_unknown_values() -> None:
    with pytest.raises(ValidationError):
        Settings(_env_file=None, creative_backend="somewhere-else")  # type: ignore[arg-type]
