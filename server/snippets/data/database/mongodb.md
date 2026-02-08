## MongoDB (database only)

### Data Modeling
- Model data based on **access patterns**, not normalization rules.
- Prefer embedding related data when it is:
  - read together
  - bounded in size
- Use references when:
  - relationships are large/unbounded
  - data changes independently
- Avoid deep or highly nested document structures that are hard to update or query.

### Schema Discipline
- Even though MongoDB is schema-flexible, enforce a **logical schema** at the application boundary.
- Keep field names consistent and stable.
- Avoid storing mixed types for the same field across documents.

### Indexing
- Create indexes based on actual query patterns.
- Index frequently filtered, sorted, or joined (`$lookup`) fields.
- Prefer compound indexes for multi-field queries in stable order.
- Avoid over-indexing; indexes increase write cost and storage.

### Query Performance
- Fetch only required fields using projections.
- Avoid unbounded collection scans on large collections.
- Use `explain()` to validate query plans for slow queries.
- Be cautious with `$regex`, `$lookup`, and aggregation stages that prevent index use.

### Document Size & Growth
- Keep documents well below the 16MB limit.
- Avoid patterns that cause documents to grow indefinitely (e.g., ever-growing arrays).
- Prefer time-bucket or separate collections for append-heavy data.

### Atomicity & Transactions
- Single-document operations are atomic by default—prefer designs that leverage this.
- Use multi-document transactions only when truly necessary; they add overhead.
- Keep transactions short and limited in scope.

### Concurrency & Writes
- Avoid write hotspots (e.g., constantly updating the same document).
- Prefer append or distributed write patterns when high write throughput is required.

### Schema Evolution
- Prefer additive changes (new fields with defaults).
- Handle missing fields gracefully in reads.
- Avoid destructive changes without a migration/backfill strategy.

### Data Integrity
- Use unique indexes where required by the domain.
- Enforce referential consistency at the application layer when using references.
- Validate and sanitize inputs; MongoDB queries must always be parameterized to avoid injection-like issues.

### Aggregation
- Use aggregation pipelines for server-side computation when it reduces data transfer.
- Keep pipelines simple and index-friendly.
- Avoid heavy, multi-stage pipelines in hot paths without performance validation.

### Sharding & Scaling (if applicable)
- Choose shard keys based on query patterns and write distribution.
- Avoid monotonic shard keys that create hotspots.
- Design collections with future sharding in mind if large scale is expected.

### Security
- Use least-privilege database users.
- Avoid storing secrets in plaintext.
- Ensure authentication and network access controls are enabled in production.

### Backups & Recovery
- Ensure backups are configured and periodically tested.
- Prefer point-in-time recovery where available.
- Treat schema/index changes as operational events with rollback planning.
