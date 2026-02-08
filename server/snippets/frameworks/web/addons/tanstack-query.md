## TanStack Query (addon only)

### When to Use TanStack Query
- Use TanStack Query for **server state** (data that lives on the server).
- Do not use it for local UI state or client-only state.
- Treat the cache as the source of truth for server data; avoid duplicating it in local state.

### Query Keys
- Use stable, structured query keys (arrays, not strings).
- Include all parameters that affect the request in the key.
- Keep key structure consistent across the project.

### Data Fetching
- Keep query functions pure and focused on fetching data.
- Move request logic into shared API/service functions rather than inline in components.
- Avoid duplicate queries for the same resource; reuse query keys.

### Mutations
- Use `useMutation` for server-side writes.
- After mutations, update cache intentionally:
  - Prefer `invalidateQueries` for correctness.
  - Use `setQueryData` only when the update is simple and deterministic.
- Avoid refetch storms by invalidating only the necessary keys.

### Cache & Freshness
- Respect existing `staleTime` and `cacheTime` patterns.
- Do not globally disable caching or force refetching without a clear reason.
- Prefer increasing `staleTime` over excessive refetching when data is relatively stable.

### Component Integration
- Keep components focused on rendering; avoid embedding fetch logic beyond calling hooks.
- Do not wrap query data in additional local state unless transformation requires it.
- Handle loading and error states explicitly and consistently with project patterns.

### Derived Data
- Prefer the `select` option for lightweight data transformation instead of computing in render.
- Keep transformations inexpensive and pure.

### Performance
- Avoid creating new query keys or options objects on every render unless necessary.
- Use conditional queries (`enabled`) instead of manual guards inside fetch functions.

### Pagination & Infinite Data
- Follow existing project patterns for pagination or infinite queries.
- Keep page parameters in query keys or query state, not external component state.

### Consistency
- Match existing conventions for query key structure, hook naming, and service layer usage.
- Do not introduce alternative data-fetching libraries or caching layers unless explicitly requested.
