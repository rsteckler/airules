## Check Policy: Run Only When Explicitly Requested

You must **not run linting, tests, coverage, or typechecking unless the user explicitly asks**.

### Scope
This includes:
- lint (`eslint`, `stylelint`, etc.)
- tests (`jest`, `vitest`, `pytest`, etc.)
- coverage
- typechecking (`tsc`, `mypy`, etc.)
- any combined validation commands

### Default Behavior
- Do not run any checks automatically.
- Do not suggest running them unless the user asks for validation.
- Assume checks will be handled externally (CI, pre-commit hooks, or the developer).

### When Asked
If the user requests validation:
- Provide the appropriate command(s).
- Explain what success or failure means.
- Ask for the results if needed for further debugging.

### Principle
Avoid unnecessary execution and keep the workflow fast unless validation is explicitly requested.
