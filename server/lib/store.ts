// =================================================================
// Camada de persistência — todas as operações de banco num lugar só
//
// Assíncrona desde a migração para libSQL/Turso: o driver remoto não
// tem equivalente síncrono ao node:sqlite.
// =================================================================

import { run, get, all, uid, nowIso } from '../db.ts';
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
export async function createSession(): Promise<{
  id: string;
  started_at: string;
}> {
  const id = uid();
  const started_at = nowIso();
  await run(
    'INSERT INTO sessions (id, started_at, status, created_at) VALUES (?, ?, ?, ?)',
    [id, started_at, 'active', started_at],
  );
  return { id, started_at };
}

export async function getSession(id: string): Promise<SessionRow | undefined> {
  return get<SessionRow>('SELECT * FROM sessions WHERE id = ?', [id]);
}

export async function updateSessionStatus(
  id: string,
  status: SessionStatus,
): Promise<SessionRow | null> {
  const session = await getSession(id);
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
  await run(
    'UPDATE sessions SET status = ?, ended_at = ?, duration_minutes = ? WHERE id = ?',
    [status, ended_at, duration_minutes, id],
  );
  return (await getSession(id)) ?? null;
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

export async function registerUserForSession(
  session_id: string,
  nomeRaw: string,
): Promise<UserMemory> {
  const nome = nomeRaw.trim().replace(/\s+/g, ' ');
  const nome_lower = nome.toLowerCase();

  let user = await get<User>(
    'SELECT id, nome, created_at FROM users WHERE nome_lower = ? ORDER BY id ASC LIMIT 1',
    [nome_lower],
  );

  const is_returning = Boolean(user);

  if (!user) {
    const created_at = nowIso();
    const info = await run(
      'INSERT INTO users (nome, nome_lower, created_at) VALUES (?, ?, ?)',
      [nome, nome_lower, created_at],
    );
    user = { id: Number(info.lastInsertRowid), nome, created_at };
  }

  // Liga a sessão atual ao usuário
  await run('UPDATE sessions SET user_id = ? WHERE id = ?', [
    user.id,
    session_id,
  ]);
  // Propaga pros objetivos já registrados nesta sessão (caso a Bia
  // tenha registrado algum antes de coletar o nome).
  await run(
    'UPDATE objectives SET user_id = ? WHERE session_id = ? AND user_id IS NULL',
    [user.id, session_id],
  );

  // Memória: o que esse usuário registrou em sessões ANTERIORES
  const past_objectives = await all<PastObjective>(
    `SELECT o.titulo_curto, o.categoria, o.valor_presente_brl, o.horizonte_anos
       FROM objectives o
       JOIN sessions s ON s.id = o.session_id
       WHERE s.user_id = ? AND o.session_id != ?
       ORDER BY o.created_at ASC`,
    [user.id, session_id],
  );

  const past_sessions =
    (
      await get<{ n: number }>(
        'SELECT COUNT(*) AS n FROM sessions WHERE user_id = ? AND id != ?',
        [user.id, session_id],
      )
    )?.n ?? 0;

  const last_profile =
    (await get<ClientProfile>(
      `SELECT cp.* FROM client_profiles cp
         JOIN sessions s ON s.id = cp.session_id
         WHERE s.user_id = ? AND cp.session_id != ?
         ORDER BY cp.updated_at DESC LIMIT 1`,
      [user.id, session_id],
    )) ?? null;

  return {
    user,
    display_tag: displayTag(user),
    is_returning,
    past_sessions,
    past_objectives,
    last_profile,
  };
}

export async function getUserForSession(
  session_id: string,
): Promise<User | null> {
  const row = await get<User>(
    `SELECT u.id, u.nome, u.created_at FROM users u
       JOIN sessions s ON s.user_id = u.id WHERE s.id = ?`,
    [session_id],
  );
  return row ?? null;
}

// ----------------------------------------------------------------
// Messages
// ----------------------------------------------------------------
export async function insertMessage(
  session_id: string,
  role: Role,
  content: string,
): Promise<string> {
  const id = uid();
  await run(
    'INSERT INTO messages (id, session_id, role, content, created_at) VALUES (?, ?, ?, ?, ?)',
    [id, session_id, role, content, nowIso()],
  );
  return id;
}

export async function getMessages(
  session_id: string,
): Promise<
  { id: string; role: Role; content: string; created_at: string }[]
> {
  return all<{
    id: string;
    role: Role;
    content: string;
    created_at: string;
  }>(
    'SELECT id, role, content, created_at FROM messages WHERE session_id = ? ORDER BY created_at ASC, rowid ASC',
    [session_id],
  );
}

export async function countUserMessages(session_id: string): Promise<number> {
  const row = await get<{ n: number }>(
    "SELECT COUNT(*) AS n FROM messages WHERE session_id = ? AND role = 'user'",
    [session_id],
  );
  return row?.n ?? 0;
}

// ----------------------------------------------------------------
// Objectives
// ----------------------------------------------------------------
function rowToObjective(r: Record<string, unknown>): Objective {
  return {
    id: r.id as string,
    session_id: r.session_id as string,
    user_id: (r.user_id as number) ?? null,
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

export async function getObjectives(session_id: string): Promise<Objective[]> {
  const rows = await all<Record<string, unknown>>(
    'SELECT * FROM objectives WHERE session_id = ? ORDER BY created_at ASC, rowid ASC',
    [session_id],
  );
  return rows.map(rowToObjective);
}

/**
 * Insere ou atualiza um objetivo. Chave lógica de deduplicação:
 * - categoria 'outro'  → (session_id, titulo_curto)
 * - demais categorias  → (session_id, categoria)  [1 objetivo por categoria]
 * Isso evita duplicatas quando o LLM varia o título entre chamadas.
 * Calcula perfil de risco, completude SMART, ano_alvo e ícone derivados.
 */
export async function upsertObjective(
  session_id: string,
  input: ObjectiveInput,
): Promise<Objective> {
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

  const existing =
    input.categoria === 'outro'
      ? await get<{ id: string }>(
          'SELECT id FROM objectives WHERE session_id = ? AND categoria = ? AND titulo_curto = ?',
          [session_id, input.categoria, input.titulo_curto],
        )
      : await get<{ id: string }>(
          'SELECT id FROM objectives WHERE session_id = ? AND categoria = ?',
          [session_id, input.categoria],
        );

  // Deriva user_id da sessão (link direto cliente↔objetivo). Se a
  // sessão ainda não tem usuário, o objetivo fica null e é propagado
  // depois pelo registerUserForSession.
  const userIdRow = await get<{ user_id: number | null }>(
    'SELECT user_id FROM sessions WHERE id = ?',
    [session_id],
  );
  const user_id = userIdRow?.user_id ?? null;

  if (existing) {
    await run(
      `UPDATE objectives SET
        user_id = ?,
        categoria = ?, classe_objetivo = ?, horizonte_classe = ?, icone = ?,
        descricao = ?, valor_presente_brl = ?,
        horizonte_anos = ?, ano_alvo = ?, prioridade = ?, modalidade = ?,
        flexibilidade_prazo = ?, flexibilidade_valor = ?, perfil_risco_sugerido = ?,
        completude_score = ?, completude_detalhes = ?, trade_offs = ?,
        observacoes_cliente = ?, sinais_atencao = ?, proximo_passo_planejador = ?,
        updated_at = ?
      WHERE id = ?`,
      [
        user_id,
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
      ],
    );
    return rowToObjective(
      (await get<Record<string, unknown>>(
        'SELECT * FROM objectives WHERE id = ?',
        [existing.id],
      ))!,
    );
  }

  const id = uid();
  const now = nowIso();
  await run(
    `INSERT INTO objectives (
      id, session_id, user_id, categoria, classe_objetivo, horizonte_classe, icone,
      titulo_curto, descricao,
      valor_presente_brl, horizonte_anos, ano_alvo, prioridade, modalidade,
      flexibilidade_prazo, flexibilidade_valor, perfil_risco_sugerido,
      completude_score, completude_detalhes, trade_offs, observacoes_cliente,
      sinais_atencao, proximo_passo_planejador, created_at, updated_at
    ) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`,
    [
      id,
      session_id,
      user_id,
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
    ],
  );
  return rowToObjective(
    (await get<Record<string, unknown>>(
      'SELECT * FROM objectives WHERE id = ?',
      [id],
    ))!,
  );
}

// ----------------------------------------------------------------
// Education topics
// ----------------------------------------------------------------
export async function insertEducationTopic(
  session_id: string,
  topico: string,
  resumo: string | null,
): Promise<EducationTopic> {
  const id = uid();
  const created_at = nowIso();
  await run(
    'INSERT INTO education_topics (id, session_id, topico, resumo, created_at) VALUES (?, ?, ?, ?, ?)',
    [id, session_id, topico, resumo, created_at],
  );
  return { id, session_id, topico, resumo, created_at };
}

export async function getEducationTopics(
  session_id: string,
): Promise<EducationTopic[]> {
  return all<EducationTopic>(
    'SELECT id, session_id, topico, resumo, created_at FROM education_topics WHERE session_id = ? ORDER BY created_at ASC, rowid ASC',
    [session_id],
  );
}

// ----------------------------------------------------------------
// Out-of-scope notes
// ----------------------------------------------------------------
export async function insertOutOfScopeNote(
  session_id: string,
  nota: string,
): Promise<void> {
  await run(
    'INSERT INTO out_of_scope_notes (id, session_id, nota, created_at) VALUES (?, ?, ?, ?)',
    [uid(), session_id, nota, nowIso()],
  );
}

export async function getOutOfScopeNotes(
  session_id: string,
): Promise<string[]> {
  const rows = await all<{ nota: string }>(
    'SELECT nota FROM out_of_scope_notes WHERE session_id = ? ORDER BY created_at ASC, rowid ASC',
    [session_id],
  );
  return rows.map((r) => r.nota);
}

// ----------------------------------------------------------------
// Cross-sell — oportunidades comerciais (lente de gerente de conta)
// Deduplicado por (session_id, produto): registrar o mesmo produto de
// novo apenas atualiza a oportunidade, não cria duplicata.
// ----------------------------------------------------------------
export async function upsertCrossSell(
  session_id: string,
  input: CrossSellInput,
): Promise<CrossSellOpportunity> {
  const existing = await get<{ id: string; created_at: string }>(
    'SELECT id, created_at FROM cross_sell_opportunities WHERE session_id = ? AND produto = ?',
    [session_id, input.produto],
  );

  if (existing) {
    await run(
      'UPDATE cross_sell_opportunities SET gatilho = ?, racional = ?, prioridade = ? WHERE id = ?',
      [input.gatilho, input.racional, input.prioridade, existing.id],
    );
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
  await run(
    'INSERT INTO cross_sell_opportunities (id, session_id, produto, gatilho, racional, prioridade, created_at) VALUES (?, ?, ?, ?, ?, ?, ?)',
    [
      id,
      session_id,
      input.produto,
      input.gatilho,
      input.racional,
      input.prioridade,
      created_at,
    ],
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

export async function getCrossSells(
  session_id: string,
): Promise<CrossSellOpportunity[]> {
  return all<CrossSellOpportunity>(
    'SELECT id, session_id, produto, gatilho, racional, prioridade, created_at FROM cross_sell_opportunities WHERE session_id = ? ORDER BY created_at ASC, rowid ASC',
    [session_id],
  );
}

// ----------------------------------------------------------------
// Perfil 360° do cliente (anamnese) — um por sessão.
// O suitability (perfil de investidor) é derivado pelo servidor.
// ----------------------------------------------------------------
export async function upsertClientProfile(
  session_id: string,
  input: ClientProfileInput,
): Promise<ClientProfile> {
  const suitability = calcularSuitability({
    experiencia_investimentos: input.experiencia_investimentos,
    tolerancia_risco: input.tolerancia_risco,
    idade: input.idade,
  });
  const now = nowIso();
  const existing = await get<{ created_at: string }>(
    'SELECT created_at FROM client_profiles WHERE session_id = ?',
    [session_id],
  );

  await run(
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
    [
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
    ],
  );

  return (await getClientProfile(session_id)) as ClientProfile;
}

export async function getClientProfile(
  session_id: string,
): Promise<ClientProfile | null> {
  const row = await get<ClientProfile>(
    'SELECT * FROM client_profiles WHERE session_id = ?',
    [session_id],
  );
  return row ?? null;
}
