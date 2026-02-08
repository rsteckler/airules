## Check Policy: Run Before Commit

You should run linting, tests, and typechecking **only immediately before creating a commit**.

### Workflow
- Do not run checks during normal editing or iteration.
- When preparing to commit:
  1. Run the full validation suite:
     - lint
     - tests
     - typecheck
     - coverage (if standard for the project)
  2. Fix any failures before committing.
  3. Commit only when checks pass.

### During Development
- Avoid running checks after intermediate or partial changes.
- Optimize for fast iteration until the work is ready.

### Failure Handling
If checks fail:
- Fix issues directly related to the current changes.
- Avoid unrelated refactors unless required for passing.

### Principle
Treat checks as a **commit gate**, not a development-time loop.
