## JavaScript (framework-agnostic)

### Language & Runtime Assumptions
- Prefer modern JS (ES2020+). Use `async/await` over raw Promise chains unless it’s genuinely clearer.
- Don’t introduce transpilation/polyfills unless the repo already uses them and the target requires it.
- Keep module style consistent (ESM vs CJS). Do not mix without a concrete reason.

### Semantics & Footguns
- Use `const` by default; use `let` only when reassignment is necessary; avoid `var`.
- Prefer strict equality (`===`, `!==`) unless you have a specific coercion need and document it.
- Avoid relying on truthiness for non-boolean values at boundaries; be explicit (`value != null`, `Array.isArray`, `typeof` checks).
- Avoid mutating inputs unless the function contract clearly says so; prefer returning new values.

### Data Handling & Validation
- Treat all external input as untrusted; validate/normalize at the boundary before business logic.
- Prefer narrow “shape checks” (guards) at boundaries instead of assuming properties exist.
- When parsing JSON, assume it can be malformed or unexpected; handle failures explicitly.

### Errors & Control Flow
- Prefer throwing `Error` (or subclasses) rather than strings/objects.
- Never silently ignore errors. If you intentionally suppress, leave a clear comment explaining why and what is safe.
- When catching, preserve causality if supported (e.g., include original error context).

### Style & Maintainability
- Prefer small, single-purpose functions with clear names.
- Avoid clever one-liners when they reduce clarity; write the obvious code.
- Avoid “action at a distance”: no hidden global state changes, no monkey patching.

### Imports / Dependencies
- Prefer explicit imports to reduce hidden coupling.
- Avoid introducing new runtime dependencies unless asked; use built-in platform features first.

### Node vs Browser
- Don’t assume Node-only globals (`process`, `Buffer`) in code that might run in browsers.
- Don’t assume browser APIs (`window`, `document`) in code that might run in Node.
- If a module must be environment-specific, make that explicit in naming and structure.
