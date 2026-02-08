## Dart (framework-agnostic)

### Language & Project Conventions
- Follow the existing project structure and formatting (`dart format` conventions).
- Prefer standard Dart libraries and existing dependencies; do not introduce new packages unless required.
- Keep code explicit and readable; avoid overly clever language features.

### Null Safety
- Assume sound null safety is enabled.
- Prefer non-nullable types by default.
- Avoid the null assertion operator (`!`) unless the invariant is locally guaranteed.
- Use explicit checks or fallback values instead of relying on nullable propagation when correctness matters.

### Types & Modeling
- Prefer explicit types for public APIs and exported members.
- Use `final` by default; use `var` only when type inference is obvious and improves readability.
- Prefer immutable data models where practical.
- Use simple classes for structured data instead of passing loosely structured `Map<String, dynamic>` through the system.

### Collections & Data Handling
- Avoid unnecessary copying of collections; clone only when mutation safety requires it.
- Prefer typed collections (`List<T>`, `Map<K, V>`) over dynamic structures.
- Treat external or decoded data (`jsonDecode`, platform input, etc.) as untrusted and validate before use.

### Async & Concurrency
- Prefer `async` / `await` over raw `Future` chains.
- Always handle errors in asynchronous code (`try/catch` or `Future.catchError`).
- Avoid unawaited futures unless intentionally fire-and-forget; if so, make the intent explicit.
- Keep asynchronous boundaries clear and avoid mixing sync/async behavior implicitly.

### Error Handling
- Throw `Exception` or domain-specific exceptions rather than generic `Error`, unless it represents a programmer fault.
- Do not silently swallow errors.
- Add context when rethrowing to make failures diagnosable.

### Imports & Organization
- Use package imports (`package:...`) for internal modules when the project does so.
- Avoid relative import chains that create fragile dependencies.
- Keep imports organized and avoid unused dependencies.

### Performance Awareness
- Avoid unnecessary object allocation in tight loops or frequently executed paths.
- Prefer lazy or streaming processing when working with large datasets, if it improves memory behavior and remains readable.

### Consistency
- Match the project’s naming conventions, file layout, and dependency patterns.
- Do not introduce new architectural patterns or frameworks unless explicitly requested.
