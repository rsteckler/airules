## Supabase (database only)

### Mental Model
- Treat Supabase as **Postgres with managed services** (Auth, Storage, Realtime, Edge).
- Design data using standard Postgres principles; avoid vendor-specific coupling unless the project explicitly relies on Supabase features.

### Schema & SQL Discipline
- Use explicit schemas, constraints, and indexes just as you would in Postgres.
- Prefer database-enforced integrity (`NOT NULL`, `UNIQUE`, `FOREIGN KEY`, `CHECK`) over application-only validation.
- Keep schema changes additive and migration-based.

### Row Level Security (RLS)
- Enable and use RLS intentionally for any client-accessible tables.
- Default-deny: policies should explicitly allow only what is needed.
- Keep policies simple, readable, and testable.
- Avoid complex or expensive logic inside policies.

### Auth Integration
- Use `auth.uid()` and related helpers in RLS policies for user scoping.
- Do not trust client-provided user identifiers; rely on Supabase auth context.
- Keep authorization rules in the database where appropriate, not duplicated in application logic.

### Data Access Patterns
- Prefer server-side logic for privileged operations; avoid exposing broad table access to clients.
- Limit client queries to scoped, indexed access patterns.
- Avoid large unbounded queries from the client.

### Indexing & Performance
- Add indexes for fields used in RLS conditions, filters, and joins.
- Use `EXPLAIN ANALYZE` for slow queries.
- Be mindful that complex RLS policies run on every query and can impact performance.

### Realtime (if used)
- Enable Realtime only for tables/events that truly need it.
- Avoid broadcasting high-frequency or large payload changes.
- Design subscriptions around specific rows or user scopes where possible.

### Storage (if used)
- Use bucket policies aligned with the same least-privilege model as RLS.
- Avoid public buckets unless content is truly public.
- Store metadata in Postgres rather than encoding business logic into file paths.

### Functions & Triggers
- Use Postgres functions/triggers for data integrity and side effects when appropriate.
- Keep trigger logic simple and deterministic.
- Avoid heavy or long-running work inside triggers.

### Schema Evolution
- Prefer additive changes and backfills.
- Avoid destructive changes without a safe rollout plan.
- Keep client-facing contracts stable.

### Security
- Use service role keys only in trusted server environments.
- Never expose service role credentials to clients.
- Treat anon keys as public and rely on RLS for protection.

### Backups & Recovery
- Ensure backups and point-in-time recovery are enabled.
- Treat schema changes and policy changes as operational events with rollback planning.
