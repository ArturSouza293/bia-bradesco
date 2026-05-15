// =================================================================
// Camada de persistência — todas as operações de banco num lugar só
// =================================================================

import { getDb, uid, nowIso } from '../db.ts';
import { calcularPerfilRisco, classificarHorizonte } from './risk-profile.ts';
import { calcularSmartScore, CATEGORIA_ICONE } from './smart-score.ts';
import { calcularSuitability } from './suitability.ts';
import type {
  ClientProfile,
  ClientProfileInput,
  CrossSellInput,
  CrossSellOpportunity,
  EducationTopic,
  Objective,
  ObjectiveInput,
  PastObjective,
  Role,
  SessionRow,
  SessionStatus,
  User,
  UserMemory,
} from './types.ts';

// ----------------------------------------------------------------
// Sessions
// ----------------------------------------------------------------
export function createSession(): { id: string; started_at: string } {
  const db = getDb();
  const id = uid();
  const started_at = nowIso();
  db.prepare(
    'INSERT INTO sessions (id, started_at, status, created_at) VALUES (?, ?, ?, ?)',
  ).run(id, started_at, 'active', started_at);
  return { id, started_at };
}

export function getSession(id: string): SessionRow | undefined {
  return getDb()
    .prepare('SELECT * FROM sessions WHERE id = ?')
    .get(id) as SessionRow | undefined;
}

export function updateSessionStatus(
  id: string,
  status: SessionStatus,
): SessionRow | null {
  const db = getDb();
  const session = getSession(id);
  if (!session) return null;

  const ended_at =
    status === 'completed' || status === 'abandoned' ? nowIso() : null;
  let duration_minutes: number | null = null;
  if (ended_at) {
    duration_minutes = Math.max(
      0,
      Math.round(
        (new Date(ended_at).getTime() -
          new Date(session.started_at).getTime()) /
          60000,
      ),
    );
  }
  db.prepare(
    'UPDATE sessions SET status = ?, ended_at = ?, duration_minutes = ? WHERE id = ?',
  ).run(status, ended_at, duration_minutes, id);
  return getSession(id) ?? null;
}

// ----------------------------------------------------------------
// Users — memória por pessoa. Identificada pelo nome (case-insensitive);
// o id sequencial desambigua homônimos e vira etiqueta pública ("Nome #id").
// Numa demo, quem repete o mesmo nome é tratado como a mesma pessoa
// voltando — homônimos compartilham memória (trade-off aceito).
// ----------------------------------------------------------------
export function displayTag(user: { id: number; nome: string }): string {
  return `${user.nome} #${user.id}`;
}

export function registerUserForSession(
  session_id: string,
  nomeRaw: string,
): UserMemory {
  const db = getDb();
  const nome = nomeRaw.trim().replace(/\s+/g, ' ');
  const nome_lower = nome.toLowerCase();

  let user = db
    .prepare(
      'SELECT id, nome, created_at FROM users WHERE nome_lower = ? ORDER BY id ASC LIMIT 1',
    )
    .get(nome_lower) as User | undefined;

  const is_returning = Boolean(user);

  if (!user) {
    const created_at = nowIso();
    const info = db
      .prepare(
        'INSERT INTO users (nome, nome_lower, created_at) VALUES (?, ?, ?)',
      )
      .run(nome, nome_lower, created_at);
    user = { id: Number(info.lastInsertRowid), nome, created_at };
  }

  // Liga a sessão atual ao usuário
  db.prepare('UPDATE sessions SET user_id = ? WHERE id = ?').run(
    user.id,
    session_id,
  );

  // Memória: o que esse usuário registrou em sessões ANTERIORES
  const past_objectives = db
    .prepare(
      `SELECT o.titulo_curto, o.categoria, o.valor_presente_brl, o.horizonte_anos
       FROM objectives o
       JOIN sessions s ON s.id = o.session_id
       WHERE s.user_id = ? AND o.session_id != ?
       ORDER BY o.created_at ASC`,
    )
    .all(user.id, session_id) as unknown as PastObjective[];

  const past_sessions = (
    db
      .prepare(
        'SELECT COUNT(*) AS n FROM sessions WHERE user_id = ? AND id != ?',
      )
      .get(user.id, session_id) as { n: number }
  ).n;

  const last_profile =
    (db
      .prepare(
        `SELECT cp.* FROM client_profiles cp
         JOIN sessions s ON s.id = cp.session_id
         WHERE s.user_id = ? AND cp.session_id != ?
         ORDER BY cp.updated_at DESC LIMIT 1`,
      )
      .get(user.id, session_id) as unknown as ClientProfile | undefined) ?? null;

  return {
    user,
    display_tag: displayTag(user),
    is_returning,
    past_sessions,
    past_objectives,
    last_profile,
  };
}

