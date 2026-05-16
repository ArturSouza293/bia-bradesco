// =================================================================
// Camada de banco — SQLite embutido (node:sqlite, Node 22.5+)
// Zero dependências nativas: roda offline sem build tools.
// =================================================================

import { DatabaseSync } from 'node:sqlite';
import { readFileSync, mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const DB_PATH = join(DATA_DIR, 'bia.db');
const SCHEMA_PATH = join(__dirname, 'schema.sql');

let _db: DatabaseSync | null = null;

export function getDb(): DatabaseSync {
  if (_db) return _db;
  mkdirSync(DATA_DIR, { recursive: true });
  const db = new DatabaseSync(DB_PATH);
  db.exec('PRAGMA journal_mode = WAL;');
  db.exec('PRAGMA foreign_keys = ON;');
  db.exec(readFileSync(SCHEMA_PATH, 'utf-8'));
  runMigrations(db);
  _db = db;
  return db;
}

// Migrações idempotentes para bancos criados antes de uma mudança de
// schema. O schema.sql cobre bancos novos; isto atualiza os já existentes.
function runMigrations(db: DatabaseSync): void {
  // 1) sessions.user_id
  const sessionCols = db
    .prepare('PRAGMA table_info(sessions)')
    .all() as { name: string }[];
  if (!sessionCols.some((c) => c.name === 'user_id')) {
    db.exec('ALTER TABLE sessions ADD COLUMN user_id INTEGER');
  }
  db.exec(
    'CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)',
  );

  // 2) objectives.user_id — link direto cliente↔objetivo
  const objCols = db
    .prepare('PRAGMA table_info(objectives)')
    .all() as { name: string }[];
  if (!objCols.some((c) => c.name === 'user_id')) {
    db.exec('ALTER TABLE objectives ADD COLUMN user_id INTEGER');
    // Back-fill: deriva user_id da sessão de cada objetivo já existente.
    db.exec(
      `UPDATE objectives
       SET user_id = (SELECT user_id FROM sessions WHERE sessions.id = objectives.session_id)
       WHERE user_id IS NULL`,
    );
  }
  db.exec(
    'CREATE INDEX IF NOT EXISTS idx_objectives_user ON objectives(user_id)',
  );

  // 3) VIEW clientes — alias semântico para `users`. Permite queries
  //    como SELECT * FROM clientes sem renomear a tabela.
  db.exec(
    'CREATE VIEW IF NOT EXISTS clientes AS SELECT id, nome, created_at FROM users',
  );
}

export function closeDb(): void {
  if (_db) {
    _db.close();
    _db = null;
  }
}

export function uid(): string {
  return crypto.randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}
