## Ktor (framework only)

### Application Structure
- Keep Ktor setup (plugins/installation) thin; place routing in feature modules.
- Prefer `Route` extension functions for feature routing (e.g., `fun Route.userRoutes(...)`).
- Avoid one monolithic `routing { ... }` block for the entire app.

### Routing & Handlers
- Keep handlers focused: parse/validate inputs, call service logic, respond.
- Use clear RESTful routes and HTTP methods consistent with project conventions.
- Avoid embedding business logic directly in route lambdas.

### Plugins (Ktor-specific)
- Use Ktor plugins for cross-cutting concerns (ContentNegotiation, Authentication, StatusPages, CallLogging, CORS, etc.).
- Keep plugin configuration centralized and consistent.
- Avoid adding new plugins unless explicitly requested.

### Serialization
- Use the project’s established serialization stack (kotlinx.serialization/Jackson).
- Keep serialization configuration consistent (date formats, unknown fields, naming).
- Prefer explicit DTOs for request/response; avoid leaking internal domain objects directly.

### Validation
- Validate at the boundary (params/query/body) using the project’s established approach.
- If validation is plugin-based or manual, keep it centralized and reusable; avoid ad-hoc checks scattered across routes.

### Error Handling
- Use `StatusPages` for centralized error handling and consistent error responses.
- Map expected errors to appropriate HTTP status codes.
- Avoid leaking internal exceptions and stack traces to clients.

### Auth
- Use Ktor’s `Authentication` plugin and established auth providers/patterns.
- Keep auth checks out of business logic where possible; enforce at routing boundaries via authentication/authorization configuration.

### Concurrency & Blocking IO
- Avoid blocking calls on the event loop; use appropriate dispatchers/patterns consistent with the project.
- Keep long-running work out of request handlers unless it’s explicitly designed for it.

### Testing Hooks / Environment
- Respect existing application engine setup and environment configuration patterns.
- Avoid hardcoding environment-specific values in code.

### Consistency
- Match existing conventions for routing modules, plugin installation, DTO placement, and error response shape.
- Do not introduce a different server framework or routing abstraction unless explicitly requested.
