import { asyncRoute } from '../lib/async-route.js';
import express from 'express';
import type { Request, Response } from 'express';
import {
  getClientProfile,
  getCrossSells,
  getEducationTopics,
  getObjectives,
  getOutOfScopeNotes,
  getUserForSession,
} from '../lib/store.js';

export const objectivesRouter = express.Router();

// GET /api/objectives?session_id=X
// Retorna tudo que a sessão produziu: perfil 360° do cliente, objetivos,
// conceitos de educação, oportunidades de cross-sell e notas fora de escopo.
objectivesRouter.get('/objectives', asyncRoute(async (req: Request, res: Response) => {
  const session_id = String(req.query.session_id ?? '');
  if (!session_id) {
    res.status(400).json({ error: 'session_id é obrigatório' });
    return;
  }
  // Em paralelo: são seis leituras independentes e cada uma é um
  // round-trip de rede quando o banco é o Turso.
  const [
    user,
    client_profile,
    objectives,
    education_topics,
    cross_sell,
    out_of_scope_notes,
  ] = await Promise.all([
    getUserForSession(session_id),
    getClientProfile(session_id),
    getObjectives(session_id),
    getEducationTopics(session_id),
    getCrossSells(session_id),
    getOutOfScopeNotes(session_id),
  ]);
  res.json({
    user,
    client_profile,
    objectives,
    education_topics,
    cross_sell,
    out_of_scope_notes,
  });
}));
