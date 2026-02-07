You are implementing a schema-driven questionnaire UI + validation for a Cursor rules generator.

You will be given a JSON Schema (Draft 2020-12) that defines:
1) the data model for user answers (validation contract), and
2) some UI behavior using custom extension keywords (vendor annotations).

IMPORTANT: JSON Schema validators will ignore unknown keywords. Our app MUST interpret certain x-* fields to drive UI behavior.

Core requirements
- Use JSON Schema Draft 2020-12 for validating answers.
- Treat the schema as the source of truth for:
  - question keys (property names)
  - allowed values (enum)
  - required fields
  - conditional requirements via if/then in schema.allOf
- Implement lightweight UI behavior using our custom extension keyword(s).

Custom keyword convention: x-other
Some properties include an `x-other` object. Example:
  "frontend_framework": {
    "type": "string",
    "enum": ["react", "next_app_router", "other"],
    "x-other": {
      "enabledWhenSelected": "other",
      "field": "frontend_framework_other_text"
    }
  }

Interpretation rules:
- If a property has `x-other`, then:
  - It is a multiple-choice field that includes an “Other” option.
  - When the user selects the enum value that matches x-other.enabledWhenSelected, the UI must show a companion text input.
  - The companion text input stores its value in the property named by x-other.field.
  - The companion text field becomes REQUIRED when the “Other” option is selected (the schema already enforces this via if/then -> required).
- If the user changes away from “Other”, the UI should either:
  - clear the companion text field, OR
  - keep it but exclude it from submission
  Choose one and implement consistently. Preferred: clear it to avoid stale data.

Single vs multi select
- A property with "type": "string" and an "enum" is a single-select control.
- A property with "type": "array" and items.enum is a multi-select control.
  - Enforce uniqueItems: true.
  - Respect minItems where present.
- Some multi-select arrays include sentinel options like "none".
  - The schema enforces exclusivity via if/then + maxItems:1 when "none" is selected.
  - The UI should ideally enforce this proactively:
    - If "none" is selected, disable other choices or auto-deselect others.
    - If any other option is selected, auto-deselect "none".

Required + conditional required fields
- Required fields are in the schema.required array.
- Additional conditional requirements are in schema.allOf with if/then rules.
  - Do NOT hand-code these conditions. Either:
    A) rely on the validator to return missing-required errors and map those errors to the UI, or
    B) optionally precompute dependencies to show/hide fields.
- Specifically, the “Other text” fields become required only when “Other” is selected.
- If you implement show/hide, it must match validation logic (no hidden required fields unless they’re conditionally not required).

Defaults
- Many properties contain "default".
- On first load, initialize the form state using defaults for required properties where possible.
- If an array field has default ["none"], it should render with "none" selected initially.

Visibility / UX (optional but recommended)
- Some fields are not meaningful depending on earlier answers (e.g., frontend_framework = "none" implies styling/state can be skipped).
- If implementing conditional visibility:
  - Use simple heuristics (e.g., if frontend_framework === "none", hide styling_approach and state_management).
  - BUT still allow values if user wants to set them; hiding should not break validation.
  - Ensure hidden fields are not marked required unless schema says they are required in that context.
  - The schema may include descriptive hints, but it’s okay if you keep UI always-visible initially.

Validation
- Validate form state against the JSON Schema on:
  - submit, and ideally on each step/section change.
- Use a Draft 2020-12 compatible validator (AJV v8+ is typical in JS/TS).
- Map validation errors to:
  - field-level errors (e.g., required missing, enum mismatch),
  - and form-level errors (e.g., minItems not met).
- Ensure that any `x-*` keywords are ignored by the validator.

Data contract (what to submit)
- Submit only the answers object that matches the schema properties.
- It’s acceptable to include the “other text” properties even when not required, but preferred behavior is:
  - keep them empty/undefined unless the associated “Other” option is selected.

Implementation checklist
1) Parse schema.properties to generate controls.
2) Determine control type:
   - string+enum => single select
   - array+items.enum => multi select
3) Render an “Other” text input when x-other condition is met.
4) Enforce “none” sentinel exclusivity for relevant multi-selects.
5) Initialize defaults.
6) Validate with a Draft 2020-12 validator.
7) Ensure conditional required fields are satisfied before final submission.

Deliverables
- A form renderer that can render all fields defined in the schema.
- The renderer must support x-other behavior.
- A validation layer that blocks submission if schema validation fails and shows clear errors.


---
Mapping questionnaire answers → awesome-cursorrules snippets

Goal
- We want deterministic, high-signal selection of rules snippets from https://github.com/PatrickJS/awesome-cursorrules.
- Do NOT do a fragile 1:1 mapping (question => one snippet). Use a tagged bundle system:
  1) index snippets into a manifest with tags
  2) map answers -> desired tags
  3) select snippets via scoring + constraints
  4) concatenate in a stable order

Concepts
- “Snippet” = one rules file from the awesome repo (usually a folder containing .cursorrules).
- “Manifest” = our generated index of all snippets in that repo.
- “Tag query” = derived from questionnaire answers.
- “Family” = grouping to avoid duplicates (frontend_core, backend_core, lang_core, testing, deploy, build, docs, utils, etc.)

