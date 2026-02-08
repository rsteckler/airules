## Rust (framework-agnostic)

### Idioms & Style
- Follow `rustfmt` formatting and common Rust idioms.
- Prefer clear, explicit code over clever macro-heavy solutions.
- Keep modules cohesive; avoid deep module trees unless the project already uses them.

### Ownership & Borrowing
- Prefer borrowing (`&T`, `&mut T`) over cloning.
- Clone only when it’s clearly necessary; if you clone, keep it close to where it’s needed.
- Prefer `Cow` only when it simplifies APIs and is already in use; avoid introducing it speculatively.

### Error Handling
- Prefer `Result<T, E>` over panics for recoverable errors.
- `panic!` only for programmer errors or impossible states (and keep the invariant local and clear).
- Use `?` for propagation; add context at boundaries where it improves debugging.
- Avoid `unwrap()` / `expect()` in non-test code unless the invariant is provably true; if used, include a clear message with `expect()`.

### Types & Modeling
- Prefer strong domain types over raw strings/ints when it prevents mistakes.
- Prefer `enum` (often with `#[derive]`) for closed sets and state machines.
- Use newtypes to prevent mixing units/identifiers.
- Avoid overly generic APIs; keep trait bounds readable.

### Traits & Generics
- Prefer generics when you truly need compile-time polymorphism; otherwise prefer concrete types for readability.
- Keep trait bounds simple and local; avoid long where-clauses unless it clarifies.
- Don’t introduce complex lifetimes unless necessary; prefer owned types at API boundaries when it reduces lifetime complexity.

### Lifetimes
- Prefer elision-friendly function signatures.
- Avoid returning references tied to complex internal state unless it’s a clear win.
- If lifetime annotations are required, keep them minimal and explain invariants with comments when non-obvious.

### Concurrency
- Prefer safe concurrency with clear ownership (`Arc`, `Mutex`, channels) when needed.
- Avoid holding locks across awaits or long-running work.
- Be explicit about thread-safety (`Send`/`Sync`) requirements where relevant.

### Performance Awareness
- Avoid unnecessary allocations in hot paths.
- Prefer iterators when they stay readable; avoid dense iterator chains that obscure intent.
- Use `&str` and slices for read-only data; allocate `String`/`Vec` only when needed.

### Dependencies
- Prefer the standard library and existing crates already used in the repo.
- Avoid adding new crates unless required; if needed, pick widely used, stable crates and keep usage minimal.

### Unsafe
- Do not introduce `unsafe` unless explicitly requested or absolutely required.
- If `unsafe` is unavoidable, confine it to the smallest possible area and document the invariants.
