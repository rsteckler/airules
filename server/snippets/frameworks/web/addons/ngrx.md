## NgRx (addon only)

### When to Use NgRx
- Use NgRx for complex, shared application state that benefits from a predictable, event-driven model.
- Keep local UI-only state inside components unless it must be shared globally.
- Do not introduce NgRx for simple state if the project already uses lighter patterns elsewhere.

### State Shape
- Keep state normalized and flat where possible.
- Avoid deeply nested state that makes updates complex.
- Prefer storing entity collections using `EntityAdapter` when managing lists.

### Actions
- Prefer event-style actions that describe what happened (`userLoaded`, `orderSubmitted`) rather than UI-driven commands.
- Keep action payloads minimal and serializable.
- Avoid using actions as generic method calls; they should represent domain events.

### Reducers
- Keep reducers pure and focused on state transitions only.
- Do not perform side effects, API calls, or complex logic inside reducers.
- Prefer small feature reducers rather than large monolithic reducers.

### Effects
- Handle all side effects (HTTP, navigation, storage, etc.) in Effects.
- Use RxJS operators to flatten streams (`switchMap`, `mergeMap`, etc.) instead of nested subscriptions.
- Always handle error paths explicitly and map them to failure actions.
- Keep effects focused and readable; avoid large multi-responsibility pipelines.

### Selectors
- Use selectors as the primary read interface to the store.
- Prefer memoized selectors for derived data.
- Keep selectors pure and inexpensive.
- Select only the minimal slice of state needed by a component.

### Component Integration
- Components should dispatch actions and select state; avoid embedding business logic.
- Prefer `async` pipe over manual subscription.
- Avoid selecting large objects when only a few fields are required.

### Feature Organization
- Follow the existing project pattern for feature state (feature keys, folder structure, and registration).
- Keep actions, reducers, selectors, and effects grouped by feature.

### Entity Management
- Use `createEntityAdapter` when managing collections to ensure consistent updates and selectors.
- Avoid manual array mutation logic for entity lists.

### Persistence & DevTools
- Store only serializable data in the store.
- Avoid storing large, volatile, or sensitive data unless the project explicitly requires it.

### Consistency
- Match existing NgRx patterns (creator functions, feature structure, naming).
- Do not introduce alternative state patterns or restructure store architecture unless explicitly requested.
