## Hibernate (SQL ORM) (ORM only)

### Entity Design
- Keep entities focused on persistence concerns.
- Define mappings explicitly (column types, nullability, relationships, fetch strategy).
- Avoid embedding complex business workflows inside entity lifecycle methods unless that is the established project pattern.

### Fetch Strategy
- Default to `LAZY` loading for associations.
- Use `JOIN FETCH` or entity graphs when related data is actually needed.
- Avoid broad eager loading that pulls large object graphs unintentionally.

### N+1 Avoidance
- Be aware of lazy loading inside loops.
- Use `JOIN FETCH`, batch fetching, or projections to avoid N+1 query patterns.
- Prefer fetching the correct shape once rather than triggering many secondary queries.

### Query Discipline
- Use typed queries (JPQL, Criteria, or repository abstractions) where possible.
- Select only required fields when full entities are not needed (DTO/projection queries).
- Keep complex queries localized and readable.

### Transactions
- Ensure database operations occur within proper transactional boundaries.
- Keep transactions short and deterministic.
- Avoid network or long-running operations inside transactions.

### Persistence Context Awareness
- Understand entity state (transient, managed, detached).
- Avoid unintended updates caused by dirty checking.
- Use `detach`, `clear`, or read-only queries when large read operations should not pollute the persistence context.

### Batch & Bulk Operations
- Prefer bulk JPQL updates/deletes for large data changes.
- For batch inserts/updates, configure batching and periodically flush/clear the session to control memory usage.
- Avoid per-entity persistence operations in large loops without batching.

### Migrations
- Use the project’s migration tool (e.g., Flyway/Liquibase); avoid relying on `hibernate.hbm2ddl.auto` outside development.
- Keep schema evolution controlled and incremental.

### Consistency
- Follow existing project conventions for:
  - repository pattern / data access layer
  - transaction management
  - entity organization
- Avoid introducing alternative persistence frameworks or patterns alongside Hibernate unless explicitly requested.
