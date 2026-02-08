## Native macOS Desktop (AppKit / SwiftUI macOS) (platform only)

### Framework Choice
- Follow the project’s chosen UI framework (AppKit vs SwiftUI). Do not migrate frameworks unless explicitly requested.
- Keep UI logic separate from domain logic per the project’s existing architecture.

### AppKit-Specific
- Keep view controllers focused; avoid “massive” window/view controllers.
- Use Auto Layout consistently; avoid manual frame math unless required.
- Keep UI updates on the main thread.
- Manage lifecycles carefully:
  - remove observers
  - invalidate timers
  - avoid retain cycles in closures/delegates
- Prefer standard AppKit controls and patterns (NSViewController, NSTableView/NSCollectionView reuse) over custom reimplementation.

### SwiftUI macOS-Specific
- Treat views as pure functions of state; avoid side effects in `body`.
- Use appropriate property wrappers (`@State`, `@Binding`, `@StateObject`, `@ObservedObject`) consistently.
- Keep `task`/`onAppear` work idempotent to avoid double execution across view refreshes.
- Prefer `NavigationSplitView` for macOS sidebar/detail patterns when the project uses it.

### macOS Interaction Patterns
- Respect macOS conventions:
  - menu bar commands and keyboard shortcuts
  - focus behavior and first responder chain
  - window/tab behavior where applicable
- Avoid iOS-centric UI assumptions (touch targets, navigation stacks) unless the app is explicitly iPad-first.

### File System & Permissions
- Use macOS security-scoped bookmarks / sandbox patterns if the app is sandboxed.
- Treat file paths and URLs as untrusted input; validate and constrain.
- Do not broaden entitlements or sandbox permissions unless explicitly requested.

### Background Work
- Avoid blocking the main thread with I/O or heavy work.
- Use appropriate concurrency patterns consistent with the project.

### Packaging & Signing
- Respect existing bundle ID, entitlements, signing, and notarization setup.
- Avoid changing signing/notarization configuration unless explicitly requested.

### Consistency
- Match existing architecture, module layout, and UI conventions.
- Do not introduce new UI frameworks, reactive layers, or third-party UI toolkits unless explicitly requested.
