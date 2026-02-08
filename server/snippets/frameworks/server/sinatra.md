## Sinatra (framework only)

### App Structure
- Keep the Sinatra app modular:
  - use `Sinatra::Base` subclasses when the project is modular
  - split routes by feature where possible
- Avoid a single file with all routes, helpers, and business logic.

### Routing
- Keep routes RESTful and consistent with existing conventions.
- Keep handlers thin: parse/validate input, delegate to services, return response.
- Avoid large blocks of logic inside route definitions.

### Helpers
- Use helpers for small, reusable HTTP-layer concerns (rendering, parameter access, shared response formatting).
- Avoid putting business logic in helpers; keep domain logic in service objects/modules.

### Middleware
- Use Rack middleware for cross-cutting concerns (logging, auth, request IDs) if the project already does.
- Keep middleware minimal and ordered intentionally.
- Avoid heavy work in middleware.

### Input Handling
- Validate params at the boundary; do not trust request input.
- Keep validation separate from business logic where possible.

### Error Handling
- Use `error` blocks and `not_found` for centralized error handling.
- Return consistent error shapes and status codes per project conventions.
- Avoid leaking exception details to clients.

### Environment & Configuration
- Follow existing environment config patterns (settings, ENV usage).
- Avoid hardcoding environment-specific values in code.

### Performance & Safety
- Avoid long-running work in request handlers.
- Keep global state minimal; be mindful of thread safety depending on server runtime.

### Consistency
- Match existing patterns for modular apps, route organization, and response formatting.
- Do not introduce a different Ruby web framework or heavy abstraction layer unless explicitly requested.
