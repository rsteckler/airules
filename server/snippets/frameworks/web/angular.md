## Angular (framework only)

### Architecture & Structure
- Follow the existing project structure (standalone components vs NgModules). Do not migrate architecture as part of unrelated work.
- Keep components focused on presentation and orchestration; move business logic into services.
- Prefer feature-based organization over technical-layer grouping when consistent with the project.

### Components
- Keep components small and single-responsibility.
- Prefer `OnPush` change detection when the project uses it.
- Avoid heavy logic in templates; move computations into component methods, getters, or RxJS pipelines.
- Do not mutate `@Input()` values; treat inputs as immutable.

### Dependency Injection
- Use Angular’s DI system instead of manual instantiation.
- Scope services appropriately (`providedIn: 'root'` vs feature/component providers) based on existing patterns.
- Avoid introducing global singletons unless the project already uses that pattern.

### State & Data Flow
- Prefer unidirectional data flow: inputs down, events/outputs up.
- Use `@Output()` for component communication when appropriate.
- Follow the project’s existing state approach (services, NgRx, signals, etc.); do not introduce a new state system.

### RxJS Usage
- Prefer observable streams over manual subscription management when consistent with the project.
- Avoid nested subscriptions; use operators (`switchMap`, `mergeMap`, etc.) instead.
- Always manage subscriptions:
  - Use `async` pipe when possible.
  - Otherwise unsubscribe (`takeUntil`, `destroyRef`, etc.) to prevent leaks.
- Keep observable pipelines readable; avoid long, dense operator chains.

### Templates
- Prefer structural directives (`*ngIf`, `*ngFor`) over manual DOM manipulation.
- Use `trackBy` for lists where identity matters.
- Avoid complex expressions in templates; keep them declarative and simple.

### Forms
- Follow the project’s existing form approach (Reactive Forms vs Template-driven).
- Prefer Reactive Forms for complex validation and state when that pattern is already used.
- Keep validation logic centralized and explicit.

### HTTP & API Access
- Centralize HTTP logic in services; do not call `HttpClient` directly from components.
- Handle errors and response mapping within the service layer when possible.

### Performance
- Avoid unnecessary change detection triggers (mutating objects instead of replacing them when using `OnPush`).
- Use lazy-loaded routes/modules when the project already follows that pattern.
- Avoid heavy synchronous work inside lifecycle hooks.

### Styling & UI Libraries
- Follow existing styling conventions and component libraries.
- Do not introduce new UI frameworks or styling systems unless explicitly requested.

### Consistency
- Match existing naming, folder structure, and Angular patterns (guards, interceptors, resolvers, etc.).
- Do not introduce alternative architectural patterns unless explicitly requested.
