## Redis (database only)

### Intended Use
- Treat Redis as an in-memory data store for:
  - caching
  - ephemeral/session data
  - queues, counters, rate limits, locks
- Do not treat Redis as the primary system of record unless the architecture explicitly requires it.

### Key Design
- Use clear, namespaced key patterns:
  - `app:domain:entity:id`
- Keep key naming consistent and predictable.
- Avoid unbounded key cardinality without a retention/expiration strategy.

### Expiration & Lifecycle
- Prefer setting TTLs for cache and ephemeral data.
- Always define expiration for data that should not live indefinitely.
- Avoid orphaned or stale keys.

### Data Structures
- Choose the appropriate structure for the access pattern:
  - Strings for simple values
  - Hashes for small objects
  - Lists/Streams for ordered data
  - Sets/Sorted Sets for membership/ranking
- Avoid storing large serialized blobs when fine-grained structures are more appropriate.

### Memory Discipline
- Keep values small; large objects increase latency and memory pressure.
- Be aware of total memory usage and eviction policies.
- Avoid patterns that cause unbounded growth (ever-growing lists, sets, etc.).

### Atomicity & Concurrency
- Use atomic commands where possible (INCR, SETNX, etc.).
- Use transactions (`MULTI/EXEC`) or Lua scripts only when atomic multi-step logic is required.
- Prefer optimistic, idempotent patterns over complex locking when possible.

### Caching Patterns
- Treat cache as disposable; application logic must tolerate cache misses.
- Use consistent cache keys and invalidation strategies.
- Avoid cache stampedes:
  - use short jittered TTLs
  - consider request coalescing patterns if needed.

### Persistence Considerations
- Understand the configured persistence mode (RDB, AOF, or none).
- Do not rely on Redis durability unless persistence and recovery requirements are explicitly configured.

### Performance
- Prefer pipelining or batching when performing multiple operations.
- Avoid large multi-key operations on hot paths.
- Be cautious with commands that scan the full keyspace (`KEYS`, large `SCAN` usage in request paths).

### Security
- Restrict network access to trusted environments.
- Use authentication and TLS where supported.
- Avoid storing secrets in plaintext unless required and protected appropriately.

### Backups & Recovery
- Ensure snapshot/AOF configuration aligns with data criticality.
- Treat Redis data loss as expected unless explicitly designed for durability.
