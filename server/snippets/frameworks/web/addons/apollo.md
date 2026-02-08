## Apollo Client (addon only)

### When to Use Apollo
- Use Apollo for **GraphQL server state** only.
- Do not use Apollo cache for local UI state unless the project explicitly does so.
- Treat the Apollo cache as the source of truth for GraphQL data; avoid duplicating it in component state.

### Queries
- Keep queries colocated with the feature or component that owns the data.
- Fetch only the fields that are actually used; avoid overfetching.
- Prefer fragments for shared field selections to keep queries consistent.
- Keep query documents static; avoid building queries dynamically at runtime.

### Mutations
- Use `useMutation` for server writes.
- After mutations, update the cache intentionally:
  - Prefer `refetchQueries` when correctness is more important than optimization.
  - Use `cache.modify` or `writeQuery` only when the update is simple and predictable.
- Avoid broad or unnecessary refetching.

### Cache Design
- Ensure entities have stable identifiers (`id` / `__typename`) so normalization works correctly.
- Avoid storing derived or duplicated data in the cache.
- Respect existing cache configuration (type policies, field policies, merge strategies).

### Component Integration
- Do not wrap query results in local state unless transformation or UI-only state requires it.
- Handle loading and error states explicitly and consistently with project patterns.
- Keep components focused on rendering; move data transformation into `select`-style helpers or fragments when possible.

### Pagination & Lists
- Follow existing pagination patterns (cursor/offset and associated cache policies).
- Do not implement manual list merging if the project already defines type policy merge functions.

### Performance
- Avoid triggering unnecessary re-renders by keeping variables stable.
- Do not create new options/variables objects on every render unless values actually change.
- Use `skip` or conditional variables instead of running queries that immediately no-op.

### Consistency
- Match existing conventions for query placement, fragment usage, and cache update patterns.
- Do not introduce alternative GraphQL clients or parallel caching layers unless explicitly requested.
