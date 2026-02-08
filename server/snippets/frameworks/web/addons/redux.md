## Redux (addon only)

### When to Use Redux
- Use Redux only for genuinely shared, app-wide state that benefits from a centralized store.
- Do not put ephemeral UI state in Redux (e.g., local input values, modal open flags) unless the project already does so consistently.

### Redux Toolkit Defaults
- Prefer Redux Toolkit (`@reduxjs/toolkit`) patterns over “classic” Redux.
- Prefer `createSlice` for state + reducers.
- Prefer `createAsyncThunk` (or RTK Query if the project uses it) for async flows; avoid hand-rolled action triplets.

### State Shape & Normalization
- Keep state normalized for collections (`{ ids: [], entities: {} }`) when dealing with lists of items.
- Avoid deeply nested state that requires complex immutable updates.
- Prefer storing IDs/references rather than duplicating full objects across slices.

### Selectors
- Use selectors as the primary read API for Redux state.
- Prefer memoized selectors (`reselect` or RTK’s `createSelector`) for derived data that would otherwise recompute frequently.
- Keep selectors pure; no side effects.

### Reducers & Immutability
- Write reducers assuming Immer semantics (mutating “draft” is fine inside slices).
- Keep reducers small and predictable; avoid mixing many concerns in a single reducer.

### Side Effects
- Keep side effects out of reducers.
- Prefer thunks/RTK Query over custom middleware unless the project already has a strong middleware pattern.
- Avoid complex thunk nesting; keep async flows readable and linear.

### Components Integration
- Prefer `useSelector` + `useDispatch` hooks for React integration.
- Keep `useSelector` reads narrow (select only what’s needed) to reduce rerenders.
- Avoid selecting large objects when a few primitives will do.

### Actions & Events
- Prefer domain/event-style actions (`userLoggedIn`, `itemUpdated`) over UI-driven names.
- Avoid exporting many internal action creators; expose the slice actions and selectors as the module API.

### Consistency
- Match existing folder conventions (feature slices vs layered store folders).
- Do not reorganize the store structure unless explicitly requested.
