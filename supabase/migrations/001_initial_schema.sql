-- ===============================================================
-- Migration 001 — schema inicial do piloto Bia Bradesco
-- ===============================================================
-- Tabelas: sessions, messages, objectives, out_of_scope_notes
-- RLS: habilitada em todas (default-deny). Acesso só via Edge Functions
-- com SUPABASE_SERVICE_ROLE_KEY (bypass RLS).
-- ===============================================================

-- Extensions
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------
-- Sessões de conversa
-- ---------------------------------------------------------------
create table if not exists sessions (
  id uuid primary key default gen_random_uuid(),
  user_id uuid,                  -- nullable em v1 (sem login)
  client_ip text,                -- para rate limiting por IP
  started_at timestamptz default now(),
  ended_at timestamptz,
  status text check (status in ('active', 'completed', 'abandoned')) default 'active',
  duration_minutes int,
  created_at timestamptz default now()
);

create index if not exists idx_sessions_client_ip_started on sessions(client_ip, started_at);

-- ---------------------------------------------------------------
-- Mensagens (histórico para auditoria)
-- ---------------------------------------------------------------
create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  role text check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz default now()
);

create index if not exists idx_messages_session on messages(session_id, created_at);

-- ---------------------------------------------------------------
-- Objetivos (saída estruturada do piloto)
-- ---------------------------------------------------------------
create table if not exists objectives (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  categoria text not null,
  icone text,
  titulo_curto text not null,
  descricao text,
  valor_presente_brl numeric(15,2),
  horizonte_anos int,
  ano_alvo int,
  prioridade text check (prioridade in ('alta', 'media', 'baixa')),
  modalidade text,
  flexibilidade_prazo text check (flexibilidade_prazo in ('rigido', 'flexivel')),
  flexibilidade_valor text check (flexibilidade_valor in ('rigido', 'flexivel')),
  perfil_risco_sugerido text check (perfil_risco_sugerido in (
    'conservador', 'moderado', 'moderado_arrojado', 'arrojado'
  )),
  completude_score int check (completude_score between 0 and 100),
  completude_detalhes jsonb,
  trade_offs text,
  observacoes_cliente text,
  sinais_atencao jsonb,
  proximo_passo_planejador text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_objectives_session on objectives(session_id);

-- Trigger para manter updated_at
create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_objectives_updated_at on objectives;
create trigger trg_objectives_updated_at
before update on objectives
for each row execute function set_updated_at();

-- ---------------------------------------------------------------
-- Notas fora de escopo capturadas pela Bia
-- ---------------------------------------------------------------
create table if not exists out_of_scope_notes (
  id uuid primary key default gen_random_uuid(),
  session_id uuid references sessions(id) on delete cascade,
  nota text not null,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------
-- RLS — default deny. Service role (Edge Functions) bypassa RLS.
-- Quando v2 trouxer Supabase Auth, adicionar policies aqui.
-- ---------------------------------------------------------------
alter table sessions enable row level security;
alter table messages enable row level security;
alter table objectives enable row level security;
alter table out_of_scope_notes enable row level security;
