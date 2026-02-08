## Recoil (addon only)

### Atoms & Selectors
- Prefer small, focused atoms over large “app state” atoms.
- Use selectors for derived/computed state instead of duplicating derived values in atoms.
- Keep selectors pure and deterministic; no side effects inside selectors.

### Keys & Organization
- Keys must be stable and unique; follow the project’s naming convention for keys.
- Centralize atom/selector definitions in predictable modules; avoid defining them inline in components.

### Read/Write Patterns
- Prefer `useRecoilValue` for reads and `useSetRecoilState` for writes when you don’t need the current value.
- Prefer `useRecoilCallback` for multi-step updates that need access to multiple atoms/selectors.
- Avoid scattering complex update logic across components; encapsulate repeated patterns.

### Atom Families
- Use `atomFamily` / `selectorFamily` for keyed collections of similar state.
- Keep family parameters serializable and stable.
- Avoid unbounded growth: ensure there’s a clear lifecycle for parameterized state (especially in long-lived sessions).

### Async State
- Use async selectors only if the project already uses them consistently (and understands the UX implications).
- Keep async boundaries explicit; avoid deep chains of async selectors that are hard to debug.
- Model loading/error behavior consistently with existing project patterns.

### Performance & Rerenders
- Read the smallest set of atoms/selectors needed per component.
- Avoid selectors that depend on broad state and recompute frequently; keep dependencies narrow.
- Prefer splitting state by concern rather than bundling into one atom.

### Persistence & Side Effects
- Avoid adding persistence layers unless the project already has a pattern for it.
- Do not store non-serializable values in atoms (DOM nodes, class instances, etc.) unless the project explicitly does so.

### Consistency
- Match existing usage patterns (hooks, families, async handling, state colocation).
- Do not introduce new global state structures or reorganize Recoil state without explicit request.
