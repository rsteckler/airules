## Django ORM (SQL ORM) (ORM only)

### Query Discipline
- Prefer QuerySets as the primary interface; keep queries composable and readable.
- Fetch only what you need:
  - use `only()` / `values()` / `values_list()` when returning partial shapes is appropriate
- Avoid evaluating QuerySets early; keep laziness intact until needed.

### N+1 Avoidance
- Use `select_related` for single-valued relations (FK/OneToOne).
- Use `prefetch_related` for multi-valued relations (M2M/Reverse FK).
- Avoid per-row queries inside loops.

### Transactions
- Use `transaction.atomic()` for multi-step writes that must be atomic.
- Keep atomic blocks short; avoid external calls inside transactions.
- Be deliberate about locking (`select_for_update`) only when correctness requires it.

### Bulk Operations
- Prefer `bulk_create`, `bulk_update`, and `QuerySet.update()` for large write sets when appropriate.
- Be aware bulk operations bypass `save()` and signals; use intentionally.

### Migrations
- Use Django migrations for all schema changes.
- Keep migrations small and incremental.
- Avoid manual DB changes outside migrations.

### Model Methods & Managers
- Put reusable query logic in custom managers/querysets rather than duplicating filters everywhere.
- Keep model methods focused; avoid mixing persistence queries and unrelated business workflows unless that’s the project convention.

### Performance & Correctness
- Use `exists()` instead of fetching rows just to check presence.
- Use `count()` intentionally; avoid counting huge tables unnecessarily.
- Be mindful of `distinct()`, large joins, and heavy annotations in hot paths.

### Consistency
- Match existing project conventions for managers, queryset methods, and model organization.
- Avoid introducing alternative ORMs or data-access layers unless explicitly requested.
