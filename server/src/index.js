import { fileURLToPath } from 'url';
import path from 'path';
import express from 'express';
import cors from 'cors';
import { sessionRoutes } from './routes/session.js';
import { generateRulesRoutes } from './routes/generateRules.js';
import { schemaRoutes } from './routes/schema.js';

const __filename = fileURLToPath(import.meta.url);
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

export { app };

const isMain = process.argv[1] && path.resolve(process.cwd(), process.argv[1]) === __filename;
if (isMain) {
  app.listen(PORT, () => {
    console.log(`Server listening on http://localhost:${PORT}`);
  });
}
