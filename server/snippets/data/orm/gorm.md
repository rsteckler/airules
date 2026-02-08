## GORM (SQL ORM) (ORM only)

### Model Design
- Keep models simple and focused on persistence.
- Use explicit struct tags for column names, indexes, constraints, and relationships.
- Avoid embedding complex business logic inside model methods unless that is the established project pattern.

### Query Discipline
- Always check errors returned from GORM operations.
- Select only required fields when possible (`Select`) instead of loading full records by default.
- Avoid chaining large dynamic query builders that become hard to read; keep queries explicit and localized.

### Associations
- Load relations intentionally using `Preload`; avoid unnecessary eager loading.
- Avoid deep or broad preload trees that significantly increase query size and memory usage.
- Be explicit about association writes (`Select`, `Omit`) to prevent accidental updates.

### Transactions
- Use `db.Transaction(func(tx *gorm.DB) error { ... })` for multi-step atomic operations.
- Keep transactions short and deterministic.
- Do not perform network or long-running work inside transactions.

### Bulk Operations
- Prefer batch operations (`CreateInBatches`, `Updates` with conditions) instead of per-row operations in loops.
- Avoid loading records just to update them when set-based updates are possible.

### Migrations
- Use a consistent migration strategy (AutoMigrate or external tooling) aligned with the project.
- Avoid relying on `AutoMigrate` for production schema evolution unless that is the established pattern.
- Keep schema changes controlled and incremental.

### Performance
- Watch for hidden N+1 patterns caused by iterative queries.
- Use `Limit`, pagination, and indexed query fields for large datasets.
- Avoid full table scans in hot paths.

### Consistency
- Follow existing project conventions for:
  - DB initialization and connection lifecycle
  - model organization
  - repository/service layering (if present)
- Do not introduce alternative data-access patterns alongside GORM unless explicitly requested.
