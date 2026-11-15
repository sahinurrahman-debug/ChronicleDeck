# ADR 0001: Postgres + pgvector for relational canon and vectors

- **Status:** accepted (pre-build)
- **Implemented:** schema pre-built; retrieval built live

## Context
Canon is relational (entities, facts, branches with ancestry) and episodic memory needs vector search
filtered by branch. Both need to answer a single query: "top-k scenes in this branch's ancestry".

## Decision
One Postgres 16 database with the `vector` extension. `memory_node.embedding` is `vector(1536)` with an
HNSW cosine index; branch ancestry is a recursive CTE joined to the vector query.

## Consequences
- Branch filtering and similarity run in one query, with no cross-store consistency to manage.
- One thing to deploy (Neon supports pgvector) and one thing to back up.
- Embedding dimension is fixed at 1536; changing model dimension needs a migration.
- Not a dedicated vector DB; fine at this scale, a re-evaluation point if a universe passes ~10⁶ nodes.
