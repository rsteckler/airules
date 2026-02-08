## Spring Boot (framework only)

### Layering & Structure
- Keep a clear separation:
  - Controllers: HTTP mapping only
  - Services: business logic
  - Repositories: persistence access
- Avoid putting business logic in controllers.
- Organize by feature/domain packages if that’s the project convention (avoid “all controllers in one package” unless already used).

### Controllers
- Prefer annotated controllers (`@RestController`) with explicit request mappings.
- Keep request/response DTOs explicit; avoid exposing persistence entities directly in API responses unless the project already does.
- Use proper status codes (`ResponseEntity`) when you need control; otherwise keep handlers simple.

### Validation
- Validate at the boundary using Bean Validation (`@Valid`, `@Validated`) when the project uses it.
- Keep validation rules in DTOs or validators, not in controller bodies.
- Fail fast with clear client-facing errors; don’t leak internal exception details.

### Exception Handling
- Use centralized exception handling (`@ControllerAdvice`) for consistent error shapes.
- Map expected failures to appropriate HTTP status codes.
- Avoid returning raw stack traces or internal exception messages.

### Dependency Injection
- Prefer constructor injection.
- Avoid field injection.
- Keep component scope intentional (singleton by default; avoid request/session scope unless required).

### Configuration
- Use `application.yml/properties` and the existing configuration pattern (`@ConfigurationProperties`) when applicable.
- Do not introduce new configuration conventions unless explicitly requested.
- Keep environment-specific settings isolated (profiles) if the project already uses them.

### Transactions
- Use `@Transactional` at the service layer (not controllers) for business operations that require it.
- Keep transactional boundaries clear and minimal.

### Web Concerns
- Use filters/interceptors for cross-cutting concerns (auth, request IDs, logging) only when consistent with the project.
- Avoid heavy work in filters; keep them deterministic.

### Serialization
- Be explicit about API contracts; avoid accidental serialization of lazy-loaded relations.
- Use DTOs and mapping patterns consistent with the project (manual, MapStruct, etc.); do not introduce a new mapper library unless requested.

### Consistency
- Match existing patterns for package layout, controller style, error handling, and DI.
- Do not introduce alternative frameworks or architectural patterns unless explicitly requested.