export function getUserForSession(session_id: string): User | null {
  const row = getDb()
    .prepare(
      `SELECT u.id, u.nome, u.created_at FROM users u
       JOIN sessions s ON s.user_id = u.id WHERE s.id = ?`,
    )
    .get(session_id) as unknown as User | undefined;
  return row ?? null;
}

// ----------------------------------------------------------------
// Messages
// ----------------------------------------------------------------
export function insertMessage(
  session_id: string,
  role: Role,
  content: string,
): string {
  const id = uid();
  getDb()
    .prepare(
      'INSERT INTO messages (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)',
    )
    .run(id, session_id, role, content, nowIso());
  return id;
}

export function getMessages(
  session_id: string,
): { id: string; role: Role; content: string; created_at: string }[] {
  return getDb()
    .prepare(
      'SELECT id, role, content, created_at FROM messages WHERE session_id = ? ORDER BY created_at ASC, rowid ASC',
    )
    .all(session_id) as unknown as {
    id: string;
    role: Role;
    content: string;
    created_at: string;
  }[];
}

export function countUserMessages(session_id: string): number {
  const row = getDb()
    .prepare(
      "SELECT COUNT(*) AS n FROM messages WHERE session_id = ? AND role = 'user'",
    )
    .get(session_id) as { n: number };
  return row.n;
}

// ----------------------------------------------------------------
// Objectives
// ----------------------------------------------------------------
function rowToObjective(r: Record<string, unknown>): Objective {
  return {
    id: r.id as string,
    session_id: r.session_id as string,
    categoria: r.categoria as Objective['categoria'],
    classe_objetivo:
      (r.classe_objetivo as Objective['classe_objetivo']) ?? null,
    horizonte_classe:
      (r.horizonte_classe as Objective['horizonte_classe']) ?? null,
    icone: (r.icone as string) ?? null,
    titulo_curto: r.titulo_curto as string,
    descricao: (r.descricao as string) ?? null,
    valor_presente_brl: (r.valor_presente_brl as number) ?? null,
    horizonte_anos: (r.horizonte_anos as number) ?? null,
    ano_alvo: (r.ano_alvo as number) ?? null,
    prioridade: r.prioridade as Objective['prioridade'],
    modalidade: (r.modalidade as string) ?? null,
    flexibilidade_prazo: (r.flexibilidade_prazo as Objective['flexibilidade_prazo']) ?? null,
    flexibilidade_valor: (r.flexibilidade_valor as Objective['flexibilidade_valor']) ?? null,
    perfil_risco_sugerido: (r.perfil_risco_sugerido as Objective['perfil_risco_sugerido']) ?? null,
    completude_score: (r.completude_score as number) ?? 0,
    completude_detalhes: r.completude_detalhes
      ? JSON.parse(r.completude_detalhes as string)
      : null,
    trade_offs: (r.trade_offs as string) ?? null,
    observacoes_cliente: (r.observacoes_cliente as string) ?? null,
    sinais_atencao: r.sinais_atencao
      ? JSON.parse(r.sinais_atencao as string)
      : null,
    proximo_passo_planejador: (r.proximo_passo_planejador as string) ?? null,
    created_at: r.created_at as string,
    updated_at: r.updated_at as string,
  };
}

export function getObjectives(session_id: string): Objective[] {
  const rows = getDb()
    .prepare(
      'SELECT * FROM objectives WHERE session_id = ? ORDER BY created_at ASC, rowid ASC',
    )
    .all(session_id) as Record<string, unknown>[];
  return rows.map(rowToObjective);
}

/**
 * Insere ou atualiza um objetivo. Chave lógica de deduplicação:
 * - categoria 'outro'  → (session_id, titulo_curto)
 * - demais categorias  → (session_id, categoria)  [1 objetivo por categoria]
 * Isso evita duplicatas quando o LLM varia o título entre chamadas.
 * Calcula perfil de risco, completude SMART, ano_alvo e ícone derivados.
 */
