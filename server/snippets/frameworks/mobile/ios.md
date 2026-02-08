## iOS Native (UIKit / SwiftUI / Apple frameworks only)

### Framework Choice
- Follow the project’s existing UI framework (UIKit vs SwiftUI). Do not migrate UI frameworks unless explicitly requested.
- Keep platform APIs and UI code separated from domain logic (use existing layering patterns).

### SwiftUI-Specific
- Treat `View` as a pure function of state; avoid side effects in `body`.
- Keep `@State` local; use `@Binding` for parent-owned state; use `@StateObject` for owned reference models and `@ObservedObject` for injected ones.
- Avoid recreating `ObservableObject` instances in `body`; initialize once (e.g., in `init`/`@StateObject`).
- Use `task` / `onAppear` intentionally; avoid duplicate work on re-render.
- Prefer `NavigationStack`/`NavigationSplitView` if the project uses them; don’t mix navigation paradigms.
- Keep view hierarchies shallow; extract subviews when `body` gets large.

### UIKit-Specific
- Prefer modern APIs consistent with the project:
  - Auto Layout (constraints) and/or `UIStackView` for layout
  - Avoid manual frame math unless required
- Use view controller containment intentionally; avoid “massive view controllers.”
- Keep UI updates on the main thread.
- Manage lifecycles carefully:
  - Avoid retaining timers/observers without removal
  - Remove NotificationCenter observers when appropriate
- Prefer `UITableView/UICollectionView` reuse patterns; ensure reuse-safe configuration (no stale state).

### Concurrency & Main Thread
- Keep UI mutations on the main actor/thread.
- Avoid blocking the main thread with synchronous I/O or heavy computation.
- Use structured concurrency patterns already used in the project; avoid ad-hoc background queues unless consistent.

### Persistence & System Services
- Follow existing patterns for persistence (UserDefaults, Keychain, Core Data, files).
- Treat Keychain and sensitive data carefully; never log secrets.
- Keep permission prompts contextual (request only when needed).

### Networking
- Use the project’s established networking stack (URLSession wrappers, clients).
- Keep decoding/encoding at the boundary; validate external data before use.
- Handle cancellation and retries according to existing patterns.

### App Lifecycle & Backgrounding
- Respect background/foreground transitions; avoid work that will be killed in background.
- Use background tasks only if the project already uses them and the work truly requires it.

### Consistency
- Match existing patterns for coordinators, view models, dependency injection, and navigation.
- Do not introduce third-party frameworks or new architectural patterns unless explicitly requested.
