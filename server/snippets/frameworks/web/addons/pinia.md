## Pinia (addon only)

### When to Use Pinia
- Use Pinia for shared application state that spans multiple components or features.
- Keep local component-only state inside the component unless it is reused elsewhere.

### Store Design
- Prefer multiple small, domain-focused stores over a single global store.
- Keep store state minimal; avoid deeply nested structures that are hard to update and reason about.
- Do not duplicate derived data in state—use getters instead.

### State & Mutations
- Mutate state only through store actions; avoid direct state mutation from components unless the project explicitly allows it.
- Keep actions focused and domain-oriented rather than UI-driven.
- For updates that depend on previous state, perform the logic inside the action.

### Getters
- Use getters for derived or computed values.
- Keep getters pure and inexpensive; avoid heavy computation or side effects.
- Prefer getters over duplicating derived values in state.

### Async Logic
- Keep async operations inside actions rather than components.
- Model loading/error state explicitly if the store owns the request lifecycle.
- Avoid scattering fetch logic across many components; centralize it in the store or a service layer (follow project pattern).

### Store Usage in Components
- Prefer selecting only the specific state/getters needed rather than using the whole store.
- Avoid passing entire store instances deep into the component tree when only a few values/actions are required.

### Persistence & Plugins
- Use persistence or plugins only if the project already has an established pattern.
- Avoid persisting volatile, large, or sensitive state.

### Consistency
- Match existing conventions for store naming (`useXStore`), file organization, and composition style.
- Do not introduce alternative state libraries or reorganize store structure unless explicitly requested.
