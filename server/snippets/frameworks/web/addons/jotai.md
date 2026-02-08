## Jotai (addon only)

### Atom Design
- Prefer many small atoms over a few large “app state” atoms.
- Keep atom values minimal; avoid stuffing large nested objects into a single atom unless there’s a clear reason.
- Use derived atoms for computed state instead of duplicating derived values.

### Read/Write Patterns
- Prefer read-only derived atoms for computations.
- Prefer write atoms for encapsulating updates and multi-step state changes (centralize mutation logic).
- Avoid ad-hoc `setAtom` logic scattered across many components—push updates into write atoms when patterns repeat.

### Scope & Lifetime
- Keep atoms as local as practical:
  - Use component-local state when state isn’t shared.
  - Use a Provider scope if you need per-subtree isolated state (follow project pattern).
- Avoid creating atoms dynamically inside components unless you intentionally want per-instance state.

### Async Atoms
- Use async atoms (or suspense patterns) only if the project already uses them consistently.
- Keep async boundaries explicit; avoid chains of async atoms that are hard to debug.
- Model loading/error states clearly if not using suspense.

### Performance & Rerenders
- Prefer selecting the smallest atom(s) a component needs.
- Avoid creating derived atoms inline on every render; define atoms at module scope.
- Be mindful of derived atoms that depend on broad state; keep dependencies narrow.

### Atom Composition
- Prefer atom families/utilities only when you need keyed sets of atoms (follow existing pattern).
- Avoid creating complex “frameworks” around atoms; keep composition straightforward.

### Consistency
- Match existing conventions for atom naming, file layout, and provider usage.
- Do not introduce new Jotai patterns (families, atoms-in-atoms, custom stores) unless explicitly requested.
