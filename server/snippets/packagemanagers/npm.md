## npm (package manager rules)

### Lockfile Discipline
- Treat `package-lock.json` as authoritative; do not hand-edit it.
- Avoid unnecessary lockfile churn:
  - only update dependencies when required by the change
  - do not run broad upgrades unless explicitly requested
- Keep dependency changes minimal and intentional.

### Installing & Adding Dependencies
- Prefer `npm install <pkg>` / `npm install -D <pkg>` rather than editing `package.json` manually.
- Add dependencies at the correct scope (project root vs workspace/package).
- Avoid adding new dependencies unless there is a clear need.

### Workspaces (if used)
- Follow the repository’s existing workspace configuration.
- Install dependencies at the appropriate workspace level.
- Avoid creating cross-workspace coupling unless it matches existing patterns.

### Scripts
- Use repository-defined npm scripts (`npm run build`, `npm run test`, etc.) instead of ad-hoc commands.
- Avoid introducing new scripts unless they are necessary and consistent with existing naming.

### Peer Dependencies
- Pay attention to peer dependency warnings.
- Resolve version conflicts intentionally rather than forcing installs unless the project already allows it.

### Overrides (if used)
- Use `overrides` only when necessary (security fixes, broken transitive dependencies).
- Keep overrides minimal and scoped.
- Avoid long-term overrides without a clear reason.

### Reproducibility
- Prefer `npm ci` in CI environments to ensure clean, deterministic installs.
- Avoid commands that modify the lockfile during CI unless explicitly intended.

### Node Version Alignment
- Respect repository Node version constraints (`engines`, `.nvmrc`, Volta, etc.).
- Do not change Node or npm versions unless explicitly requested.

### Publishing (if applicable)
- Follow existing versioning and publishing conventions.
- Avoid introducing a new release workflow or versioning strategy unless explicitly requested.
