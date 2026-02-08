## Next.js (App Router only)

### Routing & Rendering Model
- Use the App Router mental model: Server Components by default, Client Components only when needed.
- Keep pages/layouts as thin orchestration; push UI into components and data access into server-side functions.
- Prefer route segments + nested layouts over manual conditional layout logic.

### Server vs Client Components
- Default to Server Components; add `"use client"` only when you need:
  - local state (`useState`, `useReducer`)
  - effects (`useEffect`)
  - browser-only APIs (`window`, `document`)
  - event handlers on the component boundary
- Minimize the surface area of Client Components: keep them small and leaf-y.
- Do not import server-only code into Client Components (db access, server secrets, filesystem, etc.).

### Data Fetching
- Prefer fetching on the server (in Server Components / server actions / route handlers) when possible.
- Keep a single data-fetch boundary per route when practical; avoid scattered fetches across many components.
- Respect caching semantics; don’t disable caching globally without a clear reason.
- Avoid duplicating the same fetch across server components; share via a single function or co-located fetch.

### Server Actions
- Use Server Actions for mutations that belong to the route/page boundary.
- Validate inputs on the server; treat all client input as untrusted.
- Keep Server Action modules server-only; never leak secrets to the client.

### Route Handlers
- Use `app/api/.../route.ts` for API endpoints.
- Return proper status codes and content types.
- Avoid shipping large logic into route handlers; call into service modules.

### Navigation & Params
- Use `next/link` for internal navigation.
- Use `useRouter`/`useSearchParams` only in Client Components.
- Prefer `params` and `searchParams` passed into route components for server-side access.

### Metadata
- Use `generateMetadata` / route `metadata` export for SEO and social tags.
- Keep metadata generation server-side; avoid client-side document mutation.

### Assets & Images
- Use `next/image` when appropriate and consistent with the project.
- Prefer colocated route assets in `public/` following existing conventions.

### Environment & Secrets
- Never access server secrets from Client Components.
- Respect Next.js env var rules (`NEXT_PUBLIC_` only for client-safe values).

### Performance & Bundling
- Avoid pulling large dependencies into Client Components.
- Prefer dynamic import for truly heavy client-only code when it improves initial load.

### Project Consistency
- Follow existing conventions for folder structure, naming, and route organization.
- Do not introduce alternative routing patterns or custom servers unless explicitly requested.
