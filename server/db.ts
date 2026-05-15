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
  const sessionCols = db
    .prepare('PRAGMA table_info(sessions)')
    .all() as { name: string }[];
  if (!sessionCols.some((c) => c.name === 'user_id')) {
    db.exec('ALTER TABLE sessions ADD COLUMN user_id INTEGER');
  }
  // Índice depende de user_id existir; rodamos aqui (idempotente) pra
  // funcionar tanto em bancos novos quanto em recém-migrados.
  db.exec(
    'CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)',
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