export function upsertObjective(
  session_id: string,
  input: ObjectiveInput,
): Objective {
  const db = getDb();

  const perfil = calcularPerfilRisco({
    categoria: input.categoria,
    horizonte_anos: input.horizonte_anos,
    flexibilidade_prazo: input.flexibilidade_prazo,
    flexibilidade_valor: input.flexibilidade_valor,
  });
  const { score, detalhes } = calcularSmartScore(input);
  const ano_alvo =
    input.ano_alvo ?? new Date().getFullYear() + input.horizonte_anos;
  const icone = input.icone ?? CATEGORIA_ICONE[input.categoria] ?? '🎯';
  const sinais = input.sinais_atencao ?? [];
  const horizonte_classe = classificarHorizonte(input.horizonte_anos);

  const existing = (
    input.categoria === 'outro'
      ? db
          .prepare(
            'SELECT id FROM objectives WHERE session_id = ? AND categoria = ? AND titulo_curto = ?',
          )
          .get(session_id, input.categoria, input.titulo_curto)
      : db
          .prepare(
            'SELECT id FROM objectives WHERE session_id = ? AND categoria = ?',
          )
          .get(session_id, input.categoria)
  ) as { id: string } | undefined;

  if (existing) {
    db.prepare(
      `UPDATE objectives SET
        categoria = ?, classe_objetivo = ?, horizonte_classe = ?, icone = ?,
        descricao = ?, valor_presente_brl = ?,
        horizonte_anos = ?, ano_alvo = ?, prioridade = ?, modalidade = ?,
        flexibilidade_prazo = ?, flexibilidade_valor = ?, perfil_risco_sugerido = ?,
        completude_score = ?, completude_detalhes = ?, trade_offs = ?,
        observacoes_cliente = ?, sinais_atencao = ?, proximo_passo_planejador = ?,
        updated_at = ?
      WHERE id = ?`,
    ).run(
      input.categoria,
      input.classe_objetivo,
      horizonte_classe,
      icone,
      input.descricao,
      input.valor_presente_brl,
      input.horizonte_anos,
      ano_alvo,
      input.prioridade,
      input.modalidade ?? null,
      input.flexibilidade_prazo ?? null,
      input.flexibilidade_valor ?? null,
      perfil,
      score,
      JSON.stringify(detalhes),
      input.trade_offs ?? null,
      input.observacoes_cliente ?? null,
      JSON.stringify(sinais),
      input.proximo_passo_planejador ?? null,
      nowIso(),
      existing.id,
    );
    return rowToObjective(
      db.prepare('SELECT * FROM objectives WHERE id = ?').get(existing.id) as Record<string, unknown>,
    );
  }

  const id = uid();
  const now = nowIso();
  db.prepare(
    `INSERT INTO objectives (
      id, session_id, categoria, classe_objetivo, horizonte_classe, icone,
      titulo_curto, descricao,
      valor_presente_brl, horizonte_anos, ano_alvo, prioridade, modalidade,
      flexibilidade_prazo, flexibilidade_valor, perfil_risco_sugerido,
      completude_score, completude_detalhes, trade_offs, observacoes_cliente,
      sinais_atencao, proximo_passo_planejador, created_at, updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(
    id,
    session_id,
    input.categoria,
    input.classe_objetivo,
    horizonte_classe,
    icone,
    input.titulo_curto,
    input.descricao,
    input.valor_presente_brl,
    input.horizonte_anos,
    ano_alvo,
    input.prioridade,
    input.modalidade ?? null,
    input.flexibilidade_prazo ?? null,
    input.flexibilidade_valor ?? null,
    perfil,
    score,
    JSON.stringify(detalhes),
    input.trade_offs ?? null,
    input.observacoes_cliente ?? null,
    JSON.stringify(sinais),
    input.proximo_passo_planejador ?? null,
    now,
    now,
  );
  return rowToObjective(
    db.prepare('SELECT * FROM objectives WHERE id = ?').get(id) as Record<string, unknown>,
  );
}

// ----------------------------------------------------------------
// Education topics
// ----------------------------------------------------------------
export function insertEducationTopic(
  session_id: string,
  topico: string,
  resumo: string | null,
): EducationTopic {
  const db = getDb();
  const id = uid();
  const created_at = nowIso();
  db.prepare(
    'INSERT INTO education_topics (id, session_id, topico, resumo, created_at) VALUES (?, ?, ?, ?, ?)',
  ).run(id, session_id, topico, resumo, created_at);
  return { id, session_id, topico, resumo, created_at };
}

export function getEducationTopics(session_id: string): EducationTopic[] {
  return getDb()
    .prepare(
      'SELECT id, session_id, topico, resumo, created_at FROM education_topics WHERE session_id = ? ORDER BY created_at ASC, rowid ASC',
    )
    .all(session_id) as unknown as EducationTopic[];
}

// ----------------------------------------------------------------
// Out-of-scope notes
// ----------------------------------------------------------------
export function insertOutOfScopeNote(session_id: string, nota: string): void {
  getDb()
    .prepare(
      'INSERT INTO out_of_scope_notes (id, session_id, nota, created_at) VALUES (?, ?, ?, ?)',
    )
    .run(uid(), session_id, nota, nowIso());
}

export function getOutOfScopeNotes(session_id: string): string[] {
  const rows = getDb()
    .prepare(
      'SELECT nota FROM out_of_scope_notes WHERE session_id = ? ORDER BY created_at ASC, rowid ASC',
    )
    .all(session_id) as unknown as { nota: string }[];
  return rows.map((r) => r.nota);
}

// ----------------------------------------------------------------
// Cross-sell — oportunidades comerciais (lente de gerente de conta)
// Deduplicado por (session_id, produto): registrar o mesmo produto de
// novo apenas atualiza a oportunidade, não cria duplicata.
// ----------------------------------------------------------------
export function upsertCrossSell(
  session_id: string,
  input: CrossSellInput,
): CrossSellOpportunity {
  const db = getDb();
  const existing = db
    .prepare(
      'SELECT id, created_at FROM cross_sell_opportunities WHERE session_id = ? AND produto = ?',
    )
    .get(session_id, input.produto) as
    | { id: string; created_at: string }
    | undefined;

  if (existing) {
    db.prepare(
      'UPDATE cross_sell_opportunities SET gatilho = ?, racional = ?, prioridade = ? WHERE id = ?',
    ).run(input.gatilho, input.racional, input.prioridade, existing.id);
    return {
      id: existing.id,
      session_id,
      produto: input.produto,
      gatilho: input.gatilho,
      racional: input.racional,
      prioridade: input.prioridade,
      created_at: existing.created_at,
    };
  }

  const id = uid();
  const created_at = nowIso();
  db.prepare(
    'INSERT INTO cross_sell_opportunities (id, session_id, produto, gatilho, racional, prioridade, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
  ).run(
    id,
    session_id,
    input.produto,
    input.gatilho,
    input.racional,
    input.prioridade,
    created_at,
  );
  return {
    id,
    session_id,
    produto: input.produto,
    gatilho: input.gatilho,
    racional: input.racional,
    prioridade: input.prioridade,
    created_at,
  };
}

export function getCrossSells(session_id: string): CrossSellOpportunity[] {
  return getDb()
    .prepare(
      'SELECT id, session_id, produto, gatilho, racional, prioridade, created_at FROM cross_sell_opportunities WHERE session_id = ? ORDER BY created_at ASC, rowid ASC',
    )
    .all(session_id) as unknown as CrossSellOpportunity[];
}

// ----------------------------------------------------------------
// Perfil 360° do cliente (anamnese) — um por sessão.
// O suitability (perfil de investidor) é derivado pelo servidor.
// ----------------------------------------------------------------
export function upsertClientProfile(
  session_id: string,
  input: ClientProfileInput,
): ClientProfile {
  const db = getDb();
  const suitability = calcularSuitability({
    experiencia_investimentos: input.experiencia_investimentos,
    tolerancia_risco: input.tolerancia_risco,
    idade: input.idade,
  });
  const now = nowIso();
  const existing = db
    .prepare('SELECT created_at FROM client_profiles WHERE session_id = ?')
    .get(session_id) as { created_at: string } | undefined;

  db.prepare(
    `INSERT INTO client_profiles (
      session_id, idade, estado_civil, dependentes, profissao,
      renda_mensal_faixa, experiencia_investimentos, tolerancia_risco,
      perfil_suitability, observacoes, created_at, updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)
    ON CONFLICT(session_id) DO UPDATE SET
      idade = excluded.idade,
      estado_civil = excluded.estado_civil,
      dependentes = excluded.dependentes,
      profissao = excluded.profissao,
      renda_mensal_faixa = excluded.renda_mensal_faixa,
      experiencia_investimentos = excluded.experiencia_investimentos,
      tolerancia_risco = excluded.tolerancia_risco,
      perfil_suitability = excluded.perfil_suitability,
      observacoes = excluded.observacoes,
      updated_at = excluded.updated_at`,
  ).run(
    session_id,
    input.idade,
    input.estado_civil,
    input.dependentes,
    input.profissao,
    input.renda_mensal_faixa,
    input.experiencia_investimentos,
    input.tolerancia_risco,
    suitability,
    input.observacoes ?? null,
    existing?.created_at ?? now,
    now,
  );

  return getClientProfile(session_id) as ClientProfile;
}

export function getClientProfile(session_id: string): ClientProfile | null {
  const row = getDb()
    .prepare('SELECT * FROM client_profiles WHERE session_id = ?')
    .get(session_id) as ClientProfile | undefined;
  return row ?? null;
}
