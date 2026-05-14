import express from 'express';
import type { Request, Response } from 'express';
import {
  createSession,
  getSession,
  insertMessage,
  updateSessionStatus,
} from '../lib/store.ts';
import { OPENING_MESSAGES } from '../lib/bia.ts';

export const sessionsRouter = express.Router();

// POST /api/sessions — cria sessão e semeia as mensagens de abertura
sessionsRouter.post('/sessions', (_req: Request, res: Response) => {
  const { id, started_at } = createSession();
  for (const m of OPENING_MESSAGES) {
    insertMessage(id, 'assistant', m.text);
  }
  res.status(201).json({
    id,
    started_at,
    status: 'active',
    opening_messages: OPENING_MESSAGES,
  });
});

// GET /api/sessions/:id
sessionsRouter.get('/sessions/:id', (req: Request, res: Response) => {
  const session = getSession(req.params.id);
  if (!session) {
    res.status(404).json({ error: 'Sessão não encontrada' });
    return;
  }
  res.json(session);
});

// PATCH /api/sessions/:id — atualiza status (completed / abandoned)
sessionsRouter.patch('/sessions/:id', (req: Request, res: Response) => {
  const status = (req.body ?? {}).status as string | undefined;
  const allowed = ['active', 'completed', 'abandoned'];
  if (!status || !allowed.includes(status)) {
    res
      .status(400)
      .json({ error: `status deve ser um de: ${allowed.join(', ')}` });
    return;
  }
  const updated = updateSessionStatus(
    req.params.id,
    status as 'active' | 'completed' | 'abandoned',
  );
  if (!updated) {
    res.status(404).json({ error: 'Sessão não encontrada' });
    return;
  }
  res.json(updated);
});
