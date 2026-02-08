## SolidJS (framework only)

### Reactivity Model
- Treat Solid as fine-grained reactivity, not “React-but-faster.”
- Use `createSignal` for scalar state and `createStore` only when you truly need nested/structured reactive state.
- Avoid copying React patterns like heavy memoization; Solid tracks dependencies automatically.

### Data Derivation
- Prefer `createMemo` for derived values instead of recomputing in JSX.
- Keep memos pure and deterministic; avoid side effects inside `createMemo`.

### Effects
- Use `createEffect` for side effects and synchronization only.
- Keep effects small and narrowly dependent; avoid “god effects.”
- Be explicit about what the effect depends on by reading signals inside it.
- Clean up resources (listeners, timers, subscriptions) using `onCleanup`.

### Components & Props
- Keep components small and responsibility-focused.
- Prefer passing signals/accessors (functions) when the consumer needs reactive reads; pass plain values when snapshots are sufficient.
- Be careful not to destructure props in a way that breaks reactivity:
  - Prefer `props.x` reads or `splitProps` for stable usage.

### Control Flow
- Prefer Solid control-flow components:
  - `<Show>` instead of `&&` when readability benefits
  - `<For>` for lists
  - `<Switch>/<Match>` for multi-branch rendering
- Always use stable keys for lists when identity matters; avoid index-based identity.

### Async & Resources
- Use `createResource` for async data where it fits the project’s patterns.
- Keep resource fetching logic centralized (services) when possible; avoid sprinkling fetch calls across UI.
- Handle loading and error states explicitly in the UI.

### Performance
- Avoid wrapping everything in `createMemo`/`createEffect`; use them where they clarify dataflow.
- Keep reactive graph small and local; avoid turning large objects into reactive stores if only a few fields change.

### DOM & Refs
- Prefer Solid’s direct DOM bindings and refs (`ref={el => ...}`) for imperative needs.
- Ensure cleanup for any imperative DOM work or subscriptions.

### Styling & Libraries
- Follow the project’s established styling approach (CSS modules, Tailwind, etc.).
- Do not introduce new styling/UI libraries unless explicitly requested.

### Consistency
- Match existing patterns for file structure, component naming, and shared utilities.
- Avoid importing React-specific libraries/patterns into Solid code.
