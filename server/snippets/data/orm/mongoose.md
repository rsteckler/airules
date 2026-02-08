## Mongoose (MongoDB ODM) (ORM only)

### Schema Discipline
- Define explicit schemas; avoid relying on MongoDB’s implicit flexibility.
- Set appropriate types, required fields, defaults, and indexes in the schema.
- Avoid `Mixed` types unless truly necessary; prefer structured documents.

### Model Usage
- Keep database access localized (services/repositories if the project uses them).
- Avoid calling models directly across unrelated layers.

### Query Discipline
- Fetch only what is needed:
  - use projections (`select`) to limit fields
- Avoid loading large documents when partial data is sufficient.
- Prefer indexed fields for filters and lookups.

### Lean Reads
- Use `.lean()` for read-only queries where document methods/virtuals are not needed.
- Avoid returning full Mongoose documents in hot read paths when plain objects are sufficient.

### Population
- Use `populate` intentionally; avoid deep or nested population chains.
- Be aware that `populate` can create hidden N+1 or large payload issues.
- Prefer embedding or explicit queries when population becomes complex or heavy.

### Validation & Middleware
- Use schema validation for data shape and basic constraints.
- Keep pre/post hooks simple and predictable.
- Avoid heavy logic or external calls inside middleware.

### Updates
- Prefer atomic update operators (`$set`, `$inc`, etc.) instead of read-modify-write patterns.
- Use `findOneAndUpdate` with appropriate options when atomic behavior is required.
- Avoid loading a document just to update a small field.

### Transactions
- Use MongoDB transactions only when multi-document atomicity is required.
- Keep transactions short and avoid external calls inside them.

### Index Awareness
- Ensure queries align with defined indexes.
- Avoid unbounded collection scans in hot paths.

### Consistency
- Follow existing project conventions for:
  - schema organization
  - connection lifecycle
  - data-access layering
- Avoid introducing alternative ODM/data-access patterns alongside Mongoose unless explicitly requested.
