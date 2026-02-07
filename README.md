# Airules

**AI Rules Generator** — A React frontend and Node backend that guides users through a project questionnaire and generates AI agent rules (Cursor, Claude, etc.), with optional repo URL analysis to pre-fill answers.

## Plan

The implementation plan lives in the repo: **[ai/plans/PLAN.md](ai/plans/PLAN.md)**. It defines the product, architecture, questionnaire model, and a phased implementation order for agents.

## Getting started

_(To be filled in as the app is built.)_

- From repo root: `pnpm install` installs dependencies for all workspaces.
- **Client** (Phase 2+): `pnpm run dev` in `client/` (or `pnpm --filter airules-client dev` from root) to run the React app.
- **Server** (Phase 3+): `pnpm run dev` in `server/` (or `pnpm --filter airules-server dev` from root) to run the API.

## Diagnosing horizontal scroll

If a horizontal scrollbar appears (e.g. after many questionnaire steps), run this in the browser console to find which element is wider than the viewport:

```js
const vw = document.documentElement.clientWidth;
function findOverflow(el, path = '') {
  if (!el || el.nodeType !== 1) return;
  const name = el.className ? `${el.tagName}.${el.className.split(' ')[0]}` : el.tagName;
  const p = path ? `${path} > ${name}` : name;
  const sw = el.scrollWidth;
  const cw = el.clientWidth;
  if (sw > cw || el.getBoundingClientRect().right > vw) console.log(p, { scrollWidth: sw, clientWidth: cw });
  for (const child of el.children) findOverflow(child, p);
}
findOverflow(document.body);
```

## Repo structure

- `client/` — React app (Vite)
- `server/` — Node API (Express/Fastify)
- `docs/PLAN.md` — Single source of truth for the build plan

## License

Unlicensed (or add your preferred license).
