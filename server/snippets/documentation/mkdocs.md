## MkDocs (framework-specific rules)

### Content Organization
- Follow the structure defined in `mkdocs.yml` (`nav` section).
- Add new pages to the appropriate existing section; avoid creating new top-level navigation groups unless clearly necessary.
- Keep navigation shallow and easy to scan.

### Navigation Updates
- When adding or renaming documents, update `mkdocs.yml` accordingly.
- Preserve navigation order and grouping conventions used by the project.
- Avoid orphaned pages that are not included in the navigation.

### File Structure & Naming
- Use descriptive, kebab-case filenames.
- Place files in the appropriate folder to reflect the navigation hierarchy.
- Avoid unnecessary folder depth.

### Markdown Conventions
- Start each page with a clear H1 title.
- Use consistent heading hierarchy (`##`, `###`) without skipping levels.
- Prefer smaller focused pages over long, monolithic documents.

### Linking
- Use relative links between pages.
- Prefer linking to canonical content instead of duplicating information.
- Ensure links remain valid after file moves or renames.

### Code Blocks
- Always specify the language for fenced code blocks.
- Keep examples minimal, realistic, and easy to scan.
- Avoid large code dumps when a focused snippet is sufficient.

### Extensions & Plugins
- Follow the existing Markdown extensions (e.g., admonitions, tabs) already configured.
- Do not introduce new plugins, themes, or extensions unless explicitly requested.

### Assets & Media
- Place images and assets in the project’s standard docs/static location.
- Use relative paths.
- Optimize images for size and clarity.

### Versioning (if used)
- Add content to the correct version branch or structure.
- Avoid modifying historical versions unless fixing critical errors.

### Build & Performance
- Keep pages lightweight; avoid embedding large or heavy assets.
- Ensure documentation builds successfully with the existing MkDocs configuration.

### Consistency
- Match existing tone, formatting, navigation style, and page layout.
- Do not introduce a new documentation structure, theme, or navigation model unless explicitly requested.
