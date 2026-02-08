## SQLAlchemy (SQL ORM) (ORM only)

### ORM vs Core
- Follow the project’s chosen approach:
  - ORM (declarative models), or
  - SQLAlchemy Core (expression-based).
- Do not mix ORM and Core styles in the same area unless the project already does.

### Model Design (ORM)
- Keep models focused on persistence concerns.
- Define columns explicitly (types, nullability, indexes where applicable).
- Avoid embedding heavy business logic inside models unless that is the established pattern.
- Keep relationships minimal and intentional.

### Session Management
- Treat the Session as a unit-of-work.
- Do not create long-lived global sessions.
- Pass sessions explicitly through service/repository layers when that is the project pattern.
- Avoid implicit session usage.

### Query Discipline
- Select only required columns when possible; avoid loading full entities unnecessarily.
- Use explicit joins and loading strategies.
- Be intentional with relationship loading (`selectinload`, `joinedload`, etc.) to avoid N+1 queries.

### Transactions
- Use transaction boundaries for multi-step writes.
- Keep transactions short and deterministic.
- Avoid network or long-running operations inside a transaction.

### Performance
- Watch for N+1 patterns caused by lazy loading.
- Prefer bulk operations for large inserts/updates when appropriate.
- Avoid per-row ORM operations inside loops when set-based operations are possible.

### Migrations
- Use Alembic (or the project’s migration tool) for all schema changes.
- Keep migrations small and incremental.
- Avoid manual database changes outside the migration workflow.

### Raw SQL
- Use SQLAlchemy text/expressions instead of raw string concatenation.
- Parameterize all raw queries.
- Keep raw SQL localized to specific cases where the ORM/Core cannot express the query cleanly.

### Consistency
- Match existing project conventions for:
  - session lifecycle
  - model organization
  - query location (repositories/services)
- Avoid introducing alternative data-access patterns alongside SQLAlchemy unless explicitly requested.
