## Fiber (Go) (framework only)

### Router Structure
- Organize routes by feature using `Group`; avoid one large, flat routing file.
- Keep handlers thin: parse/validate input, call service logic, return response.
- Follow RESTful route structure and HTTP method semantics consistent with the project.

### Context Usage
- Treat `*fiber.Ctx` as an HTTP-layer object only.
- Avoid passing `Ctx` into domain/service layers unless the project already does.
- Extract required values (params, user, request ID) and pass explicit arguments to business logic.

### Request Parsing & Validation
- Use Fiber helpers (`BodyParser`, `QueryParser`, `Params`, etc.) consistently.
- Validate at the boundary before invoking business logic.
- Avoid reading/parsing the request body multiple times.

### Middleware Discipline
- Use middleware for cross-cutting concerns (auth, logging, request IDs, CORS, rate limiting).
- Keep middleware single-purpose and ordered intentionally.
- Avoid heavy or blocking work in middleware.

### Error Handling
- Use centralized error handling (`ErrorHandler`) if the project defines one.
- Return consistent error responses (status + message/code) per project conventions.
- Avoid leaking internal error details to clients.

### Response Handling
- Use `c.JSON`, `c.Send`, `c.Status`, etc., consistently.
- Ensure each handler produces exactly one response path.
- Use explicit status codes for create/update/delete operations.

### Recovery & Stability
- Ensure recovery middleware is enabled to prevent panics from crashing the server.
- Do not use panics for expected error conditions.

### Performance Considerations
- Avoid unnecessary allocations or large object creation in hot paths.
- Prefer streaming or chunked responses for large payloads when applicable.
- Be mindful that Fiber is optimized for performance—avoid adding patterns that negate its lightweight model.

### Consistency
- Match existing project conventions for route grouping, middleware, request parsing, and response format.
- Do not introduce alternative HTTP frameworks or compatibility layers unless explicitly requested.
