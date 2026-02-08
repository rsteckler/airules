## React Native (framework only)

### Platform Mental Model
- Treat iOS and Android as different platforms; don’t assume behavior matches.
- Prefer cross-platform primitives first; use platform-specific code only when necessary and scoped.

### Components & Layout
- Use `View`, `Text`, `Pressable`, `ScrollView`, `FlatList/SectionList` appropriately; avoid generic wrappers.
- Prefer Flexbox layout; avoid hard-coded pixel dimensions unless required.
- Use `SafeAreaView` (or the project’s safe-area solution) for top-level screens where needed.
- Avoid deeply nested `ScrollView`s; prefer list components for large/virtualized content.

### Lists & Performance
- Use `FlatList`/`SectionList` for long lists; avoid mapping large arrays into `ScrollView`.
- Provide stable keys; avoid index keys unless the list is truly static.
- Use `getItemLayout`, `initialNumToRender`, and other perf options only when there’s evidence of issues.

### State & Effects
- Keep side effects in hooks with correct dependencies; avoid hidden re-run loops.
- Avoid storing derived values in state.
- Prefer event-driven updates over “sync effects.”

### Touch & Gestures
- Prefer `Pressable` for touch interactions.
- Ensure hit targets are reasonable; avoid tiny touch areas.
- Follow the project’s gesture/navigation approach; do not introduce new gesture systems.

### Navigation
- Follow the existing navigation library and patterns (e.g., React Navigation).
- Keep screens thin; move reusable UI into components and shared logic into hooks/services.
- Avoid mixing navigation paradigms (stack/tab/drawer) unless the project already does so.

### Styling
- Follow the project’s styling approach (StyleSheet, styled, utility styles, etc.).
- Prefer `StyleSheet.create` for stable styles if that’s the established pattern.
- Avoid inline style objects in frequently rendered components when it causes churn.

### Native Modules & Platform APIs
- Prefer existing libraries already in the repo for native capabilities.
- Avoid adding native modules unless explicitly requested.
- Keep platform-specific code isolated (`Platform.select`, `.ios.ts`, `.android.ts`) and minimal.

### Accessibility
- Use `accessibilityLabel`, `accessibilityRole`, and related props for interactive elements.
- Ensure focus order and screen reader behavior are reasonable for custom components.

### Consistency
- Match existing project conventions for folder structure, screen/component naming, and platform overrides.
- Do not introduce Expo-specific patterns into a bare RN project (or vice versa) unless explicitly requested.
