## Sass / SCSS (addon only)

### Scope & Usage
- Use Sass features only where they improve clarity or reuse.
- Do not introduce Sass-specific patterns if the project primarily uses plain CSS.
- Avoid overengineering with mixins/functions for simple styles.

### Nesting
- Keep nesting shallow (max 2–3 levels).
- Avoid deep selector pyramids that increase specificity and reduce maintainability.
- Do not nest for structure alone—nest only when there is a real parent-child relationship.

### Variables
- Prefer existing design tokens or variables; do not introduce new global variables unless necessary.
- Keep variable scope as local as possible.
- Avoid duplicating values that already exist in theme/config files.

### Mixins & Functions
- Use mixins for true reuse (e.g., cross-browser patterns, repeated complex styles).
- Avoid creating mixins for simple one-line utilities.
- Keep mixins small and predictable; avoid hidden side effects.
- Prefer arguments over hardcoded values.

### Partials & Imports
- Follow the project’s structure for partials (`_file.scss`) and imports.
- Avoid circular imports.
- Do not reorganize the Sass architecture unless explicitly requested.

### Performance & Output
- Avoid generating large amounts of redundant CSS via loops or overly broad mixins.
- Be mindful of selector duplication and output size.

### Modern Practices
- Prefer `@use` / `@forward` if the project uses modern Sass modules.
- Do not introduce legacy `@import` if the project has migrated to the module system.

### Consistency
- Match the project’s naming, file organization, and Sass conventions.
- Do not introduce additional CSS frameworks or change the build pipeline unless explicitly requested.
