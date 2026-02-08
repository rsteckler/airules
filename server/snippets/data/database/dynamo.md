## DynamoDB (database only)

### Access-Pattern First Design
- Design tables around **access patterns**, not relational normalization.
- Define the required read/write queries first, then model keys to support them efficiently.
- Avoid ad-hoc queries or scans in hot paths.

### Primary Key Design
- Choose partition keys to distribute traffic evenly; avoid hot partitions.
- Use composite keys (partition + sort) to support range queries and hierarchical access.
- Avoid monotonically increasing partition keys (timestamps, sequences) without a sharding/bucketing strategy.

### Single-Table vs Multi-Table
- Follow the project’s chosen approach (single-table or multi-table); do not mix patterns without intent.
- If single-table design is used:
  - use clear entity prefixes/types
  - keep item shapes predictable and documented.

### Indexing (GSIs / LSIs)
- Create GSIs only for known access patterns.
- Treat each GSI as a separate cost and operational surface.
- Avoid over-indexing; each write updates all indexed attributes.
- Ensure indexed attributes have stable, consistent types.

### Query vs Scan
- Always prefer `Query` over `Scan`.
- Avoid full table scans in production paths.
- If scans are unavoidable, use pagination and limit scope.

### Item Size & Shape
- Keep items small and focused; large items increase latency and cost.
- Avoid unbounded lists/maps that grow indefinitely.
- Prefer time-bucket or item-per-event patterns for append-heavy data.

### Consistency
- Use eventually consistent reads by default.
- Use strongly consistent reads only when correctness requires it.
- Be explicit about consistency expectations in critical workflows.

### Transactions & Atomicity
- Prefer single-item atomic operations when possible.
- Use conditional writes (`ConditionExpression`) for optimistic concurrency and uniqueness guarantees.
- Use transactions sparingly; they increase latency and cost.

### Time & TTL
- Store timestamps in a consistent format (typically epoch seconds or ISO UTC).
- Use TTL for lifecycle management of ephemeral data when appropriate.
- Design access patterns so expired items don’t impact hot queries.

### Capacity & Performance
- Choose on-demand vs provisioned capacity intentionally based on traffic predictability.
- Monitor and avoid hot partitions (uneven key distribution).
- Use batching (`BatchGetItem`, `BatchWriteItem`) when appropriate to reduce network overhead.

### Schema Evolution
- Prefer additive changes; handle missing attributes gracefully.
- Avoid destructive changes without a migration/backfill plan.
- Keep attribute naming consistent and stable.

### Data Integrity
- Use conditional expressions to enforce uniqueness and state transitions.
- Treat DynamoDB as the system of record for invariants that matter.

### Security
- Use least-privilege IAM policies.
- Avoid storing secrets in plaintext.
- Encrypt sensitive data when required by the domain.

### Backups & Recovery
- Enable point-in-time recovery (PITR) for critical tables.
- Treat table/index changes as operational events with rollback planning.
