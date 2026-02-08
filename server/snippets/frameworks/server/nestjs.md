## NestJS (framework only)

### Module Boundaries
- Organize by feature modules; keep modules cohesive and small.
- Avoid “god modules” that import everything.
- Keep providers exported only when truly needed by other modules.

### Controllers
- Keep controllers thin: request mapping, validation triggers, and calling services.
- Avoid business logic in controllers.
- Use DTOs consistently with the project’s validation/transform strategy.

### Providers & DI
- Prefer constructor injection.
- Scope providers intentionally (singleton by default; request-scoped only when necessary).
- Avoid using the Nest container as a global service locator.

### Services
- Put domain/business logic in services.
- Keep services focused; split when a service becomes a grab bag of unrelated operations.

### Pipes / Validation
- Use pipes for validation/transformation when that’s the established pattern (e.g., `ValidationPipe`).
- Validate at the boundary (DTOs, params), not deep in services.
- Avoid custom pipes unless they provide clear reuse and the project already favors them.

### Guards / Interceptors / Filters
- Use Guards for auth/authorization concerns.
- Use Interceptors for cross-cutting behaviors (logging, timing, response mapping).
- Use Exception Filters for consistent error shaping and safe responses.
- Keep each cross-cutting component single-purpose.

### Exceptions & HTTP Semantics
- Use Nest’s HTTP exceptions (`BadRequestException`, etc.) for expected failures.
- Keep error responses consistent with project conventions.
- Avoid leaking internal error details.

### CQRS/Event Patterns
- Only use `@nestjs/cqrs` or event-driven patterns if the project already does.
- Do not introduce a CQRS architecture unless explicitly requested.

### Transport Layers
- If using REST, follow established routing and DTO conventions.
- If using GraphQL/microservices, match the project’s existing adapters and patterns; do not mix transports casually.

### Performance & Lifecycle
- Avoid heavy work in lifecycle hooks (`onModuleInit`) unless required; keep initialization predictable.
- Be mindful of circular dependencies; use `forwardRef` only as a last resort.

### Consistency
- Match existing conventions for module layout, naming, decorators, and file structure.
- Do not introduce alternative frameworks or bypass Nest patterns unless explicitly requested.
