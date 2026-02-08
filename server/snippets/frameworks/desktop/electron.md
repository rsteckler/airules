## Electron (desktop framework only)

### Process Model
- Keep a strict separation between:
  - **main process** (app lifecycle, native integrations)
  - **renderer** (UI)
  - **preload** (the only safe bridge)
- Do not access Node APIs directly from the renderer unless the project explicitly allows it.

### Security Defaults
- Prefer secure defaults unless the project explicitly opts out:
  - `contextIsolation: true`
  - `nodeIntegration: false`
  - disable `remote` (if present)
- Expose only minimal, well-scoped APIs through `contextBridge`.
- Treat all renderer input as untrusted.

### IPC Design
- Prefer request/response patterns (`ipcRenderer.invoke` / `ipcMain.handle`) over ad-hoc event firehoses.
- Keep IPC channels namespaced and stable.
- Validate payloads in the **main process**; never trust renderer data.
- Avoid sending large payloads over IPC; prefer file paths, IDs, or streaming strategies.

### Window Management
- Keep `BrowserWindow` creation centralized.
- Avoid creating many windows without explicit need.
- Ensure windows are cleaned up properly (avoid retaining references after close).

### Native Integrations
- Keep OS-specific behavior isolated and minimal.
- Prefer Electron’s built-in APIs over adding native modules.
- Do not add native dependencies unless explicitly requested.

### Auto Updates (if used)
- Follow the project’s updater approach (electron-updater, Squirrel, etc.).
- Keep update UX predictable; avoid surprise restarts.

### Packaging & Build
- Respect existing packaging assumptions (electron-builder/electron-forge).
- Avoid changes that inflate bundle size without clear benefit.
- Do not modify signing/notarization/build pipelines unless explicitly requested.

### Performance
- Avoid blocking the main process event loop.
- Prefer async filesystem/network APIs in main/preload.
- Be cautious with large synchronous work in preload.

### Crash Resilience & Logging
- Keep main process startup resilient; fail fast with clear logs when critical init fails.
- Avoid logging secrets or sensitive user data.

### Consistency
- Match existing conventions for IPC channel naming, preload API shape, and window lifecycle.
- Do not introduce an alternative desktop framework or a second IPC abstraction unless explicitly requested.
