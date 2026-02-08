## TypeDoc (framework-specific rules)

### Source of Truth
- Treat TypeDoc as the primary source for API reference.
- Do not duplicate API documentation in separate Markdown files if it is generated from code.

### Doc Comment Discipline
- Document public APIs only (exports, public classes, methods, types).
- Avoid documenting internal or private members unless the project explicitly exposes them.
- Keep comments concise and focused on:
  - what it does
  - key parameters
  - return value
  - important side effects or constraints

### Comment Style
- Use standard TSDoc/JSDoc tags consistently:
  - `@param`
  - `@returns`
  - `@throws` (when meaningful)
  - `@example` (for complex or non-obvious usage)
- Avoid redundant comments that restate obvious type information.

### Examples
- Include short, realistic examples for non-trivial APIs.
- Keep examples minimal and focused on correct usage.
- Avoid large or multi-step code blocks unless necessary.

### Public API Awareness
- Treat documented exports as part of the public contract.
- Avoid changing public signatures or behavior without updating comments accordingly.
- Remove or update comments when APIs change.

### Organization
- Follow existing module/namespace structure; do not reorganize exports solely for documentation.
- Prefer clear module boundaries over large, catch-all files.

### Links & References
- Use TypeDoc’s inline linking (`{@link ...}`) to reference related types or APIs.
- Avoid hardcoded URLs to generated docs.

### Build & Configuration
- Follow the existing TypeDoc configuration.
- Do not introduce new plugins, themes, or output formats unless explicitly requested.

### Consistency
- Match existing tone and level of detail across doc comments.
- Avoid mixing multiple documentation styles within the same project.
