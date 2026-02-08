## FastAPI (framework only)

### Routing & Structure
- Organize routes with `APIRouter` by feature/domain; avoid one giant router.
- Keep route handlers thin: validate/parse input, call service logic, return response.
- Use clear REST semantics (methods, status codes, resource-oriented paths) consistent with the project.

### Pydantic Models
- Use Pydantic models for request/response schemas.
- Avoid returning raw dicts when a response model exists or is expected.
- Keep models focused; avoid “mega models” with unrelated fields.
- Use separate models for input vs output when needed (e.g., write vs read shapes).

### Dependency Injection
- Use `Depends` for cross-cutting concerns (auth, DB sessions, request context).
- Keep dependencies small and composable.
- Avoid hidden globals; prefer dependency injection over module-level singletons.

### Validation & Error Responses
- Validate at the boundary using Pydantic and dependencies.
- Use `HTTPException` for expected client errors with correct status codes.
- Normalize error responses consistent with the project; avoid leaking internal stack traces.

### Async vs Sync
- Use `async def` for IO-bound handlers; do not mix blocking IO into async handlers.
- If calling blocking code, run it safely (threadpool/executor) per project conventions.
- Be consistent across the codebase; don’t introduce async patterns if the project is largely sync (or vice versa) without reason.

### Background Tasks
- Use `BackgroundTasks` for lightweight background work tied to request lifecycle (when appropriate).
- Avoid heavy background processing in-process unless the project explicitly uses it.

### Middleware
- Use middleware for cross-cutting concerns (request IDs, logging, auth) sparingly.
- Keep middleware fast and deterministic.
- Be careful with middleware ordering.

### Security & Auth
- Follow existing auth patterns (OAuth2, JWT, sessions).
- Use FastAPI security dependencies (`fastapi.security`) if the project already does.
- Keep token/credential handling server-side only.

### OpenAPI / Docs
- Keep operation IDs, tags, and response models consistent with existing conventions.
- Avoid disabling schema generation unless explicitly requested.

### Consistency
- Match existing project patterns for routers, dependencies, error handling, and app creation.
- Do not introduce a second web framework or incompatible middleware stack.
