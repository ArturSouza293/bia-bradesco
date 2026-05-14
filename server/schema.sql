-- ===============================================================
-- Bia · Bradesco — schema SQLite (app local offline)
-- Aplicado automaticamente pelo servidor no startup (idempotente).
-- ===============================================================

PRAGMA foreign_keys = ON;

-- Sessões de conversa
CREATE TABLE IF NOT EXISTS sessions (
  id               TEXT PRIMARY KEY,
  started_at       TEXT NOT NULL DEFAULT (datetime('now')),
  ended_at         TEXT,
  status           TEXT NOT NULL DEFAULT 'active'
                     CHECK (status IN ('active', 'completed', 'abandoned')),
  duration_minutes INTEGER,
  created_at       TEXT NOT NULL DEFAULT (datetime('now'))
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

-- Objetivos de vida estruturados (saída principal do agente)
CREATE TABLE IF NOT EXISTS objectives (
  id                       TEXT PRIMARY KEY,
  session_id               TEXT NOT NULL REFERENCES sessions(id) ON DELETE CASCADE,
  categoria                TEXT NOT NULL,
  icone                    TEXT,
  titulo_curto             TEXT NOT NULL,
  descricao                TEXT,
  valor_presente_brl       REAL,
  horizonte_anos           INTEGER,
  ano_alvo                 INTEGER,
  prioridade               TEXT CHECK (prioridade IN ('alta', 'media', 'baixa')),
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
