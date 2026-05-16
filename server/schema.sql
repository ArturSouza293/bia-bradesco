-- ===============================================================
-- Bia · Bradesco — schema SQLite (app local offline)
-- Aplicado automaticamente pelo servidor no startup (idempotente).
-- ===============================================================

PRAGMA foreign_keys = ON;

-- Usuários da demo — identificados pelo nome, com id sequencial que
-- desambigua homônimos e serve de etiqueta pública (ex.: "Maria #7").
-- A memória (perfil, objetivos) é recuperável por usuário entre sessões.
CREATE TABLE IF NOT EXISTS users (
  id         INTEGER PRIMARY KEY AUTOINCREMENT,
  nome       TEXT NOT NULL,
  nome_lower TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_users_nome_lower ON users(nome_lower);

-- Sessões de conversa. user_id liga a sessão ao usuário (preenchido
-- quando a Bia coleta o nome); fica NULL até a identificação.
CREATE TABLE IF NOT EXISTS sessions (
  id               TEXT PRIMARY KEY,
  user_id          INTEGER REFERENCES users(id) ON DELETE SET NULL,
  started_at       TEXT NOT NULL DEFAULT (datetime('now')),
  ended_at         TEXT,
  status           TEXT NOT NULL DEFAULT 'active'
                     CHECK (status IN ('active', 'completed', 'abandoned')),
  duration_minutes INTEGER,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
);
-- O índice em sessions(user_id) é criado em runMigrations (db.ts), depois
-- que o ALTER garante a coluna em bancos pré-existentes.

-- Perfil 360° do cliente — anamnese rápida feita pela Bia ANTES dos objetivos.
-- Em produção, viria do Open Finance + dados cadastrais; aqui a Bia coleta
-- numa conversa curta. Um perfil por sessão.
CREATE TABLE IF NOT EXISTS client_profiles (
  session_id                TEXT PRIMARY KEY REFERENCES sessions(id) ON DELETE CASCADE,
  idade                     INTEGER,
  estado_civil              TEXT CHECK (estado_civil IN
                              ('solteiro', 'casado', 'uniao_estavel', 'divorciado', 'viuvo')),
  dependentes               INTEGER,
  profissao                 TEXT,
  renda_mensal_faixa        TEXT CHECK (renda_mensal_faixa IN
                              ('ate_3k', 'de_3k_a_6k', 'de_6k_a_10k', 'de_10k_a_20k', 'acima_20k')),
  experiencia_investimentos TEXT CHECK (experiencia_investimentos IN
                              ('nenhuma', 'iniciante', 'intermediaria', 'experiente')),
  tolerancia_risco          TEXT CHECK (tolerancia_risco IN ('baixa', 'media', 'alta')),
  perfil_suitability        TEXT CHECK (perfil_suitability IN
                              ('conservador', 'moderado', 'arrojado')),
  observacoes               TEXT,
  created_at                TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at                TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Histórico de mensagens (auditoria do fluxo do agente)
CREATE TABLE IF NOT EXISTS messages (
  id         TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  role       TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content    TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_messages_session ON messages(session_id, created_at);

-- Objetivos de vida estruturados (saída principal do agente).
-- Junto com `users` (clientes), são as duas tabelas centrais da demo.
-- user_id é propagado pelo backend quando a sessão tem usuário ligado;
-- permite acompanhar todos os objetivos de um cliente entre sessões.
CREATE TABLE IF NOT EXISTS objectives (
  id                       TEXT PRIMARY KEY,
  session_id               TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  user_id                  INTEGER REFERENCES users(id) ON DELETE SET NULL,
  categoria                TEXT NOT NULL,
  icone                    TEXT,
  titulo_curto             TEXT NOT NULL,
  descricao                TEXT,
  valor_presente_brl       REAL,
  horizonte_anos           INTEGER,
  ano_alvo                 INTEGER,
  prioridade               TEXT CHECK (prioridade IN ('alta', 'media', 'baixa')),
  classe_objetivo          TEXT CHECK (classe_objetivo IN ('necessidade', 'desejo')),
  horizonte_classe         TEXT CHECK (horizonte_classe IN ('curto', 'medio', 'longo')),
  modalidade               TEXT,
  flexibilidade_prazo      TEXT CHECK (flexibilidade_prazo IN ('rigido', 'flexivel')),
  flexibilidade_valor      TEXT CHECK (flexibilidade_valor IN ('rigido', 'flexivel')),
  perfil_risco_sugerido    TEXT CHECK (perfil_risco_sugerido IN
                             ('conservador', 'moderado', 'moderado_arrojado', 'arrojado')),
  completude_score         INTEGER CHECK (completude_score BETWEEN 0 AND 100),
  completude_detalhes      TEXT,   -- JSON serializado
  trade_offs               TEXT,
  observacoes_cliente      TEXT,
  sinais_atencao           TEXT,   -- JSON serializado (array)
  proximo_passo_planejador TEXT,
  created_at               TEXT NOT NULL DEFAULT (datetime('now')),
  updated_at               TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_objectives_session ON objectives(session_id);

-- Conceitos de educação financeira que a Bia explicou na jornada
CREATE TABLE IF NOT EXISTS education_topics (
  id         TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  topico     TEXT NOT NULL,
  resumo     TEXT,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_education_session ON education_topics(session_id);

-- Pontos fora de escopo capturados para a jornada de planejamento financeiro
CREATE TABLE IF NOT EXISTS out_of_scope_notes (
  id         TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  nota       TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);

-- Oportunidades comerciais (cross-sell) que a Bia detectou com sua
-- "lente de gerente de conta". NÃO são oferecidas ao cliente na conversa —
-- ficam para revisão comercial ao final do atendimento.
CREATE TABLE IF NOT EXISTS cross_sell_opportunities (
  id         TEXT PRIMARY KEY,
  session_id TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  produto    TEXT NOT NULL,
  gatilho    TEXT,
  racional   TEXT,
  prioridade TEXT CHECK (prioridade IN ('alta', 'media', 'baixa')),
  created_at TEXT NOT NULL DEFAULT (datetime('now'))
);
CREATE INDEX IF NOT EXISTS idx_crosssell_session ON cross_sell_opportunities(session_id);
