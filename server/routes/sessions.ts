import { asyncRoute } from '../lib/async-route.js';
import express from 'express';
import type { Request, Response } from 'express';
import {
  createSession,
  getSession,
  insertMessage,
  updateSessionStatus,
} from '../lib/store.js';
import { OPENING_MESSAGES } from '../lib/bia.js';

export const sessionsRouter = express.Router();

// POST /api/sessions — cria sessão e semeia as mensagens de abertura
sessionsRouter.post('/sessions', asyncRoute(async (_req: Request, res: Response) => {
  const { id, started_at } = await createSession();
  for (const m of OPENING_MESSAGES) {
    await insertMessage(id, 'assistant', m.text);
  }
  res.status(201).json({
    id,
    started_at,
    status: 'active',
    opening_messages: OPENING_MESSAGES,
  });
}));

// GET /api/sessions/:id
sessionsRouter.get('/sessions/:id', asyncRoute(async (req: Request, res: Response) => {
  const session = await getSession(req.params.id);
  if (!session) {
    res.status(404).json({ error: 'Sessão não encontrada' });
    return;
  }
  res.json(session);
}));

// PATCH /api/sessions/:id — atualiza status (completed / abandoned)
sessionsRouter.patch('/sessions/:id', asyncRoute(async (req: Request, res: Response) => {
  const status = (req.body ?? {}).status as string | undefined;
  const allowed = ['active', 'completed', 'abandoned'];
  if (!status || !allowed.includes(status)) {
    res
      .status(400)
      .json({ error: `status deve ser um de: ${allowed.join(', ')}` });
    return;
  }
  const updated = await updateSessionStatus(
    req.params.id,
    status as 'active' | 'completed' | 'abandoned',
  );
  if (!updated) {
    res.status(404).json({ error: 'Sessão não encontrada' });
    return;
  }
  res.json(updated);
}));
