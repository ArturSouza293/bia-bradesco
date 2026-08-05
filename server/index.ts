// =================================================================
// Bia · Bradesco — servidor local (Express + libSQL)
// Roda offline contra data/bia.db. Internet só é usada se o motor
// Claude estiver ativo, ou se TURSO_DATABASE_URL apontar pro remoto.
// =================================================================

import express from 'express';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { existsSync } from 'node:fs';
import { getDb } from './db.js';
import { isMockMode } from './lib/engine.js';
import { createApp, DEFAULT_MODEL } from './app.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const DIST = join(ROOT, 'dist');
const PORT = Number(process.env.PORT ?? 3001);

const app = createApp();

// Em produção (npm start, após npm run build): serve o frontend estático.
// Em dev o frontend é servido pelo Vite, que faz proxy de /api pra cá.
if (existsSync(DIST)) {
  app.use(express.static(DIST));
  app.get('*', (_req, res) => {
    res.sendFile(join(DIST, 'index.html'));
  });
}

// Aplica o schema antes de aceitar tráfego (idempotente).
await getDb();

app.listen(PORT, () => {
  const mode = isMockMode()
    ? 'MOCK (offline, conversa scriptada)'
    : `Claude (${process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL})`;
  const db = process.env.TURSO_DATABASE_URL
    ? `Turso (${process.env.TURSO_DATABASE_URL})`
    : 'data/bia.db (SQLite local)';
  console.log('');
  console.log('  Bia · Bradesco — servidor local');
  console.log(`  ➜  API:    http://localhost:${PORT}/api`);
  if (existsSync(DIST)) {
    console.log(`  ➜  App:    http://localhost:${PORT}`);
  } else {
    console.log('  ➜  App:    rode "npm run dev" (Vite) ou "npm run build"');
  }
  console.log(`  ➜  Motor:  ${mode}`);
  console.log(`  ➜  Banco:  ${db}`);
  console.log('');
});
