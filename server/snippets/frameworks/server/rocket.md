## Rocket (framework only)

### Routing & Structure
- Organize routes by feature/module; avoid one large `routes![]` list in a single file.
- Keep route handlers thin: parse/validate inputs, call service logic, return responses.
- Prefer clear RESTful routes and HTTP methods consistent with the project.

### Guards & Extractors
- Use Rocket request guards for auth/context and typed extraction.
- Validate at the boundary using guards/forms/JSON types rather than manual parsing.
- Keep guards small and focused; avoid stuffing business logic into guards.

### State Management
- Use `State<T>` for shared app state (clients, pools, config).
- Keep shared state immutable where possible; synchronize mutable state explicitly.
- Avoid passing Rocket request objects into domain logic; keep HTTP concerns at the edge.

### Serialization
- Use the project’s established serde/JSON patterns (`Json<T>`) consistently.
- Prefer explicit request/response DTOs; avoid exposing internal domain types directly unless that’s the project convention.

### Error Handling
- Use a consistent error type and implement `Responder` (or map to `Status`) for centralized shaping.
- Return safe, consistent error responses; avoid leaking internal details.
- Use appropriate HTTP status codes for expected failures.

### Fairings (Middleware)
- Use fairings for cross-cutting concerns (logging, headers, request IDs) only when necessary.
- Keep fairings lightweight and deterministic.
- Be mindful of fairing ordering and global impact.

### Async & Blocking Work
- Keep handlers non-blocking where possible.
- If blocking IO is required, use an appropriate pattern consistent with the project/runtime.

### Consistency
- Match existing Rocket version conventions (0.4 vs 0.5) and project structure.
- Do not introduce a different Rust web framework or alternate routing layer unless explicitly requested.
