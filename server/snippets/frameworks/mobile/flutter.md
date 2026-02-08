## Flutter (framework only)

### Widget Design
- Prefer small, composable widgets over large, multi-responsibility widgets.
- Extract UI into separate widgets when a build method becomes long or complex.
- Prefer stateless widgets by default; use `StatefulWidget` only when local mutable state is required.

### Build Method Practices
- Keep `build()` methods pure and fast; avoid heavy computation or side effects.
- Do not perform async work, navigation, or state changes inside `build()`.
- Avoid deep widget nesting when layout widgets (`Padding`, `Expanded`, `Align`, etc.) can simplify structure.

### State Management
- Follow the project’s existing state management approach (setState, Provider, Riverpod, Bloc, etc.).
- Do not introduce a new state library unless explicitly requested.
- Keep local UI state inside the widget when it does not need to be shared.

### Layout & Responsiveness
- Prefer flexible layouts (`Expanded`, `Flexible`, `Spacer`) over fixed sizes.
- Avoid hardcoded pixel dimensions when responsive layout is possible.
- Use `MediaQuery` or layout constraints only when necessary.

### Performance
- Mark widgets `const` wherever possible to reduce rebuild cost.
- Avoid rebuilding large subtrees unnecessarily; extract stable subtrees into separate widgets.
- Use `ListView.builder` / `GridView.builder` for large or dynamic lists instead of building full lists.

### Async & Lifecycle
- Perform async initialization in `initState()` or dedicated lifecycle logic, not in `build()`.
- Always check `mounted` before calling `setState` after async work.
- Dispose of controllers, streams, and focus nodes in `dispose()`.

### Navigation
- Follow the project’s existing navigation pattern (Navigator 1.0, Navigator 2.0, GoRouter, etc.).
- Keep navigation logic out of deep UI layers when possible.

### Theming & Styling
- Use the existing `Theme` and design tokens for colors, typography, and spacing.
- Avoid hardcoded design values when theme equivalents exist.
- Do not introduce a new styling system unless explicitly requested.

### Platform Considerations
- Respect platform conventions (Material vs Cupertino) based on the project’s existing design approach.
- Keep platform-specific code minimal and isolated.

### Consistency
- Match existing folder structure, widget naming, and architectural patterns.
- Do not introduce new architectural patterns or frameworks unless explicitly requested.
