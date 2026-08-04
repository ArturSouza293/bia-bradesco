// =================================================================
// Montagem do app Express — compartilhada pelos dois entrypoints:
//   • server/index.ts  → processo local (npm start / npm run dev)
//   • api/index.ts     → função serverless na Vercel
//
// Aqui ficam só as rotas de API. Servir o dist/ é responsabilidade do
// entrypoint local; na Vercel o estático é servido pela própria
// plataforma, antes de a função ser invocada.
// =================================================================

import express from 'express';
import { loadEnv } from './lib/env.ts';
import { isMockMode } from './lib/engine.ts';
import { chatRouter } from './routes/chat.ts';
import { sessionsRouter } from './routes/sessions.ts';
import { objectivesRouter } from './routes/objectives.ts';
import { insightsRouter } from './routes/insights.ts';

// Carrega .env (com override) ANTES de qualquer coisa ler process.env.
// Na Vercel não há .env e a função é um no-op — as vars vêm do painel.
loadEnv();

export const DEFAULT_MODEL = 'claude-sonnet-5';

export function createApp(): express.Express {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({
      ok: true,
      mode: isMockMode() ? 'mock' : 'claude',
      model: process.env.ANTHROPIC_MODEL ?? DEFAULT_MODEL,
      db: process.env.TURSO_DATABASE_URL ? 'turso' : 'file',
    });
  });

  app.use('/api', chatRouter);
  app.use('/api', sessionsRouter);
  app.use('/api', objectivesRouter);
  app.use('/api', insightsRouter);

  return app;
}
