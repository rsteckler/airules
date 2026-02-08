## Sequelize (SQL ORM) (ORM only)

### Model Definition
- Keep models focused and explicit (types, nullability, defaults).
- Avoid mixing lots of business logic into models unless that’s the established project pattern.
- Be intentional with naming conventions (table/column naming, timestamps) and match the repo’s setup.

### Associations
- Define associations explicitly and keep them minimal.
- Avoid overly complex association graphs that lead to huge includes and hard-to-debug queries.
- Be cautious with bidirectional associations; keep usage consistent.

### Query Shapes
- Prefer selecting only needed fields (`attributes`) rather than loading full rows by default.
- Use `include` intentionally; avoid deep nested includes that explode payload size and query complexity.
- For complex queries, prefer `sequelize.query` (raw SQL) only if that’s already accepted in the project; otherwise use scoped QueryInterface patterns.

### Transactions
- Use transactions for multi-step writes that must be atomic.
- Pass the transaction object explicitly through all ORM calls that participate.
- Keep transactions short; avoid network calls inside transactions.

### Migrations
- Use migration tooling consistently (Sequelize CLI or existing setup).
- Keep migrations small and incremental.
- Avoid ad-hoc schema changes that aren’t captured in migrations.

### Performance
- Watch for N+1 patterns; avoid per-row ORM calls in loops.
- Prefer bulk operations (`bulkCreate`, `update` with where clauses) when appropriate.
- Use indexes at the DB layer (handled elsewhere), but ensure query patterns can use them.

### Consistency
- Match existing conventions for model files, initialization, and connection management.
- Avoid introducing new patterns (e.g., switching between raw queries and model APIs) unless explicitly requested.
