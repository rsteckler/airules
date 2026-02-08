## Astro (framework only)

### Rendering Model
- Default to Astro’s server-first model; ship zero client JavaScript unless interaction requires it.
- Prefer static rendering where possible; avoid introducing client-side behavior for purely presentational content.
- Keep `.astro` files focused on layout, structure, and composition.

### Client Hydration
- Use `client:*` directives intentionally and minimally:
  - `client:load` only when immediate interactivity is required
  - `client:visible` or `client:idle` for non-critical interaction
- Avoid hydrating large components when only a small interactive part is needed.
- Prefer isolating interactivity into small, leaf components.

### Component Boundaries
- Keep Astro components primarily presentational.
- Move business logic and data access to server-side script sections or shared service modules.
- Prefer composition of small components over large monolithic pages.

### Data Loading
- Fetch data in the server script section (`---`) rather than inside hydrated client components when possible.
- Avoid duplicate data fetching between server and client.
- Treat all external data as untrusted; validate or normalize at the boundary.

### Framework Integrations
- Follow existing framework usage (React, Vue, Svelte, etc.) if the project integrates one.
- Do not introduce a new client framework unless explicitly requested.
- Prefer Astro-native components over framework components when no client interactivity is needed.

### Routing & Content
- Follow file-based routing conventions.
- Prefer content collections when the project uses them; keep content structure consistent.
- Keep page files thin and compose layouts/components for reuse.

### Assets & Performance
- Use Astro’s built-in asset handling (`<Image />` or project conventions) when available.
- Avoid large client bundles; ensure heavy libraries are not pulled into hydrated components unnecessarily.

### Styling
- Follow the project’s styling approach (scoped styles, global CSS, Tailwind, etc.).
- Prefer component-scoped styles when appropriate.
- Do not introduce a new styling system unless explicitly requested.

### Consistency
- Match existing file organization, layout patterns, and integration choices.
- Avoid patterns that increase client JavaScript or bypass Astro’s server-first architecture.
