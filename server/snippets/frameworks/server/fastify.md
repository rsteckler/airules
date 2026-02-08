## Fastify (framework only)

### Core Patterns
- Prefer Fastify plugins for modularity; avoid one monolithic server file.
- Keep a clear separation between:
  - plugin registration / wiring
  - route definitions
  - business logic (services)

### Schema-First Defaults
- Use Fastify’s built-in schema support for validation and serialization when the project is schema-driven.
- Prefer route-level `schema` for `body`, `querystring`, `params`, and `response`.
- Keep schemas reusable and colocated with the feature when appropriate.

### Route Handlers
- Keep handlers small and focused on request orchestration.
- Prefer returning values (Fastify will serialize) over manually calling `reply.send()` unless you need fine control.
- Use `reply.code()`/`reply.status()` intentionally for status codes.

### Plugins & Encapsulation
- Use encapsulation intentionally: register feature plugins with their own decorators/hooks.
- Avoid leaking decorators globally unless they are truly app-wide.
- Prefer `fastify-plugin` when a plugin must share decorators/hooks with downstream plugins.

### Decorators
- Use decorators (`decorate`, `decorateRequest`, `decorateReply`) for shared utilities only when it clarifies and matches project patterns.
- Avoid “magic” decorators that obscure dependencies—keep usage explicit.
- Ensure decorated properties are typed/declared consistently with the project’s TS setup (if applicable).

### Hooks
- Use hooks (`preHandler`, `onRequest`, `onResponse`, etc.) for cross-cutting concerns (auth, request IDs, timing).
- Keep hook work minimal and predictable; avoid heavy logic in hooks.
- Ensure hooks handle async errors properly.

### Error Handling
- Prefer centralized error handling with `setErrorHandler`.
- Normalize errors into consistent status/code/message shapes per project conventions.
- Avoid leaking internal error details in responses.

### Performance / Fastify-Specific
- Avoid introducing slow, generic middleware patterns; prefer Fastify-native plugins.
- Use `reply.type()`/serialization intentionally for performance and correctness.
- Respect Fastify’s logging setup; do not add ad-hoc console logging.

### Consistency
- Match existing plugin structure, schema strategy, and routing conventions.
- Do not introduce Express-style middleware patterns unless the project already does so via compatibility plugins.
