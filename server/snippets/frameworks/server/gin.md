## Gin (Go) (framework only)

### Router Structure
- Organize routes by feature using `RouterGroup`; avoid one giant router file.
- Keep handlers thin: bind/validate input, call service logic, write response.
- Prefer clear RESTful routing patterns consistent with the project.

### Middleware Discipline
- Use Gin middleware for cross-cutting concerns (auth, logging, request IDs, recovery).
- Keep middleware single-purpose and ordered intentionally.
- Avoid heavy work in middleware; keep it fast and deterministic.

### Binding & Validation
- Use Gin binding (`ShouldBindJSON`, `ShouldBindQuery`, etc.) consistently.
- Validate at the boundary; do not let invalid input reach business logic.
- Use struct tags (`json`, `form`, etc.) consistently with existing patterns.

### Context Usage
- Use `*gin.Context` only within HTTP layer; don’t pass it deep into domain logic unless the project already does.
- Prefer extracting needed values (request IDs, auth principal) and passing explicit parameters.
- Avoid storing large objects in context keys.

### Error Handling
- Use `c.Error(err)` and centralized error handling middleware if the project uses it.
- Return consistent error responses (status + message/code) per project conventions.
- Do not leak internal error details in responses.

### Response Writing
- Use `c.JSON` / `c.Status` / `c.Data` consistently.
- Ensure every handler returns exactly one response path; avoid double-writes.
- Prefer explicit status codes for create/update/delete flows.

### Recovery & Panics
- Ensure recovery middleware is enabled to avoid crashing the process on panics.
- Avoid using panics for expected errors; return errors through normal paths.

### Performance
- Avoid reading/parsing request bodies multiple times.
- Use streaming responses for large payloads when appropriate.

### Consistency
- Match existing patterns for route grouping, middleware, request binding, and response shapes.
- Do not introduce alternative routers/frameworks unless explicitly requested.
