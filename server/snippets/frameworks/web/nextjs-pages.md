## Next.js (Pages Router only)

### Routing & Structure
- Use the `pages/` directory routing model; follow file-based routing conventions.
- Keep page files thin; move UI into components and logic into services/hooks.
- Avoid mixing App Router patterns (`app/`, Server Components, server actions) into a Pages Router project.

### Data Fetching
- Use the appropriate data method based on the use case:
  - `getStaticProps` for static content
  - `getServerSideProps` for request-time data
  - `getStaticPaths` for dynamic SSG routes
- Do not fetch the same data both in `get*Props` and again on the client unless required.
- Keep data-fetch logic centralized (services or API layer), not embedded directly in pages.

### Client vs Server Boundaries
- Code inside `getServerSideProps` / `getStaticProps` runs server-side only.
- Do not reference browser APIs (`window`, `document`) in server-side code.
- Do not expose secrets or server-only values through props unintentionally.

### API Routes
- Use `pages/api/*` for backend endpoints.
- Keep handlers thin; delegate business logic to shared service modules.
- Return proper status codes and structured JSON responses.
- Validate all external input.

### Navigation
- Use `next/link` for internal navigation.
- Use `next/router` for client-side routing logic when necessary.
- Avoid full page reloads for internal navigation.

### Rendering Behavior
- Prefer static generation when possible for performance.
- Use server-side rendering only when data must be request-specific.
- Avoid unnecessary client-side data fetching that duplicates server work.

### Head & Metadata
- Use `next/head` to manage page titles and meta tags.
- Keep metadata logic inside the page component, not scattered across children.

### Assets & Images
- Follow existing conventions for static assets (`public/`).
- Use `next/image` if the project already uses it; do not introduce it mid-project without consistency.

### Environment & Configuration
- Respect Next.js environment variable rules.
- Only expose client-safe variables with the `NEXT_PUBLIC_` prefix.
- Never leak secrets to the client through props or API responses.

### Performance Awareness
- Avoid importing large dependencies directly into pages if only needed client-side.
- Use dynamic imports (`next/dynamic`) when it meaningfully reduces initial bundle size.

### Project Consistency
- Match existing folder structure, naming, and data-fetch patterns.
- Do not introduce App Router features or custom server setups unless explicitly requested.
