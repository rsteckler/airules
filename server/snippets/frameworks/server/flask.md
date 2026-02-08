## Flask (framework only)

### App Structure
- Keep the application modular using blueprints; avoid one large monolithic app file.
- Separate concerns:
  - routing (blueprints/views)
  - business logic (services/domain)
  - data access (models/repositories)
- Avoid embedding business logic directly in route handlers.

### Application Factory
- Follow the project’s initialization pattern (app factory vs global app).
- Prefer the application factory pattern if already used; avoid global state tied to import-time side effects.

### Blueprints
- Organize routes by feature/domain using Blueprints.
- Keep blueprint responsibilities focused and cohesive.
- Register blueprints centrally; avoid circular imports.

### Request Handling
- Keep view functions thin: parse/validate input, call services, return response.
- Return consistent response shapes and appropriate HTTP status codes based on project conventions.
- Avoid returning raw exceptions or internal details to clients.

### Input Validation
- Validate request data at the boundary using the project’s chosen approach (schemas, marshmallow, Pydantic, etc.).
- Avoid manual validation scattered across view functions.

### Error Handling
- Use centralized error handlers (`@app.errorhandler`) for consistent error responses.
- Map internal errors to safe client responses.
- Avoid leaking stack traces or sensitive information.

### Context Usage
- Use Flask request/application context (`request`, `g`, `current_app`) sparingly and intentionally.
- Avoid storing long-lived or complex state in `g`.
- Do not rely on context globals deep inside business logic; pass dependencies explicitly when possible.

### Middleware / Hooks
- Use `before_request` / `after_request` only for cross-cutting concerns (auth, logging, request IDs).
- Keep hook logic lightweight and deterministic.

### Extensions
- Follow existing patterns for initializing and using Flask extensions.
- Initialize extensions in a central location; avoid ad-hoc initialization inside modules.
- Do not introduce new extensions unless explicitly requested.

### Performance & Deployment Considerations
- Avoid heavy or blocking work inside request handlers.
- Be mindful of thread/process safety when using global objects.

### Consistency
- Match existing project conventions for blueprints, configuration, initialization, and response structure.
- Do not introduce a different web framework or alternate routing system unless explicitly requested.
