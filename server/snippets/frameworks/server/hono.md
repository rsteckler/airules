## Hono (framework only)

### Design Philosophy
- Keep handlers minimal and fast; treat Hono as a thin HTTP layer.
- Separate routing from business logic; move domain work into services/modules.

### Routing Structure
- Use `new Hono()` instances per feature and compose with `app.route()` or mounting patterns.
- Avoid one large monolithic router.
- Keep route paths and HTTP methods RESTful and consistent with project conventions.

### Context Usage
- Use `c.req` for request access and `c.json()`, `c.text()`, etc. for responses.
- Avoid attaching arbitrary data to the context unless using established middleware patterns.
- Prefer returning responses directly instead of manually constructing low-level `Response` objects unless necessary.

### Middleware Discipline
- Use middleware for cross-cutting concerns (auth, logging, request IDs, timing).
- Keep middleware small, single-purpose, and ordered intentionally.
- Avoid heavy or blocking work inside middleware.

### Validation & Input Handling
- Validate inputs at the edge (params, query, body) using the project’s existing validation approach.
- Do not trust request input; keep validation separate from business logic.

### Error Handling
- Use centralized error handling (`app.onError`) when the project defines it.
- Normalize errors into consistent response shapes.
- Avoid leaking internal error details in responses.

### Platform Awareness
- Respect the runtime target (Node, Bun, Deno, Cloudflare Workers, etc.).
- Avoid Node-specific APIs if the project targets edge/serverless environments.
- Prefer standard Web APIs (`Request`, `Response`, `fetch`) when possible.

### Performance Considerations
- Avoid unnecessary JSON parsing, large object cloning, or synchronous heavy work.
- Prefer streaming responses when handling large payloads if the project supports it.

### Type Safety (if TypeScript is used)
- Use Hono’s typed context/variables patterns if the project defines them.
- Keep context augmentation explicit and consistent.

### Consistency
- Match existing patterns for route composition, middleware, and error responses.
- Do not introduce Express-style middleware patterns or alternative HTTP frameworks unless explicitly requested.
