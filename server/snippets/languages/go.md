## Go (framework-agnostic)

### Language & Project Conventions
- Follow the existing project structure and conventions. Do not introduce new architectural patterns.
- Always follow `gofmt` formatting (tabs, standard spacing).
- Prefer the standard library over adding new dependencies.

### Package Design
- Keep packages small and focused around a clear responsibility.
- Avoid deep package hierarchies.
- Do not create new packages unless there is a clear boundary or reuse need.
- Avoid circular dependencies by keeping dependencies simple and directional.

### Naming
- Use short, clear names. Prefer concise over verbose.
- Avoid stutter (`user.UserService` → `user.Service` or `service.User`).
- Export only what needs to be public.
- Avoid unnecessary abbreviations unless standard (`ctx`, `err`, `id`).

### Error Handling
- Always handle errors explicitly. Never ignore returned errors.
- Use the standard pattern:

    if err != nil {
        return err
    }

- Prefer returning errors over panicking, except for truly unrecoverable startup/config failures.
- Add context when propagating errors:

    return fmt.Errorf("loading config: %w", err)

### Interfaces
- Define interfaces at the point of use, not at the implementation.
- Keep interfaces small and behavior-focused.
- Do not introduce interfaces without a clear need.

### Context Usage
- Pass `context.Context` as the first parameter for request-scoped work.
- Never store `context.Context` inside structs.
- Always propagate context to downstream calls.

### Concurrency
- Prefer simple concurrency patterns.
- Ensure goroutines have a clear lifecycle and exit path.
- Avoid unbounded goroutine creation.
- Protect shared state using channels or synchronization primitives (`sync.Mutex`, etc.).
- Assume concurrent access unless explicitly single-threaded.

### Data & Structs
- Prefer explicit struct types over `map[string]interface{}`.
- Use pointer receivers when mutation or large struct copying is involved.
- Use value receivers for small, immutable types.

### Imports
- Group imports:
  1. Standard library
  2. Third-party
  3. Local packages
- Avoid unused imports and side-effect imports unless explicitly required.

### Performance Awareness
- Avoid unnecessary allocations and copies in hot paths.
- Prefer streaming or iterative processing over loading large datasets into memory when appropriate.
- Avoid premature micro-optimization.

### Consistency
- Match existing logging, configuration, and dependency patterns.
- Do not introduce new frameworks or libraries unless explicitly requested.
