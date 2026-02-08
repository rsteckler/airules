## Svelte Stores (addon only)

### When to Use Stores
- Use stores only for state shared across multiple components.
- Keep component-local state inside components unless it must be shared.
- Prefer multiple small stores over a single global store.

### Store Types
- Use `writable` for shared mutable state.
- Use `readable` for externally driven or subscription-based state.
- Use `derived` for computed state instead of duplicating derived values in writable stores.

### State Design
- Keep store values simple and flat; avoid deeply nested objects that are hard to update.
- Do not store derived or duplicated data in writable stores.
- Prefer immutable-style updates when modifying nested structures to ensure predictable reactivity.

### Updates & Actions
- Centralize complex updates in helper functions rather than spreading update logic across components.
- For updates that depend on previous state, use the functional form:

    store.update(state => {
      // return new state
    });

- Avoid ad-hoc mutation of nested objects outside the store update function.

### Subscriptions
- Prefer Svelte’s `$store` auto-subscription inside components.
- When subscribing manually, always unsubscribe to prevent memory leaks.

### Async & Side Effects
- Keep async logic consistent with project patterns (inside store helpers or services).
- If the store owns the async lifecycle, model loading/error state explicitly.
- Avoid scattering fetch logic across many components.

### Store Scope & Lifecycle
- Define shared stores at module scope.
- Avoid creating global singleton stores unless the state is truly application-wide.
- For per-instance or scoped state, create store factories when appropriate.

### Persistence
- Use persistence (localStorage, etc.) only if the project already has a pattern.
- Avoid persisting large, volatile, or sensitive state.

### Consistency
- Match existing naming conventions, file organization, and store patterns.
- Do not introduce alternative state libraries or large custom store frameworks unless explicitly requested.
