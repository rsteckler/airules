## CSS Modules (addon only)

### Scoping & Ownership
- Treat each `*.module.css` file as owned by its component/feature.
- Keep styles local; avoid “global” styling patterns inside CSS Modules unless the project explicitly supports them.
- Do not create catch-all utility modules; prefer component-level ownership.

### Naming
- Use clear, component-oriented class names:
  - `root`, `container`, `header`, `title`, `content`, `actions`, etc.
- Avoid overly generic names that encourage cross-component reuse (`.button`, `.card`) unless the module is explicitly shared.
- Prefer `isX` / `hasX` / `variantX` conventions for state/variants if that’s consistent with the codebase.

### Composition
- Prefer composing UI via components rather than composing many classes.
- Use `composes:` only if the project already uses it and has a consistent convention.

### Variants & State
- Prefer explicit variant classes (`.primary`, `.danger`, `.compact`) over highly specific selectors.
- Keep selectors shallow; avoid deep descendant chains even inside modules.
- Avoid encoding complex state in selector specificity; prefer toggling classes.

### Global Escapes
- Avoid `:global(...)` except for:
  - integrating with third-party markup you don’t control
  - targeting a known global wrapper/class required by the app
- If `:global` is necessary, keep it narrowly scoped and documented.

### Interop with Component Code
- Keep the mapping from component state → class names explicit and readable.
- Avoid dynamic string concatenation for class names if the project uses a helper (`clsx`, etc.); follow existing patterns.

### File Hygiene
- Keep module files small; delete unused classes when touched.
- Avoid duplicating identical styles across many modules; prefer shared components or existing design tokens/utilities.

### Consistency
- Match the project’s module naming, file placement, and conventions.
- Do not introduce new build tooling or naming conventions unless explicitly requested.
