## Python (framework-agnostic)

### Language & Version Assumptions
- Target modern Python (3.10+ unless the project specifies otherwise).
- Use standard library features before introducing new dependencies.
- Follow the project’s packaging and environment conventions (venv, poetry, pip, etc.). Do not introduce a new toolchain.

### Style & Structure
- Follow PEP 8 and existing project formatting conventions.
- Prefer explicit, readable code over compact or clever constructs.
- Keep functions small and single-purpose.
- Avoid deeply nested logic; use early returns where it improves clarity.

### Typing (when used)
- Match the project’s typing level. If types are present, maintain and extend them.
- Prefer standard typing (`list[str]`, `dict[str, int]`) over legacy `typing.List` forms in modern code.
- Avoid adding heavy or complex type constructs unless they clearly improve safety or readability.

### Data Modeling
- Prefer `dataclasses` or simple classes for structured data instead of loose dictionaries when structure is known.
- Avoid passing large unstructured dicts through multiple layers.
- Keep domain models separate from external/raw data when possible.

### Error Handling
- Raise specific exceptions instead of generic `Exception`.
- Do not silently swallow exceptions.
- Avoid broad `except:` blocks; catch the narrowest relevant exception.
- When re-raising, preserve context.

### Imports & Modules
- Use absolute imports unless the project consistently uses relative ones.
- Keep imports at the top of the file and grouped:
  1. Standard library
  2. Third-party
  3. Local modules
- Avoid circular imports by keeping module boundaries clear.

### Mutability & State
- Avoid mutable default arguments (`def fn(x=[])`).
- Prefer immutable data or explicit copying when mutation could create side effects.
- Avoid hidden global state unless the project explicitly relies on it.

### I/O & Boundaries
- Treat external input (files, environment variables, network data) as untrusted.
- Validate and normalize data at the boundary before passing it deeper into the system.

### Performance Awareness
- Avoid obvious inefficiencies (repeated expensive work inside loops, unnecessary large copies).
- Prefer generator expressions or streaming when handling large datasets, if consistent with the project.

### Consistency
- Match the project’s naming conventions, logging patterns, and module organization.
- Do not introduce new architectural patterns or frameworks unless explicitly requested.