1) Build a snippet manifest (one-time per repo version)
- Traverse the awesome repo and create manifest.json with an entry per snippet.
- For each snippet store:
  - id: stable identifier (e.g., folder name)
  - path: path to the snippet’s .cursorrules
  - category: one of the repo categories (frontend, backend, mobile, styling, state, db/api, testing, hosting/deploy, build tools, language-specific, docs, utilities, security, other)
  - tags: normalized tokens inferred from folder name / location / README text if available
    Suggested tag namespaces:
      - lang: python, ts, js, go, rust, java_kotlin
      - frontend: nextjs, react, angular, vue, svelte, astro, etc.
      - next_router: app_router, pages_router
      - backend: express, fastify, nestjs, fastapi, django, rails
      - styling: tailwind, shadcn, mui, css_modules, etc.
      - state: redux, zustand, mobx, tanstack_query
      - data: postgres, mysql, sqlite, mongodb, dynamodb, redis, supabase, etc.
      - test: jest, vitest, playwright, cypress, etc.
      - deploy: vercel, aws, gcp, azure, docker, self_hosted
      - build: vite, webpack, turborepo, nx
      - docs: documentation
      - utils: pr_template, bug_report, ticket_template, github_workflow
      - security: security
  - family: which “dedupe bucket” it belongs to (lang_core, frontend_core, backend_core, data, styling, state, testing, build, deploy, docs, utils, security)
  - specificity: optional scalar 0..1 (0=general best practices, 1=highly app-specific like “todo app”)
  - quality: optional scalar 0..1 (if you later want to rank curated snippets higher)

2) Map questionnaire answers -> desired tags
- Convert answers into a tag query object:
  - languages includes python => want lang:python
  - frontend_framework next_app_router => want frontend:nextjs + next_router:app_router
  - styling_approach tailwind => want styling:tailwind
  - styling_approach shadcn_ui => want styling:shadcn
  - state_management redux => want state:redux
  - testing_tools includes playwright => want test:playwright
  - deployment_target vercel => want deploy:vercel
  - etc.
- “Other” free-text fields:
  - tokenize (lowercase, split on non-alphanum, normalize common synonyms)
  - treat as SOFT tags; only used if they match known tags in the manifest.

3) Selection policy (deterministic)
We select snippets with these rules:

A) Always include our own generated “base rules”
- These are derived from permissions/process questions (ai_permissions, always_ask_before, git_behavior, output_preference, uncertainty_handling, when_run_checks, failure_policy, docs expectations, security posture).
- These are NOT reliably covered by awesome snippets; generate them ourselves.

B) “Include all” bundles for certain answers
- If a language is selected and policy says “include all” (e.g., python), include ALL manifest snippets tagged lang:python in family lang_core (and any other python-tagged families if desired).
- This is an explicit policy knob:
  - include_policy.lang.python = "all"
  - other languages default to "best" (top N) unless configured.

C) Score-and-pick for frameworks/tools (avoid over-including)
- For each remaining family (frontend_core, backend_core, testing, deploy, build, styling, state, data, docs, utils, security),
  compute a score for each candidate snippet based on tag matches:
    +5 exact framework match (e.g., frontend:nextjs)
    +3 router variant match (next_router:app_router/pages_router)
    +3 styling match (tailwind/shadcn/etc.)
    +2 test tool match (playwright/cypress/jest/etc.)
    +2 deploy match (vercel/aws/etc.)
    +2 data match (postgres/mongo/etc.)
    -4 strong mismatch penalty (snippet tags conflict with chosen stack; e.g., mui when user didn’t choose it)
    -3 high specificity penalty unless user chose that exact combo (to avoid “todo app” packs)
- Select top K per family:
  - frontend_core: 1–2
  - backend_core: 1
  - styling/state/data/testing/deploy/build/docs/security/utils: 0–2 depending on matches

D) Dedupe by family
- Enforce caps so we don’t include multiple “core” snippets that repeat themselves.
- Example: max 1 frontend_core unless the second is strictly complementary (e.g., Next core + Next App Router specifics).

4) Concatenation order (so specific beats general)
When generating the final rules text, concatenate in this order:
1) Generated base rules (our own)
2) Language core (python/ts/etc.)
3) Frontend core (next/react/etc.)
4) Backend core (fastapi/nest/etc.)
5) Data layer (db/api)
6) Styling + state
7) Testing
8) Build tools
9) Hosting/deploy
10) Docs
11) Utilities/templates
12) Security (either near top or near end; pick one and keep consistent)
Rationale: avoid later general rules overriding earlier specific ones.

5) Keep mapping/config out of code
- Put answer->tag mapping and scoring weights in a config file (JSON/YAML) so new snippets can be indexed without app code changes.
- Rebuild manifest.json whenever awesome repo updates.

Deliverable expectation
- Implement:
  - manifest builder (repo -> manifest.json)
  - answer->tag query builder
  - snippet selector (policy + scoring + caps)
  - deterministic concatenator that outputs a final .cursorrules (or split rules) text
- Keep everything predictable: given same answers and same manifest, output should be identical.
