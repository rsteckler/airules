## Java / Kotlin (framework-agnostic)

### General Conventions
- Follow existing project conventions (Gradle/Maven layout, package naming, code style). Do not introduce new architectural patterns.
- Prefer standard library and existing dependencies; avoid adding new libraries unless required.
- Keep code explicit and readable; avoid clever metaprogramming or “magic” patterns.

### Nullability & Safety
- Kotlin:
  - Prefer non-null types; avoid `!!` except when you can prove the invariant locally.
  - Use safe calls (`?.`), `let`, and explicit `requireNotNull` with a clear message when needed.
- Java:
  - Treat nulls defensively at boundaries; validate inputs early.
  - If the project uses `@Nullable/@NonNull` annotations, maintain and extend them consistently.

### Immutability & Data Modeling
- Prefer immutable data where practical.
- Kotlin:
  - Use `data class` for simple DTOs/domain shapes.
  - Prefer `val` over `var`.
  - Use sealed hierarchies (`sealed interface/class`) for closed sets and state machines.
- Java:
  - Prefer records (if used in the project) for simple data carriers.
  - Avoid mutable POJOs when shape is stable; keep setters limited.

### Exceptions & Error Handling
- Throw specific exceptions, not generic `Exception`.
- Do not swallow exceptions. Add context when rethrowing.
- Use checked exceptions only if the project already relies on them; don’t introduce new checked exception patterns.

### Collections & Streams
- Prefer straightforward loops when they are clearer than functional chains.
- Avoid deeply nested stream/sequence pipelines that obscure control flow.
- Be mindful of intermediate allocations in chains; keep transformations simple.

### Concurrency
- Avoid shared mutable state across threads unless properly synchronized.
- Kotlin coroutines:
  - Follow existing coroutine usage; don’t introduce coroutines if the project is not coroutine-based.
  - Respect structured concurrency; avoid `GlobalScope`.
  - Ensure coroutine lifetimes are clearly scoped.
- Java concurrency:
  - Prefer existing executor patterns; ensure tasks have cancellation/timeout where appropriate.

### APIs & Visibility
- Keep visibility as narrow as possible (`private`/`internal` by default).
- Avoid leaking internal implementation types across module boundaries.
- Prefer small, stable method signatures over wide “options bags” unless the codebase already uses them.

### Logging & Observability
- Follow the existing logging framework and patterns (SLF4J, Log4j, etc.).
- Avoid logging secrets or sensitive payloads.
- Prefer structured/contextual logging if the project already uses it.

### Performance Awareness
- Avoid obvious inefficiencies (repeated expensive work in loops, unnecessary object creation).
- Prefer lazy/sequence processing only when it improves clarity or avoids large allocations.

### Interop Notes (Java ↔ Kotlin)
- Keep interop clean: avoid Kotlin-specific features in APIs intended for Java callers unless the project is Kotlin-only.
- Be explicit about nullability at module boundaries.
