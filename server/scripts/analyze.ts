// =================================================================
// Análise de logs — lê o SQLite e reporta métricas da conversa.
// Uso: npm run analyze
//
// Objetivo: usar os dados reais das sessões para melhorar o roteiro
// da Bia (onde a conversa trava, quantos turnos até o 1º objetivo,
// quais oportunidades aparecem, etc.).
// =================================================================

import { getDb } from '../db.ts';

const db = getDb();

function count(sql: string, ...params: (string | number)[]): number {
  const row = db.prepare(sql).get(...params) as { n: number } | undefined;
  return row?.n ?? 0;
}

function avg(sql: string): number {
  const row = db.prepare(sql).get() as { v: number | null } | undefined;
  return Math.round((row?.v ?? 0) * 10) / 10;
}

const line = (s = '') => console.log(s);
const h = (s: string) => {
  line();
  line(`── ${s} ${'─'.repeat(Math.max(0, 56 - s.length))}`);
};

line();
line('  ╔══════════════════════════════════════════════════════╗');
line('  ║   Bia · Bradesco — análise de logs das conversas      ║');
line('  ╚══════════════════════════════════════════════════════╝');

// ---------------------------------------------------------------
const totalSessions = count('SELECT COUNT(*) AS n FROM sessions');
if (totalSessions === 0) {
  line();
  line('  Nenhuma sessão no banco ainda. Rode algumas conversas e volte.');
  line();
  process.exit(0);
}

h('Sessões');
line(`  Total:        ${totalSessions}`);
for (const status of ['active', 'completed', 'abandoned']) {
  const n = count('SELECT COUNT(*) AS n FROM sessions WHERE status = ?', status);
  const pct = Math.round((n / totalSessions) * 100);
  line(`  ${status.padEnd(12)} ${String(n).padStart(3)}  (${pct}%)`);
}
const avgDuration = avg(
  "SELECT AVG(duration_minutes) AS v FROM sessions WHERE duration_minutes IS NOT NULL",
);
line(`  Duração média (encerradas): ${avgDuration} min`);

// ---------------------------------------------------------------
h('Engajamento');
const totalMsgs = count('SELECT COUNT(*) AS n FROM messages');
const userMsgs = count("SELECT COUNT(*) AS n FROM messages WHERE role = 'user'");
const asstMsgs = count(
  "SELECT COUNT(*) AS n FROM messages WHERE role = 'assistant'",
);
line(`  Mensagens totais:        ${totalMsgs}`);
line(
  `  Por sessão (média):      ${Math.round((totalMsgs / totalSessions) * 10) / 10}`,
);
line(
  `  Turnos do usuário/sessão: ${Math.round((userMsgs / totalSessions) * 10) / 10}`,
);
line(`  Mensagens da Bia:        ${asstMsgs}`);

// ---------------------------------------------------------------
h('Saída estruturada (o que a jornada produziu)');
const totalObj = count('SELECT COUNT(*) AS n FROM objectives');
const totalEdu = count('SELECT COUNT(*) AS n FROM education_topics');
const totalCross = count('SELECT COUNT(*) AS n FROM cross_sell_opportunities');
const sessionsWith3 = count(
  'SELECT COUNT(*) AS n FROM (SELECT session_id FROM objectives GROUP BY session_id HAVING COUNT(*) >= 3)',
);
line(
  `  Objetivos:               ${totalObj}  (média ${Math.round((totalObj / totalSessions) * 10) / 10}/sessão)`,
);
line(
  `  Conceitos de educação:   ${totalEdu}  (média ${Math.round((totalEdu / totalSessions) * 10) / 10}/sessão)`,
);
line(
  `  Oportunidades cross-sell:${String(totalCross).padStart(4)}  (média ${Math.round((totalCross / totalSessions) * 10) / 10}/sessão)`,
);
line(
  `  Sessões com ≥ 3 objetivos: ${sessionsWith3}/${totalSessions} (${Math.round((sessionsWith3 / totalSessions) * 100)}%)`,
);

