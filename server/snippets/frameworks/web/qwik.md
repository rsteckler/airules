## Qwik (framework only)

### Core Mental Model
- Optimize for resumability: minimize client-side JS and avoid unnecessary eager code.
- Prefer server-first execution; only move logic client-side when interaction truly requires it.

### `$` and Serialization
- Mark event handlers and lazy code with `$` (e.g., `onClick$`, `useTask$`, `useVisibleTask$`) so Qwik can serialize and resume correctly.
- Keep closures used by `$` handlers serializable:
  - Avoid capturing non-serializable values (DOM nodes, class instances, large objects).
  - Prefer passing ids/primitive data and re-deriving from stores/resources.

### State
- Prefer `useStore` for reactive state that needs fine-grained tracking.
- Use `useSignal` for simple scalar values or refs.
- Keep stores small and local; avoid one giant global store.

### Effects / Tasks
- Use `useTask$` for reactive side effects that can run on server or client.
- Use `useVisibleTask$` for browser-only work (DOM, window APIs) that should run after visibility.
- Keep tasks narrowly scoped; avoid broad dependency reads that trigger unnecessary re-runs.

### Components & Boundaries
- Keep components small and responsibility-focused.
- Minimize Client-side boundaries; don’t import heavy client-only libraries unless required.
- Prefer Qwik-friendly libraries; avoid React-specific assumptions.

### Data Loading
- Prefer route loaders (`routeLoader$`) and actions (`routeAction$`) for data fetching and mutations.
- Keep loaders/actions thin and delegate to service modules.
- Validate all external input in actions; treat client input as untrusted.

### Routing & Navigation
- Use Qwik City routing conventions; keep route modules simple and compose UI from components.
- Prefer declarative navigation patterns consistent with the project.

### Performance
- Avoid shipping large JSON blobs to the client; keep props/state minimal.
- Don’t do expensive computations in render; move derivations into signals/stores or server loaders.

### Styling & UI Libraries
- Follow the project’s styling conventions.
- Do not introduce new styling/UI libraries unless explicitly requested.

### Consistency
- Match existing file structure and conventions for loaders/actions, component naming, and shared utilities.
- Avoid patterns that defeat resumability (heavy client-only initialization, large captured closures).
