## Yarn (package manager rules)

### Lockfile Discipline
- Treat `yarn.lock` as authoritative; do not hand-edit it.
- Avoid unnecessary lockfile churn:
  - update dependencies only when required by the change
  - do not perform broad upgrades unless explicitly requested
- Keep dependency changes minimal and intentional.

### Yarn Version Awareness
- Follow the repository’s Yarn version and mode:
  - Yarn Classic (v1) vs Yarn Berry (v2+)
  - PnP vs node_modules
- Do not change linker mode (`nodeLinker`), PnP settings, or Yarn version unless explicitly requested.

### Installing & Adding Dependencies
- Prefer `yarn add` / `yarn add -D` instead of editing `package.json` manually.
- Add dependencies at the correct workspace/package scope.
- Avoid adding new dependencies unless there is a clear need.

### Workspaces
- Follow existing workspace structure and boundaries.
- Install dependencies at the narrowest appropriate scope (package vs root).
- Avoid introducing cross-workspace coupling unless it matches existing patterns.

### Scripts
- Use repository-defined scripts (`yarn build`, `yarn test`, etc.) instead of ad-hoc commands.
- Avoid introducing new scripts unless necessary and consistent with existing naming.

### Dependency Resolution
- Pay attention to peer dependency warnings and constraints.
- For Yarn Berry, use `resolutions` or constraints only when necessary.
- Keep overrides minimal and avoid long-term workarounds without clear reason.

### Reproducibility
- Prefer immutable installs in CI (e.g., `yarn install --immutable`) if that is the project convention.
- Avoid commands that modify the lockfile during CI unless explicitly intended.

### Node Version Alignment
- Respect repository Node version constraints (`engines`, `.nvmrc`, Volta, etc.).
- Do not change Node or Yarn versions unless explicitly requested.

### Publishing (if applicable)
- Follow existing versioning and publishing workflows (workspaces, release tools, etc.).
- Do not introduce a new release or versioning strategy unless explicitly requested.
