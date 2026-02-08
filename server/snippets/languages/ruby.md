## Ruby (framework-agnostic)

### Style & Conventions
- Follow existing project conventions and formatting (Rubocop or project style if present).
- Prefer clear, idiomatic Ruby over clever metaprogramming.
- Keep methods short and focused; avoid large, multi-responsibility methods.

### Language Practices
- Prefer keyword arguments for methods with multiple optional parameters.
- Use symbols for identifiers and keys where appropriate.
- Prefer expressive built-in methods (`map`, `each`, `select`, etc.) when they improve readability.
- Avoid dense method chaining that reduces clarity.

### Object Design
- Prefer small, cohesive classes with a single responsibility.
- Avoid large “god objects” or classes with excessive public methods.
- Prefer plain Ruby objects (POROs) over heavy inheritance or mixin hierarchies unless already established.

### Metaprogramming
- Avoid dynamic method creation (`define_method`, `method_missing`, etc.) unless the project already relies on it.
- Prefer explicit methods over dynamic behavior for maintainability and readability.

### Error Handling
- Raise specific exceptions instead of generic `StandardError`.
- Avoid broad `rescue` blocks; rescue only what you expect.
- Do not silently swallow exceptions; add context or re-raise as needed.

### Nil & Safety
- Handle potential `nil` values explicitly.
- Use safe navigation (`&.`) when appropriate, but avoid chaining it excessively where it hides logic errors.
- Validate external input at boundaries before using it internally.

### Mutability & Side Effects
- Avoid unexpected mutation of arguments unless clearly intended.
- Prefer returning new values over modifying inputs in place, unless the method contract implies mutation.

### Dependencies
- Prefer standard library and existing gems already used in the project.
- Do not introduce new gems unless explicitly required.

### Performance Awareness
- Avoid obvious inefficiencies (e.g., repeated database or file operations inside loops).
- Prefer lazy enumerators only when they improve memory or clarity.

### Consistency
- Match existing naming, file organization, and module structure.
- Do not introduce new frameworks or architectural patterns unless explicitly requested.
