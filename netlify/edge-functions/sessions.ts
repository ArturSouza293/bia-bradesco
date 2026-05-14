// =================================================================
// /api/sessions — criar e atualizar sessões
// =================================================================
// POST  /api/sessions          → cria nova sessão
// PATCH /api/sessions/:id      → atualiza status (ex.: 'completed')
// =================================================================

import {
  adminSupabase,
  checkSessionsPerIpLimit,
  errorResponse,
  getClientIp,
  handlePreflight,
  jsonResponse,
  type NetlifyContext,
} from './lib/shared.ts';

export default async function handler(req: Request, context: NetlifyContext) {
  const pf = handlePreflight(req);
  if (pf) return pf;

  const url = new URL(req.url);
  const parts = url.pathname.replace(/^\/+|\/+$/g, '').split('/');
  // Esperado: ["api", "sessions"] ou ["api", "sessions", ":id"]
  const id = parts[2];

  if (req.method === 'POST' && !id) return createSession(req, context);
  if (req.method === 'PATCH' && id) return updateSession(req, id);
  if (req.method === 'GET' && id) return getSession(id);

  return errorResponse('Rota não suportada', 405);
}

const OPENING_MESSAGES = [
  { delay_ms: 0, text: 'Oi! 👋 Aqui é a **Bia**, do Bradesco.' },
  {
    delay_ms: 1500,
    text: `Percebi que você tem interesse em **cadastrar seus objetivos de vida** com a gente. Posso te ajudar a criá-los aqui mesmo, numa conversa rápida (uns 10–15 minutinhos). 🎯

No final, monto um resumo bonitinho com tudo organizado pra você levar para a próxima etapa do planejamento.

**Bora começar?**`,
  },
];

async function createSession(req: Request, context: NetlifyContext) {
  const clientIp = getClientIp(req, context);
  const lim = await checkSessionsPerIpLimit(clientIp);
  if (!lim.ok) {
    return errorResponse(
      `Limite de ${lim.count} sessões por IP nas últimas 24h atingido.`,
      429,
    );
  }

  const sb = adminSupabase();
  const { data, error } = await sb
    .from('sessions')
    .insert({ client_ip: clientIp, status: 'active' })
    .select('id, started_at, status')
    .single();
  if (error)
    return errorResponse('Não foi possível criar sessão: ' + error.message, 500);

  // Semeia as mensagens de abertura (para auditoria + contexto do LLM)
  await sb.from('messages').insert(
    OPENING_MESSAGES.map((m) => ({
      session_id: data.id,
      role: 'assistant',
      content: m.text,
    })),
  );

  return jsonResponse(
    { ...data, opening_messages: OPENING_MESSAGES },
    201,
  );
}

async function updateSession(req: Request, id: string) {
  let body: { status?: string };
  try {
    body = await req.json();
  } catch {
    return errorResponse('Body inválido', 400);
  }

  const allowed = ['active', 'completed', 'abandoned'] as const;
  if (!body.status || !allowed.includes(body.status as (typeof allowed)[number])) {
    return errorResponse(
      `status deve ser um de: ${allowed.join(', ')}`,
      400,
    );
  }

  const sb = adminSupabase();
  const patch: Record<string, unknown> = { status: body.status };
  if (body.status === 'completed' || body.status === 'abandoned') {
    patch.ended_at = new Date().toISOString();
  }

  const { data, error } = await sb
    .from('sessions')
    .update(patch)
    .eq('id', id)
    .select('id, status, started_at, ended_at')
    .single();
  if (error) return errorResponse('Erro ao atualizar sessão: ' + error.message, 500);
  if (!data) return errorResponse('Sessão não encontrada', 404);

  // Calcula duration_minutes
  if (data.ended_at && data.started_at) {
    const minutes = Math.round(
      (new Date(data.ended_at).getTime() - new Date(data.started_at).getTime()) /
        60000,
    );
    await sb
      .from('sessions')
      .update({ duration_minutes: minutes })
      .eq('id', id);
    return jsonResponse({ ...data, duration_minutes: minutes });
  }

  return jsonResponse(data);
}

async function getSession(id: string) {
  const sb = adminSupabase();
  const { data, error } = await sb
    .from('sessions')
    .select('id, status, started_at, ended_at, duration_minutes')
    .eq('id', id)
    .maybeSingle();
  if (error) return errorResponse('Erro: ' + error.message, 500);
  if (!data) return errorResponse('Sessão não encontrada', 404);
  return jsonResponse(data);
}

export const config = { path: ['/api/sessions', '/api/sessions/*'] };
