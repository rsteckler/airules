## styled-components (addon only)

### Component-Level Styling
- Prefer one styled component per UI element rather than large, multi-purpose styled wrappers.
- Keep styled components close to the component that owns them unless they are clearly shared.
- Avoid creating generic global styled components unless the project already uses a design-system pattern.

### Styling Approach
- Keep styles simple and readable; avoid deeply nested selectors.
- Prefer styling the component directly rather than targeting child elements with complex selectors.
- Avoid styling by element type (`div`, `span`) when a styled component name communicates intent.

### Props & Variants
- Use props for visual variants (`$variant`, `$size`, etc.) rather than creating many separate styled components.
- Prefix styling-only props with `$` (or follow project convention) to avoid leaking them to the DOM.
- Keep variant logic simple; avoid large conditional blocks inside styled templates.

### Theming
- Use the existing theme (`props.theme`) for colors, spacing, and typography.
- Do not introduce new hardcoded design values if theme tokens exist.
- Do not modify the theme structure unless explicitly requested.

### Dynamic Styles
- Avoid heavy runtime style computation.
- Prefer simple conditional styles over complex functions or object-building inside template literals.
- Avoid generating new styled components inside render functions.

### Performance
- Define styled components outside of component render functions.
- Avoid excessive prop-driven re-styling that causes frequent class regeneration.
- Do not create styled components dynamically per render.

### Global Styles
- Use `createGlobalStyle` only if the project already uses global styled patterns.
- Avoid adding new global styles unless explicitly required.

### Consistency
- Match existing naming conventions, file placement, and organization.
- Do not introduce additional styling libraries or mixed styling approaches unless explicitly requested.
