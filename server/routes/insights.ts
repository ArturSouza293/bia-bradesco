// =================================================================
// /api/insights — métricas agregadas do banco para revisar a conversa.
// Espelha o `npm run analyze`, mas em JSON para consumo pela web.
// Útil para acompanhar como os colegas estão testando a demo.
// =================================================================

import express from 'express';
import type { Request, Response } from 'express';
import { getDb } from '../db.ts';

export const insightsRouter = express.Router();

function count(sql: string, ...params: (string | number)[]): number {
  const row = getDb().prepare(sql).get(...params) as { n: number } | undefined;
  return row?.n ?? 0;
}

function avg(sql: string): number {
  const row = getDb().prepare(sql).get() as { v: number | null } | undefined;
  return Math.round((row?.v ?? 0) * 10) / 10;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

insightsRouter.get('/insights', (_req: Request, res: Response) => {
  const totalSessions = count('SELECT COUNT(*) AS n FROM sessions');
  if (totalSessions === 0) {
    res.json({ empty: true, totalSessions: 0 });
    return;
  }

  const db = getDb();

  // Sessões
  const completed = count(
    `SELECT COUNT(*) AS n FROM sessions WHERE status = 'completed'`,
  );
  const active = count(
    `SELECT COUNT(*) AS n FROM sessions WHERE status = 'active'`,
  );
  const abandoned = count(
    `SELECT COUNT(*) AS n FROM sessions WHERE status = 'abandoned'`,
  );
  const avgDurationMin = avg(
    'SELECT AVG(duration_minutes) AS v FROM sessions WHERE duration_minutes IS NOT NULL',
  );

  // Engajamento
  const totalMsgs = count('SELECT COUNT(*) AS n FROM messages');
  const userMsgs = count(
    `SELECT COUNT(*) AS n FROM messages WHERE role = 'user'`,
  );

  // Usuários (memória por pessoa)
  const totalUsers = count('SELECT COUNT(*) AS n FROM users');
  const returningUsers = count(
    `SELECT COUNT(*) AS n FROM (
      SELECT user_id FROM sessions
      WHERE user_id IS NOT NULL
      GROUP BY user_id
      HAVING COUNT(*) > 1
    )`,
  );

  // Saída estruturada
  const totalObj = count('SELECT COUNT(*) AS n FROM objectives');
  const totalEdu = count('SELECT COUNT(*) AS n FROM education_topics');
  const totalCross = count(
    'SELECT COUNT(*) AS n FROM cross_sell_opportunities',
  );
  const sessionsWith3 = count(
    'SELECT COUNT(*) AS n FROM (SELECT session_id FROM objectives GROUP BY session_id HAVING COUNT(*) >= 3)',
  );

  // Qualidade
  const avgSmart = avg('SELECT AVG(completude_score) AS v FROM objectives');
  const byCategoria = db
    .prepare(
      'SELECT categoria, COUNT(*) AS n FROM objectives GROUP BY categoria ORDER BY n DESC',
    )
    .all() as { categoria: string; n: number }[];
  const byPerfil = db
    .prepare(
      `SELECT perfil_risco_sugerido AS p, COUNT(*) AS n FROM objectives
       WHERE perfil_risco_sugerido IS NOT NULL
       GROUP BY p ORDER BY n DESC`,
    )
    .all() as { p: string; n: number }[];

  // Eficiência — turnos até o 1º objetivo
  const firstObjPerSession = db
    .prepare(
      `SELECT o.session_id AS sid, MIN(o.created_at) AS first_obj
       FROM objectives o GROUP BY o.session_id`,
    )
    .all() as { sid: string; first_obj: string }[];
  let turnsSum = 0;
  let turnsCounted = 0;
  for (const r of firstObjPerSession) {
    const n = count(
      `SELECT COUNT(*) AS n FROM messages WHERE session_id = ? AND role = 'user' AND created_at <= ?`,
      r.sid,
      r.first_obj,
    );
    turnsSum += n;
    turnsCounted++;
  }
  const turnsToFirstObj =
    turnsCounted ? round1(turnsSum / turnsCounted) : null;

  // Cross-sell
  const byProduto = db
    .prepare(
      'SELECT produto, COUNT(*) AS n FROM cross_sell_opportunities GROUP BY produto ORDER BY n DESC',
    )
    .all() as { produto: string; n: number }[];

  // Sugestões automáticas
  const suggestions: string[] = [];
  const completionRate = completed / totalSessions;
  if (completionRate < 0.6) {
    suggestions.push(
      `Taxa de conclusão baixa (${Math.round(completionRate * 100)}%). Revise a Fase 2 — talvez esteja longa demais.`,
    );
  }
  if (turnsToFirstObj !== null && turnsToFirstObj > 4) {
    suggestions.push(
      'Demora muitos turnos até o 1º objetivo. Considere uma pergunta de descoberta mais direta na Fase 1.',
    );
  }
  const avgObjPerSession = totalObj / totalSessions;
  if (avgObjPerSession < 3) {
    suggestions.push(
      `Média de ${round1(avgObjPerSession)} objetivos/sessão (alvo: 3-5). A Bia pode estar fechando cedo demais.`,
    );
  }
  if (totalEdu / totalSessions < 2) {
    suggestions.push(
      'Pouca educação financeira por sessão (alvo: 2-4). Reforce a instrução de explicar conceitos pelo caminho.',
    );
  }
  if (suggestions.length === 0) {
    suggestions.push('Métricas dentro do esperado.');
  }

  res.json({
    empty: false,
    sessions: {
      total: totalSessions,
      completed,
      active,
      abandoned,
      completion_rate_pct: Math.round((completed / totalSessions) * 100),
      avg_duration_min: avgDurationMin,
    },
    users: {
      total: totalUsers,
      returning: returningUsers,
    },
    engagement: {
      total_messages: totalMsgs,
      avg_messages_per_session: round1(totalMsgs / totalSessions),
      avg_user_turns_per_session: round1(userMsgs / totalSessions),
      avg_turns_to_first_objective: turnsToFirstObj,
    },
    output: {
      total_objectives: totalObj,
      avg_objectives_per_session: round1(totalObj / totalSessions),
      sessions_with_3plus_objectives: sessionsWith3,
      total_education_topics: totalEdu,
      avg_education_per_session: round1(totalEdu / totalSessions),
      total_cross_sell_opportunities: totalCross,
      avg_cross_sell_per_session: round1(totalCross / totalSessions),
    },
    quality: {
      avg_smart_score: avgSmart,
      by_categoria: byCategoria,
      by_perfil_risco: byPerfil,
    },
    cross_sell_by_produto: byProduto,
    suggestions,
  });
});
