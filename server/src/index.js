import { fileURLToPath } from 'url';
import path from 'path';
import { existsSync } from 'fs';
import express from 'express';
import cors from 'cors';
import { sessionRoutes } from './routes/session.js';
import { generateRulesRoutes } from './routes/generateRules.js';
import { schemaRoutes } from './routes/schema.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(cors({ origin: process.env.CORS_ORIGIN || true }));
app.use(express.json());

app.get('/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api', schemaRoutes);
app.use('/api', sessionRoutes);
app.use('/api', generateRulesRoutes);

// Serve built client when SERVED_CLIENT_PATH is set (e.g. Docker / single-server deploy)
const servedClientPath = process.env.SERVED_CLIENT_PATH;
if (servedClientPath) {
  const clientDir = path.isAbsolute(servedClientPath) ? servedClientPath : path.join(__dirname, '..', servedClientPath);
  const indexHtml = path.join(clientDir, 'index.html');
  if (existsSync(indexHtml)) {
    app.use(express.static(clientDir, { index: false }));
    app.get('*', (_req, res) => res.sendFile(indexHtml));
  }
}

export { app };

const isMain = process.argv[1] && path.resolve(process.cwd(), process.argv[1]) === __filename;
if (isMain) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
