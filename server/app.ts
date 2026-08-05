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
import { loadEnv } from './lib/env.js';
import { isMockMode } from './lib/engine.js';
import { chatRouter } from './routes/chat.js';
import { sessionsRouter } from './routes/sessions.js';
import { objectivesRouter } from './routes/objectives.js';
import { insightsRouter } from './routes/insights.js';

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

  // Rede de segurança: qualquer erro que escape de um handler chega aqui
  // (os handlers assíncronos o encaminham via asyncRoute). Sem isto, em
  // serverless o processo morre e a Vercel devolve FUNCTION_INVOCATION_FAILED
  // sem corpo — impossível de diagnosticar de fora.
  app.use(
    (
      err: unknown,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction,
    ) => {
      const message =
        err instanceof Error ? err.message : 'Erro inesperado no servidor';
      console.error('[api] erro não tratado:', err);

      // No /api/chat os headers do SSE já foram enviados: não dá para
      // trocar por JSON. Emite um evento de erro e fecha o stream.
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ type: 'error', message })}\n\n`);
        res.write(`data: ${JSON.stringify({ type: 'done' })}\n\n`);
        res.end();
        return;
      }
      res.status(500).json({ error: message });
    },
  );

  return app;
}
