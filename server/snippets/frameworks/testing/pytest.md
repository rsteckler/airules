## pytest (framework-specific rules)

### Fixtures
- Prefer fixtures for setup/teardown; avoid ad-hoc setup code inside tests.
- Keep fixtures small and composable; prefer function scope by default.
- Use wider scopes (`module`/`session`) only for immutable, expensive setup that won’t leak state.
- Avoid “do everything” fixtures that hide key test setup.

### Parametrization
- Prefer `@pytest.mark.parametrize` for testing multiple inputs/outputs instead of copying tests.
- Keep parameter sets readable; name parameters clearly and avoid massive matrices unless necessary.

### Assertions
- Use plain `assert` with clear conditions; avoid overly clever assertions.
- Prefer asserting on behavior/outcomes rather than internal calls (unless that’s the contract).
- When failures are ambiguous, add assertion messages sparingly to clarify intent.

### Markers & Test Selection
- Use markers (`@pytest.mark.slow`, `@pytest.mark.integration`, etc.) only if the project already defines them.
- Keep slow tests isolated so CI can run fast suites by default.

### Exceptions
- Use `pytest.raises` for expected exceptions; assert on exception type and key message/attributes when meaningful.

### Monkeypatching / Mocking
- Prefer `monkeypatch` for environment/module overrides in a scoped way.
- Keep mocks at boundaries (I/O, time, network); avoid deep mocking internal logic.

### Output Capture
- Don’t depend on print/log output unless that output is the behavior under test.
- Use `caplog`/`capsys` only when verifying logging/CLI output is required.

### Cleanup & Isolation
- Avoid global mutable state; tests must be order-independent.
- Use tmp paths (`tmp_path`) for filesystem interactions; avoid writing to real project directories.

### Async (if used)
- Follow the project’s async plugin conventions (`pytest-asyncio`, etc.); don’t introduce a new async stack unless asked.
- Keep event loop usage consistent and scoped.

### Plugin Discipline
- Avoid adding new pytest plugins unless explicitly requested.
- Keep `conftest.py` lean—only shared fixtures and helpers that truly warrant centralization.
