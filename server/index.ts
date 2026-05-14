// =================================================================
// Bia · Bradesco — servidor local (Express + SQLite)
// Roda offline. Internet só é usada se o motor Claude estiver ativo.
// =================================================================

import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { loadEnv } from './lib/env.ts';
import { getDb } from './db.ts';
import { isMockMode } from './lib/engine.ts';
import { chatRouter } from './routes/chat.ts';
import { sessionsRouter } from './routes/sessions.ts';
import { objectivesRouter } from './routes/objectives.ts';

// Carrega .env (com override) ANTES de qualquer coisa ler process.env
loadEnv();

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT ?? 3001);

// Aplica o schema no startup (idempotente)
getDb();

const app = express();
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    mode: isMockMode() ? 'mock' : 'claude',
    model: process.env.ANTHROPIC_MODEL ?? 'claude-opus-4-7',
  });
});

app.use('/api', chatRouter);
app.use('/api', sessionsRouter);
app.use('/api', objectivesRouter);

// Em produção (npm start, após npm run build): serve o frontend estático.
// Em dev o frontend é servido pelo Vite, que faz proxy de /api pra cá.
if (existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get('*', (_req, res) => {
    res.sendFile(join(DIST, 'index.html'));
  });
}

app.listen(PORT, () => {
  const mode = isMockMode()
    ? 'MOCK (offline, conversa scriptada)'
    : `Claude (${process.env.ANTHROPIC_MODEL ?? 'claude-opus-4-7'})`;
  console.log('');
  console.log('  Bia · Bradesco — servidor local');
  console.log(`  ➜  API:    http://localhost:${PORT}/api`);
  if (existsSync(DIST)) {
    console.log(`  ➜  App:    http://localhost:${PORT}`);
  } else {
    console.log('  ➜  App:    rode "npm run dev" (Vite) ou "npm run build"');
  }
  console.log(`  ➜  Motor:  ${mode}`);
  console.log('  ➜  Banco:  data/bia.db (SQLite local)');
  console.log('');
});
