## Vue (framework only)

### Component Design
- Keep components small and responsibility-focused; split by UI responsibility.
- Prefer composition over deep inheritance/mixins; avoid mixins unless the project already relies on them.
- Keep props as the primary input contract; avoid hidden coupling through globals.

### Composition API vs Options API
- Follow the project’s existing style (Composition API or Options API). Do not migrate styles as part of unrelated work.
- If using Composition API:
  - Prefer `ref` for primitives and `reactive` for objects when it improves clarity.
  - Keep `setup()` readable; extract logic into composables when it grows.

### State & Reactivity
- Keep reactive state minimal; derive computed state with `computed`.
- Avoid duplicating source-of-truth data across multiple refs/reactives.
- Be careful with deep reactivity; avoid making huge objects reactive if only small parts change.
- Avoid mutating props; emit events or use state/store patterns.

### Effects & Watches
- Prefer `computed` over `watch` when deriving values.
- Use `watch` for side effects, synchronization, and async reactions only.
- Always specify `immediate`/`deep` intentionally; avoid deep watches unless truly necessary.
- Clean up side effects where applicable (e.g., `watchEffect` invalidation, event listeners).

### Events & v-model
- Use `emits` to declare emitted events.
- Prefer `v-model` patterns for two-way binding only when it’s an intentional part of the component contract.
- Keep event naming consistent and explicit.

### Template Practices
- Prefer clear templates over dense logic in templates.
- Avoid complex expressions in templates; move logic into computed properties or methods.
- Use stable keys in `v-for`; never use array index as key unless the list is truly static.

### Performance
- Avoid unnecessary reactive dependencies that cause broad rerenders.
- Use `defineAsyncComponent` / dynamic imports for heavy components only when it meaningfully improves load.
- Keep computed properties pure and fast.

### Provide/Inject & Global State
- Use `provide/inject` for dependency injection, not general state management.
- Follow the project’s existing state solution (Pinia/Vuex/etc.); do not introduce a new store.

### Styling & UI Libraries
- Follow existing styling conventions (scoped styles, CSS modules, utility CSS, etc.).
- Do not introduce a new UI/styling library unless explicitly requested.

### File/Export Hygiene
- Keep component names consistent with filenames and usage.
- Keep props/emits/types colocated and readable; avoid over-abstracting component contracts.
