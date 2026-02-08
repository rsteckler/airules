## Tauri (desktop framework only)

### Architecture & Boundaries
- Treat the **webview** as an untrusted UI surface.
- Keep OS/native capabilities in **Rust commands**; keep UI logic in the frontend.
- Expose a minimal command surface area; don’t turn commands into a generic RPC dump.

### Commands (IPC)
- Prefer small, explicit `#[tauri::command]` functions with clear inputs/outputs.
- Validate all inputs in Rust; never trust frontend-provided data.
- Keep command names stable and namespaced by feature.
- Avoid sending large payloads over IPC; prefer file paths/IDs or chunking where appropriate.

### Security
- Lock down permissions/capabilities using the project’s Tauri config patterns.
- Avoid enabling broad APIs (filesystem, shell, HTTP) unless explicitly required.
- Treat file paths and URLs as untrusted input; validate and constrain to allowed locations/domains.

### State Management (Rust Side)
- Use `tauri::State` for shared services/clients/config.
- Keep shared state immutable where possible; synchronize mutable state explicitly.
- Avoid global mutable singletons.

### Window & App Lifecycle
- Centralize window creation and lifecycle behavior.
- Keep platform-specific window behavior isolated and minimal.
- Ensure background tasks are tied to lifecycle events where appropriate.

### Plugins
- Prefer official Tauri plugins and existing project plugins.
- Do not add new plugins unless explicitly requested.
- Keep plugin usage minimal; avoid overlapping plugins that provide similar capabilities.

### File System & OS Integration
- Prefer Tauri APIs over spawning shell commands.
- Avoid arbitrary command execution patterns; keep OS interactions explicit and constrained.

### Performance
- Avoid blocking Rust command handlers with long-running work on the main thread; spawn tasks appropriately.
- Keep IPC payloads small; avoid chatty command patterns (batch when sensible).

### Packaging & Distribution
- Respect existing signing/notarization and bundling configuration.
- Avoid changes to bundle identifiers, entitlements, or updater settings unless explicitly requested.

### Consistency
- Match the project’s conventions for command modules, plugin structure, and config layout.
- Do not introduce Electron-style patterns or alternate IPC frameworks inside Tauri unless explicitly requested.
