## .NET Desktop (WPF / WinUI / MAUI Desktop) (framework/platform only)

### UI Framework Consistency
- Follow the project’s chosen UI stack (WPF vs WinUI vs MAUI). Do not mix frameworks or migrate unless explicitly requested.
- Keep UI concerns in the UI layer; keep domain logic out of code-behind unless the project explicitly uses code-behind patterns.

### MVVM & Binding (when used)
- Follow the project’s MVVM conventions (ViewModel structure, command patterns, property notifications).
- Prefer data binding over imperative UI updates.
- Avoid binding-heavy “magic” that is hard to debug; keep bindings explicit and readable.

### Threading & UI Dispatcher
- Treat the UI thread as sacred: do not block it with I/O or heavy computation.
- Marshal UI updates to the UI thread via Dispatcher / SynchronizationContext patterns used in the project.
- Use async patterns consistently with the codebase (async/await).

### Layout & Resources
- Prefer XAML resources/styles and templates per project conventions.
- Avoid hardcoded layout constants when shared resources exist.
- Use proper layout containers; avoid absolute positioning unless required.

### Commands & Events
- Prefer commands for user actions when MVVM is in use.
- Keep event handlers thin; delegate to ViewModel/service logic.
- Avoid tightly coupling UI controls to business logic.

### Navigation & Windowing
- Follow the project’s navigation/windowing pattern (single window, multi-window, navigation frame, etc.).
- Centralize window creation and lifecycle management.
- Keep OS-specific behavior isolated and minimal.

### Native/OS Integration
- Prefer managed APIs and existing project libraries for OS integration.
- Avoid adding native dependencies unless explicitly requested.

### Performance
- Virtualize long lists (e.g., virtualization-enabled controls) when applicable.
- Avoid creating/destroying large visual trees unnecessarily.
- Be mindful of memory leaks from event subscriptions; unsubscribe where required.

### Packaging & Distribution
- Respect existing packaging choices (MSIX, ClickOnce, installers).
- Avoid changing signing, identifiers, or deployment pipelines unless explicitly requested.

### Consistency
- Match existing conventions for ViewModels, commands, resource dictionaries, and project layout.
- Do not introduce a new UI architecture pattern unless explicitly requested.
