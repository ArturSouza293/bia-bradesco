import express from 'express';
import type { Request, Response } from 'express';
import {
  getEducationTopics,
  getObjectives,
  getOutOfScopeNotes,
} from '../lib/store.ts';

export const objectivesRouter = express.Router();

// GET /api/objectives?session_id=X
// Retorna tudo que a sessão produziu: objetivos, conceitos de educação
// financeira e notas fora de escopo.
objectivesRouter.get('/objectives', (req: Request, res: Response) => {
  const session_id = String(req.query.session_id ?? '');
  if (!session_id) {
    res.status(400).json({ error: 'session_id é obrigatório' });
    return;
  }
  res.json({
    objectives: getObjectives(session_id),
    education_topics: getEducationTopics(session_id),
    out_of_scope_notes: getOutOfScopeNotes(session_id),
  });
});
