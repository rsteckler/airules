## go test (framework-specific rules)

### Table-Driven Tests
- Prefer table-driven tests for multiple input/output scenarios.
- Keep table cases readable and named (`name` field) for clear failure output.
- Avoid overly large tables that obscure intent; split into focused tests when needed.

### Test Structure
- Follow the standard pattern:
  - Arrange → Act → Assert
- Keep tests small and focused on one behavior.
- Avoid complex control flow inside tests.

### Subtests
- Use `t.Run()` for grouping related scenarios.
- Ensure subtests are independent; avoid shared mutable state across subtests unless explicitly controlled.

### Error Handling
- Fail fast for setup errors using `t.Fatal` / `t.Fatalf`.
- Use `t.Errorf` only when continuing the test provides additional useful failures.

### Helpers
- Extract helpers only when they improve clarity and reduce duplication.
- Mark helper functions with `t.Helper()` so failure locations point to the caller.

### Parallelism
- Use `t.Parallel()` only when tests are safe to run concurrently.
- Avoid parallel tests if they share global state, environment variables, ports, or filesystem locations.

### Test Data & Files
- Use `t.TempDir()` for filesystem interactions.
- Avoid writing to real project directories or relying on pre-existing local state.

### Environment & Globals
- Use `t.Setenv()` for environment variables instead of manual cleanup.
- Avoid relying on global mutable state; reset any modified globals.

### Time & Flake Resistance
- Avoid fixed sleeps.
- Prefer condition-based waiting or controllable clocks when testing timing behavior.

### External Dependencies
- Keep tests deterministic; avoid real network calls unless explicitly an integration test.
- Stub or use local test servers (`httptest`) for HTTP dependencies.

### Test Naming & Organization
- Use descriptive test names: `TestXxxBehavior`.
- Keep tests in the same package unless black-box testing (`package foo_test`) is intentionally required.

### Benchmarks & Examples (if used)
- Keep benchmarks (`BenchmarkXxx`) isolated and focused.
- Avoid allocations or setup inside the benchmark loop unless that cost is part of what’s being measured.
