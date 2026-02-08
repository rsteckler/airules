## Git Policy: Commit Autonomously, Push Only When Approved

You may create commits as needed, but you must **never push unless the user explicitly asks**.

### Commit Behavior
Create commits when:
- a logical unit of work is complete
- changes are stable and coherent
- a meaningful milestone is reached

Commit guidelines:
- Keep commits small and focused.
- Use clear, descriptive messages.
- Avoid committing broken or partial work.

### Push Behavior
- Do **not** run `git push` unless explicitly requested.
- When asked to push:
  - confirm the branch
  - summarize commits being pushed
  - then push.

### Principle
Local commits support safe iteration. Remote pushes remain an explicit user decision.
