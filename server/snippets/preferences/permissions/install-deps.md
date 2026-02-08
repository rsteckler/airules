## AI Permission Required: Installing Packages

You must **ask for permission before installing or adding any dependency**.

### Rule
Before installing packages:
1. Explain **which package(s)** will be installed.
2. Explain **why they are needed**.
3. Mention:
   - added complexity
   - security or maintenance considerations
   - bundle size or performance impact (if relevant)
4. Ask for explicit approval.

Do not install dependencies unless the user confirms.

### After Approval
- Install only the approved packages.
- Use the project’s package manager.
- Avoid unnecessary transitive additions.

### Default Behavior
Prefer:
- existing project dependencies
- native/platform capabilities
- simple implementations over new libraries

Dependency changes affect long-term maintenance and must be intentional.
