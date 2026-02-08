## Material UI (MUI) (addon only)

### Component Usage
- Prefer MUI components over custom HTML when a suitable component exists.
- Use the highest-level component that fits the use case (e.g., `TextField` instead of manually composing `Input` + `FormControl`).
- Avoid reimplementing built-in behaviors that MUI already provides.

### Styling Approach
- Follow the project’s established styling method:
  - `sx` prop (preferred if already used)
  - `styled`
  - theme overrides
- Do not mix multiple styling approaches unless the project already does so.
- Prefer `sx` for small, component-local styles rather than creating separate wrappers.

### Theme Usage
- Use theme tokens for spacing, colors, typography, and breakpoints (`theme.palette`, `theme.spacing`, etc.).
- Avoid hardcoded design values when theme equivalents exist.
- Do not modify the theme structure unless explicitly requested.

### Layout & Composition
- Prefer MUI layout primitives (`Box`, `Stack`, `Grid`) instead of custom layout CSS when consistent with the project.
- Use `Stack` for simple spacing/layout patterns instead of manual margin utilities.

### Props & Variants
- Prefer built-in component variants (`variant`, `size`, `color`) over custom styling.
- Avoid overriding styles when a standard prop or variant achieves the same result.
- Keep prop usage consistent with existing patterns across the codebase.

### Performance
- Avoid inline object recreation for `sx` or style props in frequently re-rendered components when stability matters.
- Do not wrap large parts of the tree in unnecessary styled wrappers.

### Accessibility
- Preserve MUI’s accessibility defaults.
- Do not remove labels, focus behavior, or ARIA attributes unless replaced with an equivalent.

### Customization
- Prefer theme-level customization for shared behavior rather than repeating style overrides across components (if the project already uses theme overrides).
- Avoid deep class selector overrides (`.MuiX-root`) unless there is no supported API for the change.

### Consistency
- Match the project’s MUI version (v4/v5) and patterns.
- Do not introduce additional UI libraries or alternative component systems unless explicitly requested.
