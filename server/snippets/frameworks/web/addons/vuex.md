## Vuex (addon only)

### When to Use Vuex
- Use Vuex for shared, cross-component application state.
- Keep local UI-only state inside components unless it must be globally shared.

### Store Structure
- Follow the existing store organization (modules vs single store). Do not restructure without explicit request.
- Prefer domain-focused modules when modules are used.
- Keep state minimal and normalized; avoid deeply nested structures that are hard to update.

### State & Mutations
- Mutate state only through mutations; never modify store state directly from components.
- Keep mutations simple, synchronous, and predictable.
- Avoid putting business logic inside mutations; keep them as state transitions only.

### Actions
- Use actions for async operations and complex workflows.
- Keep actions focused on orchestration (API calls, sequencing, committing mutations).
- Handle loading/error state explicitly when the store owns the request lifecycle.
- Avoid duplicating fetch logic across components; centralize in actions or services.

### Getters
- Use getters for derived state instead of duplicating computed values in state.
- Keep getters pure and inexpensive.
- Avoid heavy computation or side effects inside getters.

### Component Integration
- Map only the state/getters/actions a component actually needs.
- Avoid binding entire modules or large state objects when only a few fields are required.
- Keep components unaware of internal store structure where possible.

### Namespacing
- Use namespaced modules if the project already follows that pattern.
- Keep action/mutation names consistent and domain-oriented.

### Persistence & Plugins
- Use plugins (persistence, logging, etc.) only if the project already has an established pattern.
- Avoid storing non-serializable or sensitive data in Vuex unless explicitly required.

### Consistency
- Match existing conventions for module layout, naming, and usage patterns.
- Do not introduce alternative state libraries or hybrid patterns unless explicitly requested.
