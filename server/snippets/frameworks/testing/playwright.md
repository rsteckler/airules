## Playwright (framework-specific rules)

### Locator Discipline
- Prefer `locator()`-based APIs; avoid `page.$` / `page.$$`.
- Prefer user-facing selectors in this order (when available):
  - `getByRole` (+ `name`)
  - `getByLabel`
  - `getByPlaceholder`
  - `getByText` (carefully)
  - `getByTestId` (only when semantics aren’t available)
- Avoid brittle CSS/XPath selectors tied to layout or class names.

### Waiting & Flake Resistance
- Never use fixed sleeps (`waitForTimeout`) except for debugging.
- Rely on Playwright’s auto-wait and use `expect(locator).to...` assertions (which poll).
- When you must wait, wait on a condition (navigation, locator state, response, request).

### Test Isolation
- Tests must be independent; do not rely on order.
- Prefer per-test setup using fixtures; avoid shared state across tests.
- If using authenticated sessions, prefer `storageState` and keep it scoped to the smallest needed set of tests.

### Browser Context & State
- Prefer new context per test (Playwright default patterns) to avoid leakage.
- Avoid reusing `page` or `context` across tests unless explicitly required and isolated.

### Assertions
- Assert on visible, user-observable outcomes (UI state, network results reflected in UI).
- Prefer targeted assertions over broad “page contains text” checks.
- Use `toHaveURL`, `toHaveText`, `toBeVisible`, `toHaveCount`, etc. for stable checks.

### Network Control
- Use routing (`page.route`) only when necessary; keep mocks narrow and scenario-specific.
- Avoid over-mocking the entire app; prefer real flows unless the suite is explicitly contract-testing.

### Tracing & Debuggability
- Use `test.step()` for multi-phase flows to improve trace readability.
- Enable trace/video/screenshot collection according to existing project settings; don’t change defaults unless asked.

### Page Objects / Helpers
- Use page objects/helpers only to reduce duplication, not to hide assertions or logic.
- Keep helpers “thin”: actions + small utilities; keep assertions in tests unless the project standardizes otherwise.

### Parallelism
- Keep tests parallel-safe: no shared accounts/resources unless explicitly isolated.
- Avoid hardcoding ports, fixed IDs, or shared external state.

### Stability
- Avoid asserting on unstable UI (timestamps, random IDs, transient loading text) unless that is the contract.
- Prefer deterministic test data and explicit setup paths when needed.
