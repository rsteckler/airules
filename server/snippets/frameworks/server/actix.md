## Actix Web (framework only)

### App Structure
- Organize routes with `scope()` and modular `configure()` functions per feature; avoid a single huge `App::new()` chain.
- Keep handlers thin: parse/validate input, call service logic, return response.
- Keep business logic out of handlers; delegate to services/modules.

### Extractors & Input Handling
- Use Actix extractors (`Path`, `Query`, `Json`, etc.) consistently.
- Validate at the boundary; reject invalid input before calling domain logic.
- Avoid manual parsing of request data when an extractor fits.

### State & Dependency Injection
- Use `web::Data<T>` for shared app state (clients, config, pools).
- Keep shared state immutable where possible; avoid storing mutable global state without synchronization.
- Avoid passing `HttpRequest`/`HttpResponse` deep into domain logic; keep HTTP concerns in the edge layer.

### Error Handling
- Use a consistent error type and map to `ResponseError` for centralized status/response shaping.
- Return safe error messages; do not leak internal details.
- Prefer typed errors over ad-hoc string errors.

### Responses
- Use `Responder` types or explicit `HttpResponse` builders consistently.
- Set status codes intentionally (`Created`, `NoContent`, etc.) for write operations.
- Avoid double-responding; ensure each handler has a single response path.

### Middleware
- Use middleware for cross-cutting concerns (logging, request IDs, auth, CORS) and keep it lightweight.
- Be intentional about middleware order.
- Avoid heavy work in middleware; keep per-request overhead low.

### Async & Blocking Work
- Keep handlers async; avoid blocking CPU/IO on the async runtime.
- Use `web::block` or spawn blocking work appropriately if the project requires it.

### Routing Conventions
- Prefer RESTful resources and HTTP semantics.
- Keep route naming consistent and predictable.
- Use guards only when needed; don’t overcomplicate routing.

### Consistency
- Match existing patterns for `App` wiring, feature modules, error types, and response formats.
- Do not introduce a second web framework or alternate runtime patterns unless explicitly requested.
