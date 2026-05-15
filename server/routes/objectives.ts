import express from 'express';
import type { Request, Response } from 'express';
import {
  getClientProfile,
  getCrossSells,
  getEducationTopics,
  getObjectives,
  getOutOfScopeNotes,
  getUserForSession,
} from '../lib/store.ts';

export const objectivesRouter = express.Router();

// GET /api/objectives?session_id=X
// Retorna tudo que a sessão produziu: perfil 360° do cliente, objetivos,
// conceitos de educação, oportunidades de cross-sell e notas fora de escopo.
objectivesRouter.get('/objectives', (req: Request, res: Response) => {
  const session_id = String(req.query.session_id ?? '');
  if (!session_id) {
    res.status(400).json({ error: 'session_id é obrigatório' });
    return;
  }
  res.json({
    user: getUserForSession(session_id),
    client_profile: getClientProfile(session_id),
    objectives: getObjectives(session_id),
    education_topics: getEducationTopics(session_id),
    cross_sell: getCrossSells(session_id),
    out_of_scope_notes: getOutOfScopeNotes(session_id),
  });
});
