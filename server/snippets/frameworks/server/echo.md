## Echo (Go) (framework only)

### Router Structure
- Organize routes by feature using `Group`; avoid one large router with all endpoints.
- Keep handlers thin: bind/validate input, call service logic, return response.
- Follow RESTful route and HTTP method conventions consistent with the project.

### Middleware Discipline
- Use Echo middleware for cross-cutting concerns (logging, recovery, auth, request IDs, CORS).
- Keep middleware single-purpose and ordered intentionally.
- Avoid heavy or blocking work inside middleware.

### Binding & Validation
- Use `c.Bind()` (or the project’s custom binder) consistently for request parsing.
- Validate at the boundary before calling business logic.
- Prefer struct-based request models with proper `json`, `query`, `param`, or `form` tags.

### Context Usage
- Use `echo.Context` only within the HTTP layer.
- Avoid passing the full context deep into domain logic unless the project already does.
- Extract required values (user, request ID, etc.) and pass them explicitly where possible.

### Error Handling
- Use centralized error handling (`HTTPErrorHandler`) if defined by the project.
- Return errors via `echo.NewHTTPError` (or project wrapper) for expected failures.
- Avoid exposing internal error details in responses.

### Response Writing
- Use `c.JSON`, `c.String`, `c.NoContent`, etc., consistently.
- Ensure each handler returns exactly one response path.
- Use explicit and correct status codes for create/update/delete flows.

### Recovery & Stability
- Ensure recovery middleware is enabled to prevent panics from crashing the server.
- Do not use panics for expected error conditions.

### Performance Considerations
- Avoid reading/parsing the request body multiple times.
- Use streaming responses when handling large payloads.
- Keep handlers lightweight and avoid unnecessary allocations.

### Consistency
- Match existing patterns for grouping, middleware, binding, and response formats.
- Do not introduce alternative routers/frameworks unless explicitly requested.
