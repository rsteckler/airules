## MobX (addon only)

### When to Use MobX
- Use MobX for state that benefits from reactive derivations and observable graphs.
- Keep purely local UI state in components unless shared across the app.

### State Modeling
- Prefer small, domain-focused stores over one global store.
- Keep observable state minimal; derive everything else with `computed`.
- Avoid deeply nested observable graphs unless there’s a clear need.

### Actions & Mutation
- Mutate observable state only inside actions:
  - Use `action`/`makeAutoObservable` patterns consistent with the codebase.
  - Use `runInAction` for async flows to batch updates.
- Avoid “hidden” mutation from arbitrary helper functions; keep mutation paths explicit.

### Computeds
- Use `computed` for derived values; keep them pure and deterministic.
- Avoid expensive computations in `computed` without caching/structuring; keep dependencies narrow.

### Async & Side Effects
- Keep side effects (network calls, timers, subscriptions) outside of `computed`.
- For async actions:
  - model request state explicitly if needed (loading/error)
  - update observables within an action boundary (`runInAction`).

### React Integration
- Use `observer` only where reactivity is needed; avoid wrapping large subtrees unnecessarily.
- Keep component reads narrow: read only the observable fields the component actually needs.
- Avoid passing whole store objects through many layers when a few values/actions suffice.

### Observability Choices
- Prefer plain data (POJOs) for state; avoid storing complex class instances unless the project is built around class stores.
- Avoid making everything observable “just in case.” Only observable state that changes and is observed.

### Debuggability
- Keep store APIs explicit: methods for mutations, computeds for derived.
- Avoid overly dynamic patterns that make change sources hard to trace.

### Consistency
- Match existing MobX configuration (`enforceActions`, decorators vs makeAutoObservable, etc.).
- Do not mix multiple MobX patterns in the same codebase unless it’s already established.
