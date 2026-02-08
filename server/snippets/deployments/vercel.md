## Vercel (deployment target rules)

### Mental Model
- Treat Vercel as a Git-driven build + deploy platform with opinionated defaults.
- Optimize for fast, repeatable builds and predictable runtime behavior.

### Project Structure & Routing
- Align deployment with the framework’s intended Vercel integration (e.g., Next.js routing/build outputs).
- Avoid custom server assumptions unless the project explicitly uses Vercel serverless/edge functions.
- Keep rewrites/redirects minimal and explicit; avoid “magic” routing rules.

### Environment & Secrets
- Use Vercel Environment Variables for all secrets and environment-specific config.
- Separate variables by environment (Development / Preview / Production).
- Never commit secrets to the repo; never bake secrets into client bundles.

### Preview Deployments
- Treat Preview as production-like:
  - same build steps
  - same env var structure (with preview-safe values)
- Avoid preview-only hacks that diverge behavior from production.

### Build Performance
- Minimize build work:
  - avoid heavy postinstall scripts
  - avoid building unused packages in monorepos
- Use caching intentionally; make builds deterministic so caching is reliable.
- Prefer framework-native build outputs; avoid bespoke bundling steps unless required.

### Monorepos
- Use explicit root/build settings (project root, build command, output dir) per app.
- Avoid cross-app coupling in build steps.
- Ensure workspace tooling (pnpm/yarn/npm) is configured consistently with the repo.

### Serverless / Edge Functions (when used)
- Keep functions small, stateless, and fast.
- Avoid long-running work inside a request handler; push heavy work to external systems if needed.
- Be mindful of runtime differences (Edge vs Node), especially APIs and libraries.

### External Dependencies
- Prefer managed services for DB/queues/cache when deploying on Vercel (stateless compute assumption).
- Do not assume local filesystem persistence between invocations.

### Networking & Security
- Use allowed origins / CORS settings intentionally where applicable.
- Restrict access to admin/internal endpoints (auth + additional guards if needed).
- Avoid exposing internal service URLs to the client.

### Observability
- Ensure deploys emit enough logs to debug production issues.
- Prefer structured logging where feasible; avoid logging sensitive data.

### Rollouts & Safety
- Prefer incremental rollout patterns when possible (feature flags, gradual exposure).
- Treat config changes (redirects, env vars, build settings) as production changes.

### Consistency
- Follow existing repo conventions for Vercel config (`vercel.json`), environment variables, and build commands.
- Do not introduce new deployment patterns (custom servers, alternate hosting) unless explicitly requested.
