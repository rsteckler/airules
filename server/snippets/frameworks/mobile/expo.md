## Expo (framework only)

### Expo-First Defaults
- Prefer Expo SDK APIs over custom native code.
- Do not add native modules or eject/prebuild unless explicitly requested.
- Assume managed workflow unless the project is already using config plugins / prebuild.

### Configuration
- Keep changes to `app.json` / `app.config.*` minimal and scoped.
- Prefer config plugins only if the project already uses them.
- Avoid introducing new build profiles or EAS configuration unless explicitly requested.

### Native Capabilities
- Use Expo’s first-party modules (`expo-*`) where available (camera, notifications, location, etc.).
- Avoid mixing multiple libraries that solve the same native capability.
- Respect platform permission flows; request permissions only right before they’re needed.

### Updates & Runtime
- Follow the project’s established approach for Expo Updates (if enabled).
- Avoid relying on environment-specific behavior that breaks OTA updates.
- Keep runtime configuration deterministic across environments.

### Assets
- Follow existing conventions for bundling assets (images, fonts).
- Use Expo asset/font loading patterns already in the codebase; don’t introduce a new pattern.

### Routing & Navigation
- Follow the existing navigation/routing setup (React Navigation vs Expo Router).
- Do not introduce a second routing system.
- Keep screens/routes thin; compose UI into components and shared logic into hooks/services.

### Performance
- Be mindful of bundle size; avoid adding heavy dependencies.
- Avoid work on app startup; defer non-critical initialization.

### Device & Platform Behavior
- Validate behavior on both iOS and Android assumptions (permissions, file paths, notifications).
- Keep platform-specific work isolated and minimal.

### Consistency
- Match existing Expo SDK version constraints and package usage.
- Avoid changing the workflow (managed ↔ bare) unless explicitly requested.
