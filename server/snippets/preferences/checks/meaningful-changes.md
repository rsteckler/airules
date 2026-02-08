## Check Policy: Run After Meaningful Changes

You should run linting, tests, and typechecking **after meaningful changes**.

### What Counts as Meaningful
Run checks when changes:
- modify logic or behavior
- affect multiple files or modules
- change public APIs or data structures
- add or remove dependencies
- alter configuration that impacts runtime or build

Do **not** run checks for:
- small formatting or comment-only changes
- minor refactors with no behavioral impact
- exploratory or partial edits still in progress

### Scope of Checks
Run the project’s standard validation:
- lint
- tests
- typecheck
- coverage (if part of the normal workflow)

### Behavior
- Run checks once per meaningful change batch, not after every small edit.
- Summarize failures concisely and focus on actionable issues.
- Do not repeatedly rerun checks unless fixes were made.

### Principle
Balance safety with speed: validate behavior changes without slowing iteration.
