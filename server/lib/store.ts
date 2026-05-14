// =================================================================
// Camada de persistência — todas as operações de banco num lugar só
// =================================================================

import { getDb, uid, nowIso } from '../db.ts';
import { calcularPerfilRisco } from './risk-profile.ts';
import { calcularSmartScore, CATEGORIA_ICONE } from './smart-score.ts';
import type {
  EducationTopic,
  Objective,
  ObjectiveInput,
  Role,
  SessionRow,
  SessionStatus,
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
 * Insere ou atualiza um objetivo (chave lógica: session_id + titulo_curto).
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

  const existing = db
    .prepare(
      'SELECT id FROM objectives WHERE session_id = ? AND titulo_curto = ?',
    )
    .get(session_id, input.titulo_curto) as { id: string } | undefined;

  if (existing) {
    db.prepare(
      `UPDATE objectives SET
        categoria = ?, icone = ?, descricao = ?, valor_presente_brl = ?,
        horizonte_anos = ?, ano_alvo = ?, prioridade = ?, modalidade = ?,
        flexibilidade_prazo = ?, flexibilidade_valor = ?, perfil_risco_sugerido = ?,
        completude_score = ?, completude_detalhes = ?, trade_offs = ?,
        observacoes_cliente = ?, sinais_atencao = ?, proximo_passo_planejador = ?,
        updated_at = ?
      WHERE id = ?`,
    ).run(
      input.categoria,
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
      id, session_id, categoria, icone, titulo_curto, descricao,
      valor_presente_brl, horizonte_anos, ano_alvo, prioridade, modalidade,
      flexibilidade_prazo, flexibilidade_valor, perfil_risco_sugerido,
      completude_score, completude_detalhes, trade_offs, observacoes_cliente,
      sinais_atencao, proximo_passo_planejador, created_at, updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
  ).run(
    id,
    session_id,
    input.categoria,
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
