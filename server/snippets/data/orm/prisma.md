## Prisma (SQL ORM) (ORM only)

### Schema & Migrations
- Treat `schema.prisma` as the source of truth; keep it clean and intentional.
- Prefer Prisma Migrate for schema evolution; avoid manual DB drift.
- Keep migrations small; avoid bundling many unrelated changes into one migration.

### Data Access Patterns
- Prefer a small data-access layer (repositories/services) wrapping Prisma calls; avoid scattering `prisma.*` throughout the codebase.
- Keep query shapes explicit; select only needed fields (`select`) rather than pulling full records by default.
- Use `include` intentionally; avoid deep includes that create huge payloads.

### Performance
- Be mindful of N+1 patterns—Prisma won’t magically prevent them.
- Prefer fewer, purposeful queries over many small ones in loops.
- Use pagination patterns consistently (cursor pagination when appropriate).

### Transactions
- Use `$transaction` for multi-step writes that must be atomic.
- Keep transactions short; avoid network calls inside transactions.

### Types & Safety
- Prefer Prisma-generated types; avoid duplicating model shapes manually.
- Keep input validation at the boundary; don’t rely on Prisma errors as validation UX.

### Consistency & Extensibility
- Use Prisma middleware/extensions only when it reduces repetition and is already a project pattern.
- Avoid introducing complex hooks that hide data mutations or make queries hard to trace.
