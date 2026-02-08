## Swift (framework-agnostic)

### Style & Conventions
- Follow existing project conventions and formatting. Keep Swift idiomatic and readable.
- Prefer explicit, clear code over clever tricks.
- Keep types and functions small and focused.

### Optionals & Safety
- Avoid force unwrap (`!`) unless the invariant is guaranteed locally.
- Prefer `guard let` for early exits and clearer control flow.
- Use `if let` for localized optional handling.
- Prefer optional chaining when it remains readable; avoid long chains that hide logic.

### Types & Modeling
- Prefer `struct` for value types; use `class` when reference semantics are required.
- Use `enum` for closed sets and state machines; prefer associated values over parallel properties.
- Prefer immutable properties (`let`) by default; use `var` only when mutation is needed.
- Avoid “stringly typed” flags; model intent with types.

### Error Handling
- Use `throws` for recoverable failures; use `Result` when it improves API ergonomics or async composition.
- Don’t swallow errors silently; propagate or handle intentionally.
- Throw meaningful, specific errors (custom `Error` enums where appropriate).

### Concurrency
- Follow the project’s concurrency model (GCD, async/await, Combine, etc.); don’t introduce a new one.
- With Swift Concurrency:
  - Prefer structured concurrency (`async let`, `TaskGroup`) over detached tasks.
  - Avoid `Task.detached` unless you need independence from the current actor context.
  - Be explicit about actor boundaries; avoid accidental cross-actor access.
- Avoid sharing mutable state across threads without synchronization.

### Collections & Performance
- Avoid unnecessary copying of arrays/dictionaries in hot paths.
- Prefer `lazy` only when it clarifies intent or avoids work.
- Be mindful of reference cycles in closures (`[weak self]`) where appropriate.

### Access Control
- Default to the narrowest access level that works (`private`/`fileprivate`/`internal`).
- Avoid exposing internal implementation details in public APIs.

### Interop & Boundaries
- Treat external input (network responses, file data, user input) as untrusted; validate/normalize before use.
- Keep boundary parsing separate from domain logic.

### Consistency
- Match existing naming, layering, and dependency patterns.
- Avoid adding new third-party dependencies unless explicitly required.
