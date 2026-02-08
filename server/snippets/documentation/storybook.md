## Storybook (framework-specific rules)

### Purpose
- Use Storybook to document and validate **UI components in isolation**.
- Stories should demonstrate component behavior, states, and usage—not application workflows.

### Story Scope
- Create stories for reusable, shared components.
- Avoid creating stories for page-level flows or app-specific screens unless the project already does so.
- Each story should represent a meaningful visual or behavioral state.

### Story Structure
- Follow the project’s existing story format (CSF version, file naming, and folder layout).
- Group stories logically by component and variant.
- Keep story files close to components if that is the project convention.

### Controls & Args
- Prefer args-based stories to demonstrate variations.
- Expose only meaningful props in controls.
- Provide sensible default args for the primary story.

### State Coverage
- Include key states when relevant:
  - default
  - loading
  - empty
  - error
  - disabled / interactive variants
- Avoid duplicating trivial variations that don’t add value.

### Mocking & Data
- Mock data at the component boundary.
- Avoid real network calls inside stories.
- Keep mock data minimal and realistic.

### Interaction & Behavior
- Use interaction tests or play functions only when behavior demonstration adds value.
- Keep interactions deterministic and fast.

### Visual Stability
- Avoid randomness, time-dependent values, or environment-specific behavior in stories.
- Ensure stories render consistently for visual testing and CI.

### Performance
- Keep stories lightweight; avoid heavy setup or large datasets.
- Avoid global decorators that significantly affect all stories unless already part of the project.

### Addons & Configuration
- Follow existing Storybook addons and configuration.
- Do not introduce new addons, frameworks, or major config changes unless explicitly requested.

### Consistency
- Match existing naming, hierarchy, and documentation style.
- Do not introduce a new organization pattern or Storybook structure unless explicitly requested.
