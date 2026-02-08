## Nitro (framework only)

### Mental Model
- Treat Nitro as a server runtime with file-based routing and composable handlers.
- Prefer Nitro primitives (`defineEventHandler`, `readBody`, `getQuery`, `getRouterParam`, etc.) over ad-hoc Node/Express patterns.

### Routing & Handlers
- Keep route handlers thin: parse/validate input, call service logic, return response.
- Use file-based routes consistently; avoid building a parallel routing layer.
- Return plain objects (for JSON) or use Nitro response helpers when needed (status, headers, redirects).

### Server/Runtime Portability
- Avoid Node-specific APIs unless the project is explicitly Node-only.
- Prefer Web/Runtime-agnostic APIs and Nitro helpers for cookies, headers, storage, etc.
- Be mindful of edge/serverless targets (cold start, streaming, limits).

### Input & Validation
- Validate at the boundary using the project’s established approach.
- Use Nitro utilities for reading request body/query/params rather than manually parsing.

### Error Handling
- Use Nitro’s error utilities (`createError`, `sendError`) and consistent error shapes per project conventions.
- Avoid leaking internal error details to clients.
- Ensure status codes are correct and intentional.

### Storage & Caching (if used)
- Use Nitro storage APIs only if the project already uses them.
- Keep caching behavior explicit; avoid accidental global caching of dynamic responses.

### Middleware & Plugins
- Use Nitro plugins/middleware only for cross-cutting concerns (auth, logging, request IDs).
- Keep middleware minimal and ordered intentionally.
- Avoid heavy work in per-request middleware.

### Consistency
- Match the project’s Nitro/Nuxt conventions (directory layout, route structure, runtime config usage).
- Do not introduce Express-style middleware/router patterns unless the project already uses compat layers.
