## Detox (framework-specific rules)

### Locator Strategy
- Prefer stable test IDs for elements (project convention: `testID`).
- Avoid brittle selectors based on text unless the text is a stable contract.
- Keep IDs semantic and scoped (e.g., `login.emailInput`, `cart.checkoutButton`).

### Synchronization & Waiting
- Rely on Detox synchronization; avoid manual sleeps.
- Use explicit waits only when needed:
  - `waitFor(element(...)).toBeVisible().withTimeout(...)`
- Avoid `sleep`/timeouts as a substitute for proper synchronization.

### Test Isolation
- Tests must be order-independent.
- Reset app state between tests using the project’s standard approach:
  - relaunch with `delete: true` when isolation is required
  - avoid carrying navigation/state across tests unless explicitly intended
- Avoid shared mutable test data across suites.

### Navigation & Flows
- Prefer direct navigation/setup via deep links or test-only entry points if the project supports them.
- Avoid long, fragile UI sequences to reach state unless that flow is the behavior under test.

### Assertions
- Assert on user-visible outcomes (screen shown, element visible/enabled, text present).
- Avoid asserting on transient UI (spinners, timing-dependent intermediate text).

### Permissions & System Dialogs
- Handle OS permissions deterministically (pre-grant or scripted flows per project setup).
- Avoid tests that depend on manual OS dialogs unless explicitly part of the suite and reliably handled.

### Network & Backend Dependence
- Prefer deterministic backend state for e2e runs.
- If mocking is used, keep it scenario-specific and aligned with existing project patterns.

### Debuggability
- Use clear test step structure (logical grouping) and meaningful failure messages.
- Keep test runs reproducible: avoid relying on device-specific quirks or layout assumptions.

### Parallelism & Device Matrix
- Keep tests safe for parallel execution only if test data and backend state are isolated.
- Be mindful of differences across simulators/emulators and OS versions; avoid assumptions about animations/timing.
