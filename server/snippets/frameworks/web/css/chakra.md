## Chakra UI (addon only)

### Component Usage
- Prefer Chakra components over raw HTML when an equivalent exists.
- Use the highest-level component that fits the use case (`Button`, `Input`, `FormControl`, etc.) instead of recreating common patterns.
- Avoid reimplementing built-in behavior that Chakra already provides.

### Styling Approach
- Prefer Chakra style props (`p`, `m`, `color`, `bg`, etc.) over custom CSS.
- Use the `sx` prop or `__css` only if the project already uses them.
- Avoid mixing Chakra style props with external styling systems unless the project already does so.

### Layout & Composition
- Prefer Chakra layout primitives:
  - `Stack` / `HStack` / `VStack` for spacing
  - `Flex` for one-dimensional layout
  - `Grid` / `SimpleGrid` for grid layouts
- Avoid manual margin spacing when a `Stack` pattern is appropriate.

### Theme Usage
- Use theme tokens for spacing, colors, typography, and sizes.
- Avoid hardcoded values when a theme token exists.
- Do not modify or extend the theme structure unless explicitly requested.

### Variants & Props
- Prefer built-in variants (`variant`, `size`, `colorScheme`) over custom styling.
- Keep styling consistent with existing component usage across the codebase.
- Avoid heavy inline style logic; keep prop usage simple and declarative.

### Performance
- Avoid recreating large style objects inline in frequently rendered components.
- Do not wrap components unnecessarily when style props or composition achieve the same result.

### Accessibility
- Preserve Chakra’s accessibility defaults.
- Use `FormControl`, `FormLabel`, and related components for form accessibility.
- Do not remove focus styles or ARIA behavior unless replaced with an equivalent.

### Custom Components
- Prefer composing Chakra primitives rather than building custom styled wrappers from scratch.
- If creating reusable components, follow existing project patterns for abstraction.

### Consistency
- Match the project’s Chakra version and styling conventions.
- Do not introduce additional UI frameworks or mixed component systems unless explicitly requested.
