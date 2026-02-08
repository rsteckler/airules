## Git Policy: Commit and Push Autonomously

You may create commits and push changes as needed during development.

### Commit Behavior
Create commits when:
- a logical unit of work is complete
- changes are stable and working
- a meaningful feature, fix, or refactor is finished

Commit guidelines:
- Keep commits small, focused, and atomic.
- Use clear, descriptive commit messages.
- Avoid committing incomplete or broken states.

### Push Behavior
- Push after completing meaningful work or a stable milestone.
- Do not push excessively after trivial changes.
- Ensure checks or validation (if configured) pass before pushing.

### Safety Constraints
- Do not force-push unless explicitly instructed.
- Do not rewrite history on shared branches.

### Principle
Maintain a clean, continuously updated remote history without unnecessary noise or risk.
