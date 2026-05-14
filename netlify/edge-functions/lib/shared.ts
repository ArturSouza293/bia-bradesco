// =================================================================
// Helpers compartilhados entre as Edge Functions
// =================================================================
// Deno runtime — usar imports via npm:specifier ou https://esm.sh
// =================================================================

import {
  createClient,
  type SupabaseClient,
} from 'https://esm.sh/@supabase/supabase-js@2.45.4';

// -----------------------------------------------------------------
// Netlify Edge Function context (subset que de fato usamos).
// Mantemos local em vez de importar @netlify/edge-functions
// para evitar variações de URL entre versões do runtime.
// -----------------------------------------------------------------
export interface NetlifyContext {
  ip?: string;
  geo?: {
    country?: { name?: string; code?: string };
    city?: string;
  };
  [k: string]: unknown;
}

// -----------------------------------------------------------------
// Tipos (espelham src/types/objective.ts — duplicados intencionalmente
// para manter as Edge Functions self-contained sob runtime Deno)
// -----------------------------------------------------------------
export type Categoria =
  | 'casa_propria'
  | 'aposentadoria'
  | 'educacao_filhos'
  | 'educacao_propria'
  | 'reserva_emergencia'
  | 'viagem'
  | 'veiculo'
  | 'negocio'
  | 'casamento'
  | 'sucessao'
  | 'outro';

export type Prioridade = 'alta' | 'media' | 'baixa';
export type Flexibilidade = 'rigido' | 'flexivel';
export type PerfilRisco =
  | 'conservador'
  | 'moderado'
  | 'moderado_arrojado'
  | 'arrojado';

export interface ObjectiveInput {
  categoria: Categoria;
  icone?: string;
  titulo_curto: string;
  descricao: string;
  valor_presente_brl: number;
  horizonte_anos: number;
  ano_alvo?: number;
  prioridade: Prioridade;
  modalidade?: string;
  flexibilidade_prazo?: Flexibilidade;
  flexibilidade_valor?: Flexibilidade;
  trade_offs?: string;
  observacoes_cliente?: string;
  sinais_atencao?: string[];
  proximo_passo_planejador?: string;
}

// -----------------------------------------------------------------
// Lógica de negócio — espelhada de src/lib/{risk-profile,smart-score}.ts
// -----------------------------------------------------------------
export function calcularPerfilRisco(input: {
  categoria: Categoria;
  horizonte_anos: number;
  flexibilidade_prazo?: Flexibilidade;
  flexibilidade_valor?: Flexibilidade;
}): PerfilRisco {
  if (input.categoria === 'reserva_emergencia') return 'conservador';

  const h = input.horizonte_anos;
  const rigido =
    input.flexibilidade_prazo === 'rigido' ||
    input.flexibilidade_valor === 'rigido';

  if (h < 2) return 'conservador';
  if (h < 5) return rigido ? 'conservador' : 'moderado';
  if (h < 10) return rigido ? 'moderado' : 'moderado_arrojado';
  return 'arrojado';
}

export function calcularSmartScore(input: ObjectiveInput) {
  const especifico = Boolean(
    input.descricao && input.descricao.trim().length >= 12,
  );
  const mensuravel =
    Number.isFinite(input.valor_presente_brl) && input.valor_presente_brl > 0;
  const alcancavel =
    mensuravel &&
    Number.isFinite(input.horizonte_anos) &&
    input.horizonte_anos > 0;
  const relevante = Boolean(
    (input.observacoes_cliente && input.observacoes_cliente.trim().length > 0) ||
      (input.trade_offs && input.trade_offs.trim().length > 0) ||
      (input.proximo_passo_planejador &&
        input.proximo_passo_planejador.trim().length > 0),
  );
  const temporal =
    Number.isFinite(input.horizonte_anos) && input.horizonte_anos > 0;

  const detalhes = { especifico, mensuravel, alcancavel, relevante, temporal };
  const score =
    (especifico ? 20 : 0) +
    (mensuravel ? 20 : 0) +
    (alcancavel ? 20 : 0) +
    (relevante ? 20 : 0) +
    (temporal ? 20 : 0);
  return { score, detalhes };
}

export const CATEGORIA_ICONE: Record<Categoria, string> = {
  casa_propria: '🏠',
  aposentadoria: '👴',
  educacao_filhos: '🎓',
  educacao_propria: '📚',
  reserva_emergencia: '🛡️',
  viagem: '✈️',
  veiculo: '🚗',
  negocio: '💼',
  casamento: '💍',
  sucessao: '👨‍👩‍👧',
  outro: '🎯',
};

// -----------------------------------------------------------------
// Supabase admin client (service role — bypassa RLS)
// -----------------------------------------------------------------
let _admin: SupabaseClient | null = null;

export function adminSupabase(): SupabaseClient {
  if (_admin) return _admin;
  const url = Deno.env.get('SUPABASE_URL') ?? Deno.env.get('VITE_SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!url || !key) {
    throw new Error(
      'Faltam SUPABASE_URL e/ou SUPABASE_SERVICE_ROLE_KEY no ambiente das Edge Functions',
    );
  }
  _admin = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _admin;
}

// -----------------------------------------------------------------
// Respostas e CORS
// -----------------------------------------------------------------
export const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PATCH, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
  });
}

export function errorResponse(message: string, status = 400): Response {
  return jsonResponse({ error: message }, status);
}

export function handlePreflight(req: Request): Response | null {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: CORS_HEADERS });
  }
  return null;
}

// -----------------------------------------------------------------
// Rate limiting
// -----------------------------------------------------------------
export const RATE_LIMITS = {
  messagesPerSession: 20,
  sessionsPerIpPerDay: 5,
} as const;

export async function checkMessageLimit(
  session_id: string,
): Promise<{ ok: boolean; count: number }> {
  const sb = adminSupabase();
  const { count, error } = await sb
    .from('messages')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', session_id)
    .eq('role', 'user');
  if (error) throw error;
  const c = count ?? 0;
  return { ok: c < RATE_LIMITS.messagesPerSession, count: c };
}

export async function checkSessionsPerIpLimit(
  client_ip: string,
): Promise<{ ok: boolean; count: number }> {
  const sb = adminSupabase();
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const { count, error } = await sb
    .from('sessions')
    .select('id', { count: 'exact', head: true })
    .eq('client_ip', client_ip)
    .gte('started_at', since);
  if (error) throw error;
  const c = count ?? 0;
  return { ok: c < RATE_LIMITS.sessionsPerIpPerDay, count: c };
}

export function getClientIp(req: Request, context?: NetlifyContext): string {
  if (context?.ip) return context.ip;
  const headers = req.headers;
  return (
    headers.get('x-nf-client-connection-ip') ??
    headers.get('cf-connecting-ip') ??
    headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    'unknown'
  );
}
