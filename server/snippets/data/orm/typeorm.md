## TypeORM (SQL ORM) (ORM only)

### Entity Design
- Keep entities focused and stable; avoid mixing persistence concerns with complex domain logic unless that’s the established pattern.
- Prefer explicit column types/options; don’t rely on defaults when it affects portability or correctness.
- Avoid deep bidirectional relations unless needed; they increase complexity and surprise loads.

### Data Access Patterns
- Prefer repositories (or a thin data-access layer) over using the global manager everywhere.
- Keep query shapes explicit; avoid loading full entity graphs by default.
- Be intentional with eager vs lazy relations; avoid accidental query storms.

### QueryBuilder vs Repository APIs
- Use Repository APIs for simple CRUD.
- Use QueryBuilder for complex filtering/joins/aggregations—keep QueryBuilder usage readable and localized.

### Migrations
- Prefer migration-based schema evolution; avoid relying on `synchronize: true` in real environments.
- Keep migrations small and incremental.
- Avoid manual DB changes that aren’t reflected in migrations.

### Transactions
- Use transactional boundaries for multi-step writes that must be atomic.
- Keep transactions short; avoid network calls within a transaction.
- Prefer passing a transactional `EntityManager` explicitly to functions that participate in the transaction.

### Performance
- Watch for N+1 queries; use joins or relation loading intentionally.
- Avoid per-row operations in loops when set-based operations are available.

### Consistency
- Match existing project patterns for:
  - DataSource initialization
  - entity/repository layout
  - naming strategy
- Avoid introducing new patterns (ActiveRecord vs DataMapper) unless explicitly requested.
