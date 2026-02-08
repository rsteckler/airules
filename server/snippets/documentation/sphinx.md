## Sphinx (framework-specific rules)

### Content Organization
- Follow the structure defined in `toctree`; every new page should be included in the navigation.
- Place new documents in the most relevant existing section.
- Avoid creating new top-level sections unless clearly necessary.

### reStructuredText / MyST Discipline
- Use the project’s chosen format:
  - reStructuredText (`.rst`) or
  - MyST Markdown (`.md`)
- Do not mix formats inconsistently within the same area.
- Follow existing conventions for headings, directives, and roles.

### Page Structure
- Start each page with a clear title.
- Include a short introductory context.
- Keep pages focused and task- or concept-oriented.
- Prefer multiple small pages over long monolithic documents.

### Cross-Referencing
- Prefer internal cross-references (`:ref:`, `:doc:`) over hardcoded links.
- Use labels for stable references.
- Avoid duplicating content; link to canonical pages instead.

### Code Blocks
- Use appropriate directives (`.. code-block:: language` or fenced blocks in MyST).
- Keep examples minimal, realistic, and easy to scan.
- Avoid large code dumps when focused snippets are sufficient.

### Autodoc / API Docs (if enabled)
- Respect existing autodoc configuration.
- Do not duplicate API documentation manually if it is auto-generated.
- Keep docstrings concise and aligned with the project’s documentation style.

### Toctree Discipline
- Maintain logical ordering and grouping.
- Avoid orphaned pages that are not included in any `toctree`.
- Keep navigation depth shallow and scannable.

### Assets & Media
- Place images/assets in the project’s standard `_static` or docs asset location.
- Use relative paths.
- Optimize images for clarity and size.

### Extensions & Configuration
- Follow existing Sphinx extensions and theme configuration.
- Do not introduce new extensions, themes, or build changes unless explicitly requested.

### Build Integrity
- Ensure documentation builds without warnings or errors.
- Avoid broken references, missing labels, or invalid directives.

### Consistency
- Match existing tone, terminology, and formatting.
- Do not introduce a new documentation structure or navigation model unless explicitly requested.
