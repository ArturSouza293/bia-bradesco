// Placeholder de client Supabase para o front.
// v1 deste piloto NÃO usa Supabase direto no navegador — todas as leituras
// e escritas passam pelas Edge Functions, que usam SUPABASE_SERVICE_ROLE_KEY
// e bypassam RLS. Mantemos este arquivo para v2 (quando Supabase Auth for adicionado
// e RLS policies por user_id estiverem ativas).

import { createClient, type SupabaseClient } from '@supabase/supabase-js';

let _client: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (_client) return _client;

  const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
  const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

  if (!url || !anonKey) return null;

  _client = createClient(url, anonKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return _client;
}
