## Axum (framework only)

### Router Structure
- Compose routers by feature/module using `Router::new().nest(...)` / `merge(...)`; avoid one giant router.
- Keep route modules focused and self-contained (routes + minimal wiring).
- Prefer clear RESTful routing patterns consistent with the project.

### Extractors
- Use axum extractors (`Path`, `Query`, `Json`, headers, etc.) for input parsing.
- Validate at the boundary; reject invalid input before calling business logic.
- Avoid manual parsing when an extractor fits.

### State & Dependencies
- Use `State<T>` (or `Extension`) consistently per project conventions.
- Keep shared state immutable where possible; wrap mutable state with synchronization primitives when needed.
- Do not pass HTTP types (`Request`, `Response`) into domain layers; keep HTTP concerns at the edge.

### Errors
- Use a consistent error type and map it into responses via `IntoResponse`.
- Return safe error messages; avoid leaking internal details.
- Keep status codes explicit and consistent.

### Handlers
- Keep handlers thin: parse/validate input, call service logic, return typed responses.
- Prefer returning types that implement `IntoResponse` instead of manually building responses everywhere.
- Ensure each handler returns exactly one response path.

### Middleware & Layers
- Use Tower layers (`TraceLayer`, auth layers, timeouts) for cross-cutting concerns.
- Keep layer ordering intentional.
- Avoid stacking layers that do the same thing; follow project conventions.

### Async & Blocking Work
- Avoid blocking operations on the async runtime.
- If blocking work is necessary, use `tokio::task::spawn_blocking` or an established project pattern.

### Streaming & Large Payloads
- Prefer streaming responses for large downloads when appropriate.
- Avoid buffering large uploads/downloads entirely in memory.

### Consistency
- Match existing patterns for router composition, state injection, and error responses.
- Do not introduce alternative HTTP frameworks or runtime models unless explicitly requested.
