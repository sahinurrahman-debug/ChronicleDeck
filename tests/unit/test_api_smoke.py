"""DB-free smoke tests for the pre-built API surface."""

import pytest
from app.main import app
from app.routers.live import LIVE_ROUTES
from fastapi.testclient import TestClient

client = TestClient(app)


def test_health() -> None:
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}


@pytest.mark.parametrize("path", ["/universes", "/auth/me"])
def test_protected_routes_require_auth(path: str) -> None:
    assert client.get(path).status_code == 401


def test_bad_token_is_rejected() -> None:
    res = client.get("/auth/me", headers={"Authorization": "Bearer not-a-token"})
    assert res.status_code == 401


def test_register_validates_input_before_touching_the_db() -> None:
    res = client.post("/auth/register", json={"email": "nope", "password": "short"})
    assert res.status_code == 422


def test_openapi_exposes_the_full_route_contract() -> None:
    paths = client.get("/openapi.json").json()["paths"]
    for method, path, _ in LIVE_ROUTES:
        assert method.lower() in paths[path], f"{method} {path} missing from OpenAPI"
    # a few pre-built CRUD routes
    assert "/universes/{universe_id}/entities" in paths
    assert "/universes/{universe_id}/proposals" in paths
    assert "/entities/{entity_id}/psyche" in paths


@pytest.mark.parametrize(("method", "path", "_what"), LIVE_ROUTES)
def test_live_build_routes_are_honest_stubs(method: str, path: str, _what: str) -> None:
    concrete = path.replace("{", "").replace("}", "")  # path params are untyped on the stubs
    res = client.request(method, concrete)
    assert res.status_code == 501
    assert "Built live" in res.json()["detail"]


def test_lexeme_register_alias_roundtrips() -> None:
    """`register` is a DB column but collides with ABCMeta.register; the DTO aliases it."""
    from app.schemas.bible import LexemeCreate

    dto = LexemeCreate.model_validate({"form": "vael", "gloss": "ash-oath", "register": "formal"})
    assert dto.model_dump(by_alias=True)["register"] == "formal"


def test_proposals_cannot_be_edited_or_deleted_via_crud() -> None:
    """Ledger rule: generated content only creates proposals; decisions go through accept/reject."""
    paths = client.get("/openapi.json").json()["paths"]
    item = paths["/universes/{universe_id}/proposals/{item_id}"]
    assert set(item) == {"get"}
