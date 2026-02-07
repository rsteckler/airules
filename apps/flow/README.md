# Flow Editor

Standalone React Flow editor in the `apps/flow` folder. Completely separate from the main Airules client/server.

## Features

- **Design** – Add and delete nodes and edges on the canvas.
- **Node types** – **Step** (default) and **Branch** (multiple outputs with labels).
- **Metadata** – Add arbitrary key/value metadata to any node in the right sidebar.
- **Branch conditionals** – On branch nodes, set labels per output (e.g. yes/no, true/false).
- **Export** – Download the flow as JSON (nodes, edges, viewport).
- **Import** – Load JSON from file or paste; full round-trip with export.

## Run

From repo root:

```bash
pnpm install
pnpm dev:flow
```

Or from `apps/flow`:

```bash
pnpm install
pnpm dev
```

Open the URL shown (e.g. http://localhost:5174).

## JSON format

Exported/imported JSON shape:

- `version` – schema version
- `viewport` – `{ x, y, zoom }`
- `nodes` – React Flow nodes (id, type, position, data)
- `edges` – React Flow edges (id, source, target, sourceHandle?, targetHandle?, data?)

Node `data` can include:

- `label` – display label
- `metadata` – object of key/value pairs
- `branches` – (branch nodes only) array of branch labels, one per output handle
