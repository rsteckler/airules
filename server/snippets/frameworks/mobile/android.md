## Android Native (Android SDK / Jetpack only)

### Framework Choice
- Follow the project’s UI approach (Jetpack Compose vs XML Views). Do not migrate UI frameworks unless explicitly requested.
- Keep Android/platform code separated from domain logic (follow existing layering patterns).

### Jetpack Compose-Specific
- Treat composables as pure functions of state; avoid side effects in composition.
- Manage state correctly:
  - `remember` for local state
  - `rememberSaveable` for state that must survive config changes/process recreation (as appropriate)
- Keep side effects in effect APIs (`LaunchedEffect`, `DisposableEffect`), with correct keys to avoid reruns.
- Avoid unstable parameters that trigger recomposition churn; pass stable state and lambdas where possible.
- Prefer unidirectional data flow: state down, events up.
- Use `LazyColumn/LazyRow` for large lists; provide stable keys.

### View System (XML) Specific
- Avoid “massive” Activities/Fragments; move logic into ViewModels/services per existing patterns.
- Use RecyclerView properly (ViewHolder reuse, stable IDs when needed, diffing if used by project).
- Keep view binding consistent with the project (ViewBinding, DataBinding, etc.); don’t introduce a new one.

### Lifecycle & State
- Respect lifecycle: avoid doing UI work when not started/resumed if it causes crashes/leaks.
- Avoid leaking references (Activities, Views, Context) from long-lived objects.
- Use lifecycle-aware collection (`repeatOnLifecycle`, etc.) if the project uses Flow/LiveData patterns.

### Background Work
- Use the project’s established background pattern:
  - WorkManager for deferrable/reliable work
  - foreground services only when required and already patterned
- Avoid ad-hoc threads; use existing executors/coroutines patterns if present.
- Be explicit about cancellation and timeouts.

### Permissions & Intents
- Request permissions just-in-time and handle denial paths.
- Use modern Activity Result APIs if the project uses them.
- Validate external intent data; treat it as untrusted input.

### Resources & Theming
- Use existing resource conventions (strings, dimens, styles/themes).
- Avoid hardcoded user-facing strings; use `strings.xml` if that’s the project convention.
- For Compose, follow existing theming setup (Material 2/3); don’t mix systems.

### Navigation
- Follow the existing navigation approach (Navigation Component, manual, Compose Navigation).
- Keep navigation logic centralized per project pattern; avoid deep UI layers initiating complex navigation flows.

### Performance
- Avoid heavy work on the main thread (disk, JSON parsing, image processing).
- Be careful with bitmap usage and large allocations.
- For lists, avoid binding work that scales linearly with scroll events.

### Consistency
- Match existing patterns for DI (Hilt/Dagger/Koin), ViewModels, repositories, and modules.
- Do not introduce new third-party frameworks or architectural patterns unless explicitly requested.
