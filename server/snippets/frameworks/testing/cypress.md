## Cypress (framework-specific rules)

### Selector Strategy
- Prefer stable selectors:
  - `data-testid` / `data-cy` (or project’s convention)
- Avoid brittle selectors (deep CSS chains, class names, DOM structure).
- Don’t overuse `contains()` for critical flows unless the text is a stable contract.

### Command Chaining & Yielding
- Treat Cypress commands as async and chained; never mix with raw sync DOM reads unless you understand the yield.
- Avoid storing yielded elements in variables for later use; re-query via `cy.get()`/`cy.find()` when needed.
- Use `within()` to scope queries rather than long selector chains.

### Waiting & Flake Resistance
- Never use arbitrary `cy.wait(ms)` except for debugging.
- Prefer waiting on:
  - element state (`should`)
  - network aliases (`cy.intercept` + `cy.wait('@alias')`)
- Let Cypress retry assertions; avoid manual polling loops.

### Network Control
- Use `cy.intercept()` to stub or observe network calls.
- Keep stubs scenario-specific and minimal; avoid globally mocking the entire app unless the suite is explicitly contract testing.
- Assert on requests/responses only when it’s part of the behavior under test.

### State & Isolation
- Tests must be order-independent; reset state between tests.
- Prefer seeding state via API or deterministic setup paths rather than complex UI setup.
- Avoid sharing login/session state across tests unless using a project-standard approach (`cy.session`) with clear isolation.

### Assertions
- Prefer explicit, user-observable outcomes (UI state, navigation, persisted changes).
- Avoid overly broad “page contains X” checks when you can assert on the specific element/behavior.

### Aliases & Readability
- Use aliases (`as`) for intercepted routes and key elements to improve readability.
- Keep helper commands small and purposeful; avoid custom commands that hide critical assertions.

### Browser/Window Stubbing
- Stub `window`/`localStorage`/clock only when required; keep it localized to the tests that need it.
- Restore stubs and clocks to avoid cross-test leakage.

### Flows & Cleanup
- Ensure tests clean up created state when it affects subsequent runs (or use isolated test data).
- Prefer idempotent setup/teardown patterns.

### Parallelism
- Keep tests parallel-safe: unique users/data per test run if the CI executes in parallel.
