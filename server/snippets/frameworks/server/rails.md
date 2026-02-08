## Ruby on Rails (framework only)

### MVC Boundaries
- Keep controllers thin: parameter handling, authorization hooks, and delegating to domain/service objects.
- Keep business logic out of controllers and views; put it in models or service objects per project convention.
- Avoid “fat models” if the project prefers service objects—follow the established style.

### Controllers
- Use strong parameters; never trust request input.
- Prefer RESTful controller actions and resourceful routing.
- Keep response formats consistent with the project (HTML vs JSON); don’t mix patterns without intent.

### Models & ActiveRecord
- Keep validations and associations in models.
- Avoid N+1 queries; use `includes`, `preload`, `eager_load` appropriately.
- Prefer scopes for reusable query logic; keep scopes composable and predictable.
- Avoid callbacks for complex business workflows; prefer explicit service objects/transactions.

### Service Objects / Interactors
- Follow existing service conventions (`call`, `perform`, etc.).
- Keep service objects single-purpose and explicit about inputs/outputs.
- Use transactions at the service layer for multi-step writes.

### Background Jobs
- Use ActiveJob consistently with the configured adapter (Sidekiq, etc.) if present.
- Keep jobs small: orchestrate work, delegate heavy logic to services.
- Avoid performing long-running work in web requests.

### Routing
- Prefer `resources` routes over custom match-all routes.
- Keep routes file readable; group by domain/namespace when needed.
- Avoid adding non-REST endpoints unless there is a clear need and it matches project patterns.

### Errors & Status Codes
- Use consistent exception handling and error rendering (especially for APIs).
- Avoid leaking internal errors; map to safe messages per project conventions.

### Views / Helpers (when applicable)
- Keep view logic minimal; use helpers/components per project patterns.
- Avoid embedding business logic in templates.

### Consistency
- Match existing conventions for concerns, serializers (if any), service objects, and folder structure.
- Do not introduce new gems or architectural patterns unless explicitly requested.
