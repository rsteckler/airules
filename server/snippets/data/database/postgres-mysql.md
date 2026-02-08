## Postgres / MySQL (database only)

### Schema & Data Modeling
- Prefer explicit schemas with clear ownership and boundaries per domain.
- Model relationships deliberately:
  - normalize for correctness
  - denormalize only for proven performance/query needs
- Use appropriate constraints: `PRIMARY KEY`, `UNIQUE`, `NOT NULL`, `CHECK`, and `FOREIGN KEY` where the domain requires it.

### Migrations
- Keep migrations small and reversible when possible.
- Avoid destructive operations (dropping columns/tables) without a safe rollout path.
- Prefer additive changes first (new columns/backfill/dual-write) for zero-downtime evolution.

### Indexing
- Add indexes to support real query patterns (not speculative).
- Index foreign keys and frequently filtered/sorted columns where appropriate.
- Avoid over-indexing; every index has write and storage cost.
- Use composite indexes when queries commonly filter on multiple columns in a stable order.

### Transactions & Consistency
- Use transactions for multi-step writes that must be atomic.
- Keep transactions short; avoid holding locks while doing network calls or heavy computation.
- Choose isolation/locking intentionally when dealing with concurrency and correctness.

### Query Performance
- Prefer set-based operations over row-by-row patterns.
- Watch out for N+1 query patterns at the application layer (even without an ORM, this can happen).
- Use `EXPLAIN` / `EXPLAIN ANALYZE` to validate performance when queries are slow.
- Avoid selecting unnecessary columns; fetch only what’s needed.

### Concurrency & Locking
- Understand lock behavior for writes and migrations.
- Avoid long-running migrations that lock hot tables.
- Use optimistic concurrency patterns where appropriate (e.g., version columns) when multiple writers are expected.

### Data Integrity
- Enforce integrity in the database where feasible (constraints), not only in application code.
- Treat the database as the final gatekeeper for correctness.
- Be explicit about cascading behavior (`ON DELETE`, `ON UPDATE`) rather than relying on defaults.

### Time, IDs, and Timestamps
- Store timestamps consistently (prefer UTC).
- Use clear conventions for created/updated timestamps.
- Choose ID strategy deliberately (serial/bigserial, UUID, ULID, etc.) and keep it consistent.

### Backups & Recovery
- Ensure backups exist and are restorable (verify restores periodically).
- Prefer point-in-time recovery if the operational environment supports it.
- Treat schema changes with the assumption you may need to roll back.

### Security
- Use least-privilege database users (read-only vs read-write vs admin).
- Avoid embedding secrets in code; use environment/secret management.
- Be mindful of SQL injection when constructing queries dynamically; always parameterize.

### Portability Notes (Postgres vs MySQL)
- Don’t assume identical SQL behavior:
  - JSON support, upsert syntax, transaction/locking semantics, and text collation can differ.
- Avoid relying on vendor-specific features unless the project explicitly targets that DB.
