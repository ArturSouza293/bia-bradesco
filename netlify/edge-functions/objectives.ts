// =================================================================
// /api/objectives — lista objetivos da sessão
// =================================================================
// GET /api/objectives?session_id=X
// =================================================================

import {
  adminSupabase,
  errorResponse,
  handlePreflight,
  jsonResponse,
} from './_shared.ts';

export default async function handler(req: Request) {
  const pf = handlePreflight(req);
  if (pf) return pf;
  if (req.method !== 'GET') return errorResponse('Método não permitido', 405);

  const url = new URL(req.url);
  const session_id = url.searchParams.get('session_id');
  if (!session_id) return errorResponse('session_id é obrigatório', 400);

  const sb = adminSupabase();
  const { data, error } = await sb
    .from('objectives')
    .select('*')
    .eq('session_id', session_id)
    .order('created_at', { ascending: true });
  if (error) return errorResponse('Erro: ' + error.message, 500);

  return jsonResponse({ objectives: data ?? [] });
}

export const config = { path: '/api/objectives' };
