## SWR (addon only)

### When to Use SWR
- Use SWR for **server state** and remote data fetching.
- Do not use SWR for local UI state.
- Treat the SWR cache as the source of truth; avoid duplicating fetched data in local component state.

### Keys
- Use stable, deterministic keys.
- Include all request parameters in the key.
- Use `null` to conditionally disable fetching instead of guarding inside the fetcher.

### Fetchers
- Keep fetcher functions pure and focused on data retrieval.
- Move network logic into shared API/service utilities rather than defining fetchers inline.
- Ensure fetchers throw on errors so SWR can handle error state properly.

### Revalidation Behavior
- Respect existing project settings for:
  - `revalidateOnFocus`
  - `revalidateOnReconnect`
  - `refreshInterval`
- Do not globally disable revalidation without a clear reason.
- Avoid unnecessary manual `mutate` calls that trigger excessive refetching.

### Mutations & Cache Updates
- Use `mutate` intentionally:
  - Prefer revalidation (`mutate(key)`) for correctness.
  - Use optimistic updates only when the update is simple and reversible.
- Scope `mutate` calls to specific keys; avoid broad global invalidation.

### Component Integration
- Do not wrap SWR data in additional local state unless transformation or temporary UI state requires it.
- Handle loading and error states explicitly and consistently.
- Keep components focused on rendering; avoid embedding fetch logic beyond calling SWR hooks.

### Derived Data
- Perform lightweight transformations in the component or a helper function.
- Avoid expensive computations inside render; memoize only when necessary and consistent with project patterns.

### Conditional & Dependent Fetching
- Use key functions or `null` keys for dependent queries.
- Avoid chaining multiple SWR calls with manual sequencing when a single composed fetcher would suffice.

### Performance
- Avoid creating new key objects/functions on every render.
- Keep dependency values stable to prevent unnecessary revalidation.

### Consistency
- Match existing conventions for key structure, fetcher location, and global configuration.
- Do not introduce alternative data-fetching libraries or parallel caching layers unless explicitly requested.
