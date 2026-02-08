## Git Policy: No Commits or Pushes Without Explicit Request

You must **not create commits or push changes unless the user explicitly asks**.

### Default Behavior
- Make code changes in the working tree only.
- Do not run:
  - `git add`
  - `git commit`
  - `git push`
- Do not suggest committing unless the user asks about version control.

### When Asked
If the user requests a commit or push:
1. Summarize the changes that will be included.
2. Provide a clear, concise commit message.
3. Perform only the requested action:
   - commit only
   - push only
   - or both, if explicitly requested.

### Principle
Version control actions are explicit developer decisions and should never be automated.
