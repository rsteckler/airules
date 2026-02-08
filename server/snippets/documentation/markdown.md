## Markdown Docs Folder (framework-specific rules)

### File Organization
- Follow the existing folder structure and naming conventions.
- Place new documents in the most relevant existing directory.
- Avoid creating new top-level folders unless the content clearly represents a new domain.

### File Naming
- Use descriptive, kebab-case filenames (e.g., `api-authentication.md`, `deployment-docker.md`).
- Keep names stable; avoid renaming files unless necessary (to prevent broken links and history churn).

### Document Structure
- Start each document with a clear H1 title.
- Include a short context/introduction at the top.
- Use a logical heading hierarchy (`##`, `###`) without skipping levels.
- Prefer smaller focused documents over large, catch-all files.

### Linking
- Use relative links between documents.
- Link to canonical sources instead of duplicating content.
- Update links when moving or renaming files.

### Tables of Contents (when appropriate)
- Add a manual TOC only for long documents.
- Avoid automatic TOC generators unless already used in the project.

### Code Blocks
- Always specify the language in fenced code blocks.
- Keep examples minimal and directly relevant.
- Avoid large code dumps when a focused snippet is sufficient.

### Images & Assets
- Store images in the project’s standard location (e.g., `docs/assets/`).
- Use relative paths.
- Prefer diagrams/screenshots only when they add clarity.

### Maintainability
- Avoid duplicating the same instructions across multiple files.
- Remove or consolidate outdated sections instead of adding warnings.
- Keep documents aligned with current behavior and structure.

### Frontmatter / Metadata (if used)
- Follow the project’s existing frontmatter conventions.
- Do not introduce new metadata fields unless already supported.

### Consistency
- Match the existing tone, formatting, and terminology across the docs folder.
- Do not introduce a new documentation structure or format unless explicitly requested.
