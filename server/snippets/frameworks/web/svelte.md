## Svelte (framework only)

### Component Design
- Keep components small and focused on a single responsibility.
- Prefer composition over large, multi-purpose components.
- Keep logic simple and colocated unless it’s clearly reusable (then extract to a store or utility).

### Reactivity Model
- Use Svelte’s assignment-based reactivity (`x = newValue`) rather than manual update patterns.
- Prefer reactive declarations (`$:`) for derived values instead of manual synchronization.
- Keep reactive statements small and deterministic; avoid side effects inside `$:` when possible.

### State Management
- Keep state local to the component unless it must be shared.
- Use Svelte stores only for truly shared or cross-component state.
- Avoid large global stores when smaller, focused stores will do.

### Props & Data Flow
- Treat props as inputs; avoid mutating them directly.
- Prefer explicit event dispatching (`createEventDispatcher`) for child-to-parent communication.
- Keep data flow unidirectional and predictable.

### Stores
- Use writable stores for shared mutable state and derived stores for computed values.
- Avoid subscribing manually when `$store` auto-subscription works.
- Unsubscribe from manual subscriptions to prevent leaks.

### Async & Data Loading
- Keep data fetching and async logic consistent with the project’s existing pattern.
- Avoid scattering fetch logic across many components; centralize when appropriate.
- Handle loading and error states explicitly.

### DOM & Bindings
- Use `bind:` only when two-way binding is intentional and appropriate.
- Avoid excessive two-way bindings that obscure data flow.
- Prefer Svelte’s built-in event and binding mechanisms over manual DOM manipulation.

### Performance
- Avoid large reactive objects when only small parts change.
- Keep reactive dependencies narrow to prevent unnecessary updates.
- Use `{#each}` with stable identity (`key`) when list order or identity matters.

### Styling
- Prefer component-scoped styles by default.
- Follow the project’s styling approach (global CSS, Tailwind, etc.).
- Do not introduce a new styling or UI system unless explicitly requested.

### Consistency
- Match existing file structure, naming, and store patterns.
- Avoid introducing patterns from other frameworks (React-style state patterns, manual memoization, etc.).
