"""Route contract for everything built during the live window.

These endpoints exist so the frontend, docs and OpenAPI schema agree on the surface from hour 0.
Every one returns 501 until its implementation lands; none of them contains logic.
"""

from collections.abc import Awaitable, Callable

from fastapi import APIRouter, HTTPException, status

router = APIRouter(tags=["live-build"])

# (method, path, what gets built here)
LIVE_ROUTES: list[tuple[str, str, str]] = [
    ("POST", "/universes/{universe_id}/compile", "Canon compiler: notes or file -> proposals (job)"),
    ("POST", "/proposals/{proposal_id}/accept", "Ledger: accept a proposal into canon"),
    ("POST", "/proposals/{proposal_id}/reject", "Ledger: reject a proposal"),
    ("POST", "/branches", "Fork a branch with snapshot inheritance"),
    ("POST", "/chapters/{chapter_id}/generate", "SSE: plan -> draft -> enhance -> verdicts"),
    ("POST", "/chapters/{chapter_id}/validate", "Re-run checks on author-edited text"),
    ("POST", "/violations/{violation_id}/fix", "Span-level repair"),
    ("POST", "/violations/{violation_id}/intentional", "Record an exception rule"),
    ("GET", "/universes/{universe_id}/compare", "What-if: world diff, relationships, arcs"),
    ("GET", "/chapters/{chapter_id}/score", "Continuity score + evidence list"),
    ("POST", "/sandbox/{universe_id}/event", "Drop an event, get NPC reactions as proposals"),
    ("GET", "/runs/{chapter_id}/trace", "Tokens per slot, cost, latency"),
]


def _stub(what: str) -> Callable[[], Awaitable[None]]:
    async def handler() -> None:
        raise HTTPException(status.HTTP_501_NOT_IMPLEMENTED, f"Built live: {what}")

    return handler


for _method, _path, _what in LIVE_ROUTES:
    router.add_api_route(
        _path,
        _stub(_what),
        methods=[_method],
        summary=f"[live build] {_what}",
        status_code=status.HTTP_501_NOT_IMPLEMENTED,
    )
