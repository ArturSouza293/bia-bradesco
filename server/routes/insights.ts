import { asyncRoute } from '../lib/async-route.js';
// =================================================================
// /api/insights — métricas agregadas do banco para revisar a conversa.
// Espelha o `npm run analyze`, mas em JSON para consumo pela web.
// Útil para acompanhar como os colegas estão testando a demo.
// =================================================================

import express from 'express';
import type { Request, Response } from 'express';
import { get, all } from '../db.js';

export const insightsRouter = express.Router();

async function count(
  sql: string,
  ...params: (string | number)[]
): Promise<number> {
  const row = await get<{ n: number }>(sql, params);
  return row?.n ?? 0;
}

async function avg(sql: string): Promise<number> {
  const row = await get<{ v: number | null }>(sql);
  return Math.round((row?.v ?? 0) * 10) / 10;
}

function round1(n: number): number {
  return Math.round(n * 10) / 10;
}

insightsRouter.get('/insights', asyncRoute(async (_req: Request, res: Response) => {
  const totalSessions = await count('SELECT COUNT(*) AS n FROM sessions');
  if (totalSessions === 0) {
    res.json({ empty: true, totalSessions: 0 });
    return;
  }

  // Sessões
  const completed = await count(
    `SELECT COUNT(*) AS n FROM sessions WHERE status = 'completed'`,
  );
  const active = await count(
    `SELECT COUNT(*) AS n FROM sessions WHERE status = 'active'`,
  );
  const abandoned = await count(
    `SELECT COUNT(*) AS n FROM sessions WHERE status = 'abandoned'`,
  );
  const avgDurationMin = await avg(
    'SELECT AVG(duration_minutes) AS v FROM sessions WHERE duration_minutes IS NOT NULL',
  );

  // Engajamento
  const totalMsgs = await count('SELECT COUNT(*) AS n FROM messages');
  const userMsgs = await count(
    `SELECT COUNT(*) AS n FROM messages WHERE role = 'user'`,
  );

  // Usuários (memória por pessoa)
  const totalUsers = await count('SELECT COUNT(*) AS n FROM users');
  const returningUsers = await count(
    `SELECT COUNT(*) AS n FROM (
      SELECT user_id FROM sessions
      WHERE user_id IS NOT NULL
      GROUP BY user_id
      HAVING COUNT(*) > 1
    )`,
  );

  // Saída estruturada
  const totalObj = await count('SELECT COUNT(*) AS n FROM objectives');
  const totalEdu = await count('SELECT COUNT(*) AS n FROM education_topics');
  const totalCross = await count(
    'SELECT COUNT(*) AS n FROM cross_sell_opportunities',
  );
  const sessionsWith3 = await count(
    'SELECT COUNT(*) AS n FROM (SELECT session_id FROM objectives GROUP BY session_id HAVING COUNT(*) >= 3)',
  );

  // Qualidade
  const avgSmart = await avg('SELECT AVG(completude_score) AS v FROM objectives');
  const byCategoria = await all<{ categoria: string; n: number }>(
    'SELECT categoria, COUNT(*) AS n FROM objectives GROUP BY categoria ORDER BY n DESC',
  );
  const byPerfil = await all<{ p: string; n: number }>(
    `SELECT perfil_risco_sugerido AS p, COUNT(*) AS n FROM objectives
       WHERE perfil_risco_sugerido IS NOT NULL
       GROUP BY p ORDER BY n DESC`,
  );

  // Eficiência — turnos até o 1º objetivo
  const firstObjPerSession = await all<{ sid: string; first_obj: string }>(
    `SELECT o.session_id AS sid, MIN(o.created_at) AS first_obj
       FROM objectives o GROUP BY o.session_id`,
  );
  let turnsSum = 0;
  let turnsCounted = 0;
  for (const r of firstObjPerSession) {
    const n = await count(
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
  const byProduto = await all<{ produto: string; n: number }>(
    'SELECT produto, COUNT(*) AS n FROM cross_sell_opportunities GROUP BY produto ORDER BY n DESC',
  );

  // Aprendizados (educação financeira) — top conceitos e mais recentes
  const topTopics = await all<{
    topico: string;
    n: number;
    exemplo_resumo: string | null;
  }>(
    `SELECT topico,
              COUNT(*) AS n,
              MAX(resumo) AS exemplo_resumo
       FROM education_topics
       GROUP BY topico
       ORDER BY n DESC
       LIMIT 10`,
  );
  const recentLearnings = await all<{
    topico: string;
    resumo: string | null;
    created_at: string;
    session_id: string;
  }>(
    `SELECT topico, resumo, created_at, session_id
       FROM education_topics
       ORDER BY created_at DESC
       LIMIT 20`,
  );

  // Uso do cérebro (RAG)
  const kbConhecimento = await count(
    `SELECT COUNT(*) AS n FROM kb_queries WHERE ferramenta = 'consultar_conhecimento'`,
  );
  const kbProduto = await count(
    `SELECT COUNT(*) AS n FROM kb_queries WHERE ferramenta = 'consultar_produto'`,
  );
  const kbVazias = await count(
    `SELECT COUNT(*) AS n FROM kb_queries WHERE ferramenta = 'consultar_conhecimento' AND n_resultados = 0`,
  );
  const kbTopChunks = await all<{ top_id: string; n: number }>(
    `SELECT top_id, COUNT(*) AS n FROM kb_queries
       WHERE top_id IS NOT NULL AND ferramenta = 'consultar_conhecimento'
       GROUP BY top_id ORDER BY n DESC LIMIT 8`,
  );
  const kbBuscasVazias = await all<{ consulta: string; created_at: string }>(
    `SELECT consulta, created_at FROM kb_queries
       WHERE ferramenta = 'consultar_conhecimento' AND n_resultados = 0
       ORDER BY created_at DESC LIMIT 10`,
  );
  const eduComFonte = await count(
    `SELECT COUNT(*) AS n FROM education_topics WHERE resumo LIKE '%(fonte: kb:%'`,
  );

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
  if (kbConhecimento > 0 && kbVazias / kbConhecimento > 0.3) {
    suggestions.push(
      `${Math.round((kbVazias / kbConhecimento) * 100)}% das buscas de educação voltam vazias — o corpus tem lacunas; veja kb.buscas_vazias e escreva as notas que faltam.`,
    );
  }
  if (totalEdu > 0 && kbConhecimento === 0) {
    suggestions.push(
      'A Bia ensinou conceitos sem consultar o cérebro nenhuma vez — reforce o guardrail de consultar antes de ensinar.',
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
    learnings: {
      total: totalEdu,
      avg_per_session: round1(totalEdu / totalSessions),
      top_topics: topTopics,
      recent: recentLearnings,
    },
    cross_sell_by_produto: byProduto,
    kb: {
      consultas_educacao: kbConhecimento,
      consultas_matriz: kbProduto,
      buscas_sem_resultado: kbVazias,
      trechos_mais_usados: kbTopChunks,
      buscas_vazias: kbBuscasVazias,
      educacao_com_fonte_kb: eduComFonte,
    },
    suggestions,
  });
}));