// ---------------------------------------------------------------
h('Qualidade dos objetivos');
line(`  Completude SMART média:  ${avg('SELECT AVG(completude_score) AS v FROM objectives')}%`);
const byCategoria = db
  .prepare(
    'SELECT categoria, COUNT(*) AS n FROM objectives GROUP BY categoria ORDER BY n DESC',
  )
  .all() as { categoria: string; n: number }[];
line('  Por categoria:');
for (const r of byCategoria) line(`    ${r.categoria.padEnd(22)} ${r.n}`);
const byPerfil = db
  .prepare(
    'SELECT perfil_risco_sugerido AS p, COUNT(*) AS n FROM objectives GROUP BY p ORDER BY n DESC',
  )
  .all() as { p: string; n: number }[];
line('  Por perfil de risco:');
for (const r of byPerfil) line(`    ${String(r.p).padEnd(22)} ${r.n}`);

// ---------------------------------------------------------------
h('Eficiência da conversa');
// turnos do usuário até o 1º objetivo de cada sessão
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
    "SELECT COUNT(*) AS n FROM messages WHERE session_id = ? AND role = 'user' AND created_at <= ?",
    r.sid,
    r.first_obj,
  );
  turnsSum += n;
  turnsCounted++;
}
line(
  `  Turnos do usuário até o 1º objetivo: ${
    turnsCounted ? Math.round((turnsSum / turnsCounted) * 10) / 10 : 'n/a'
  }`,
);

// drop-off: sessões abandonadas/ativas — em quantas mensagens pararam
const stale = db
  .prepare(
    `SELECT s.id AS sid,
            (SELECT COUNT(*) FROM messages m WHERE m.session_id = s.id AND m.role='user') AS user_turns,
            (SELECT COUNT(*) FROM objectives o WHERE o.session_id = s.id) AS objs
     FROM sessions s WHERE s.status != 'completed'`,
  )
  .all() as { sid: string; user_turns: number; objs: number }[];
if (stale.length) {
  const avgTurns =
    Math.round(
      (stale.reduce((a, b) => a + b.user_turns, 0) / stale.length) * 10,
    ) / 10;
  const noObj = stale.filter((s) => s.objs === 0).length;
  line(
    `  Sessões não concluídas: ${stale.length} — pararam com ${avgTurns} turnos em média, ${noObj} sem nenhum objetivo`,
  );
} else {
  line('  Sessões não concluídas: 0 🎉');
}

// ---------------------------------------------------------------
h('Inteligência comercial (cross-sell)');
const byProduto = db
  .prepare(
    'SELECT produto, COUNT(*) AS n FROM cross_sell_opportunities GROUP BY produto ORDER BY n DESC',
  )
  .all() as { produto: string; n: number }[];
if (byProduto.length === 0) {
  line('  Nenhuma oportunidade registrada ainda.');
} else {
  for (const r of byProduto) line(`    ${r.produto.padEnd(26)} ${r.n}`);
}

// ---------------------------------------------------------------
h('Sugestões automáticas');
const suggestions: string[] = [];
const completionRate =
  count("SELECT COUNT(*) AS n FROM sessions WHERE status = 'completed'") /
  totalSessions;
if (completionRate < 0.6) {
  suggestions.push(
    `Taxa de conclusão baixa (${Math.round(completionRate * 100)}%). Revise a Fase 2 — talvez esteja longa demais.`,
  );
}
if (turnsCounted && turnsSum / turnsCounted > 4) {
  suggestions.push(
    'Demora muitos turnos até o 1º objetivo. Considere uma pergunta de descoberta mais direta na Fase 1.',
  );
}
const avgObjPerSession = totalObj / totalSessions;
if (avgObjPerSession < 3) {
  suggestions.push(
    `Média de ${Math.round(avgObjPerSession * 10) / 10} objetivos/sessão (alvo: 3-5). A Bia pode estar fechando cedo demais.`,
  );
}
if (totalEdu / totalSessions < 2) {
  suggestions.push(
    'Pouca educação financeira por sessão (alvo: 2-4). Reforce a instrução de explicar conceitos pelo caminho.',
  );
}
if (suggestions.length === 0) {
  suggestions.push('Métricas dentro do esperado. 👍');
}
for (const s of suggestions) line(`  • ${s}`);
line();
