## PostCSS (addon only)

### Purpose & Scope
- Use PostCSS as the project’s established CSS processing layer (autoprefixing, nesting, imports, minification, etc.).
- Do not introduce new PostCSS plugins or change the pipeline unless explicitly requested.

### Authoring Conventions
- Write standard, compatible CSS first; rely on PostCSS features only where the project already uses them.
- Prefer native CSS features when supported by the project’s target browsers over plugin-only syntax.

### Plugin Usage
- If nesting is enabled, keep nested rules shallow and readable; avoid deep selector pyramids.
- If `postcss-import` is used, keep import structure simple and avoid circular imports.
- If custom properties are used, prefer existing variables/tokens; avoid inventing new global tokens.

### Compatibility
- Assume Autoprefixer is present; do not hand-write vendor prefixes unless the project requires it.
- Avoid relying on experimental syntax unless it is clearly supported by the current PostCSS config.

### Debuggability
- Keep transformations predictable; avoid “magic” macros or unusual plugin behavior.
- If a styling issue appears build-related, inspect the existing PostCSS config and follow its intent rather than patching with hacks.

### Consistency
- Match the project’s PostCSS config location and conventions (`postcss.config.js`, etc.).
- Do not modify PostCSS/Tailwind configs unless explicitly requested.
