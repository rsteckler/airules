## Django (framework only)

### App Structure
- Follow Django’s app-based architecture; organize features into cohesive apps.
- Keep models, views, serializers/forms, and business logic separated according to existing project conventions.
- Avoid putting large amounts of logic directly in views.

### Views
- Keep views thin: handle request/response orchestration and delegate business logic to services, model methods, or domain layers.
- Use class-based views or function-based views consistently with the existing codebase.
- Return appropriate HTTP status codes and consistent response formats.

### Models & ORM Usage
- Use Django ORM idiomatically; avoid raw SQL unless necessary and consistent with project patterns.
- Prefer queryset methods (`select_related`, `prefetch_related`) to avoid N+1 queries.
- Keep model methods focused on domain logic, not request-specific behavior.

### Forms / Serializers / Validation
- Validate input at the boundary using Django Forms, ModelForms, or serializers (e.g., DRF if present).
- Avoid manual validation inside views when framework validation is available.
- Keep validation logic reusable and centralized.

### Middleware
- Use middleware only for true cross-cutting concerns (auth context, request IDs, etc.).
- Keep middleware lightweight and order-aware.
- Avoid request-specific business logic in middleware.

### Settings & Configuration
- Follow existing settings structure (environment separation, config modules).
- Do not introduce new configuration patterns unless explicitly requested.
- Avoid hardcoding environment-specific values.

### Authentication & Permissions
- Use Django’s built-in auth system or the project’s established auth pattern.
- Use permission classes/decorators consistently.
- Avoid implementing custom auth logic if built-in mechanisms suffice.

### Migrations
- Let Django manage schema changes via migrations.
- Keep migrations small and incremental; do not manually edit generated migrations unless necessary.
- Avoid destructive schema changes without explicit intent.

### Static & Media Handling
- Follow existing patterns for static files and media storage.
- Do not introduce new storage backends or asset pipelines unless explicitly requested.

### Performance
- Be mindful of query counts and lazy evaluation.
- Avoid heavy computation inside request/response paths when it can be moved elsewhere.

### Consistency
- Match existing patterns for app layout, view style, ORM usage, and configuration.
- Do not introduce alternative web frameworks or bypass Django conventions unless explicitly requested.
