// =================================================================
// Camada de banco — libSQL (@libsql/client)
//
// O mesmo cliente atende os dois ambientes:
//   • dev local  → url "file:data/bia.db"  (SQLite em disco, offline)
//   • produção   → url "libsql://...turso.io" + token (Turso)
//
// A troca é só de env var: nenhuma query muda, porque o Turso fala o
// dialeto do SQLite. O preço é que tudo virou assíncrono — não existe
// driver síncrono que fale com um banco remoto.
// =================================================================

import type { Client, InValue } from '@libsql/client';
import { mkdirSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { SCHEMA_SQL } from './schema.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', 'data');
const DB_PATH = join(DATA_DIR, 'bia.db');

/** true quando estamos em SQLite de arquivo (dev), não no Turso remoto. */
function isFileUrl(url: string): boolean {
  return url.startsWith('file:');
}

function resolveUrl(): string {
  const configured = process.env.TURSO_DATABASE_URL?.trim();
  if (configured) return configured;
  // Sem env var → arquivo local. Mantém o "roda offline out-of-the-box".
  return `file:${DB_PATH}`;
}

let _client: Client | null = null;
// Memoiza a inicialização por instância do processo. Em serverless isso
// significa uma vez por cold start, não uma vez por request.
let _ready: Promise<Client> | null = null;

export function getDb(): Promise<Client> {
  if (_ready) return _ready;
  _ready = init();
  return _ready;
}

async function init(): Promise<Client> {
  const url = resolveUrl();
  const onDisk = isFileUrl(url);

  // Em serverless o disco é efêmero e read-only: o mkdir abaixo estouraria
  // com um EROFS ilegível. Falha cedo dizendo o que fazer.
  if (onDisk && process.env.VERCEL) {
    throw new Error(
      'TURSO_DATABASE_URL não está definida neste ambiente. Em serverless ' +
        'não há disco gravável, então o SQLite em arquivo não serve. ' +
        'Defina TURSO_DATABASE_URL e TURSO_AUTH_TOKEN no painel da Vercel ' +
        '(marcando Production, Preview e Development) e refaça o deploy.',
    );
  }

  if (onDisk) {
    mkdirSync(DATA_DIR, { recursive: true });
  }

  // Entrypoint escolhido pela URL: o build "web" fala só HTTP (fetch) e
  // não arrasta o binding nativo do SQLite — o que importa no bundle
  // serverless. O build node é necessário para abrir um arquivo local.
  const { createClient } = onDisk
    ? await import('@libsql/client')
    : await import('@libsql/client/web');

  const client = createClient({
    url,
    authToken: process.env.TURSO_AUTH_TOKEN?.trim() || undefined,
  });

  // PRAGMAs de conexão só fazem sentido no arquivo local. No Turso remoto
  // o journal mode é gerido pelo serviço e o statement é rejeitado.
  if (onDisk) {
    await client.execute('PRAGMA journal_mode = WAL');
    await client.execute('PRAGMA foreign_keys = ON');
  }

  // O schema abre com um PRAGMA; retira antes de mandar o script, pelo
  // mesmo motivo acima.
  const schema = SCHEMA_SQL.replace(/^\s*PRAGMA[^;]*;/gim, '');
  await client.executeMultiple(schema);
  await runMigrations(client);

  _client = client;
  return client;
}

// Migrações idempotentes para bancos criados antes de uma mudança de
// schema. O schema.ts cobre bancos novos; isto atualiza os já existentes.
async function runMigrations(db: Client): Promise<void> {
  // 1) sessions.user_id
  const sessionCols = (await db.execute('PRAGMA table_info(sessions)'))
    .rows as unknown as { name: string }[];
  if (!sessionCols.some((c) => c.name === 'user_id')) {
    await db.execute('ALTER TABLE sessions ADD COLUMN user_id INTEGER');
  }
  await db.execute(
    'CREATE INDEX IF NOT EXISTS idx_sessions_user ON sessions(user_id)',
  );

  // 2) objectives.user_id — link direto cliente↔objetivo
  const objCols = (await db.execute('PRAGMA table_info(objectives)'))
    .rows as unknown as { name: string }[];
  if (!objCols.some((c) => c.name === 'user_id')) {
    await db.execute('ALTER TABLE objectives ADD COLUMN user_id INTEGER');
    // Back-fill: deriva user_id da sessão de cada objetivo já existente.
    await db.execute(
      `UPDATE objectives
       SET user_id = (SELECT user_id FROM sessions WHERE sessions.id = objectives.session_id)
       WHERE user_id IS NULL`,
    );
  }
  await db.execute(
    'CREATE INDEX IF NOT EXISTS idx_objectives_user ON objectives(user_id)',
  );

  // 3) VIEW clientes — alias semântico para `users`. Permite queries
  //    como SELECT * FROM clientes sem renomear a tabela.
  await db.execute(
    'CREATE VIEW IF NOT EXISTS clientes AS SELECT id, nome, created_at FROM users',
  );
}

export function closeDb(): void {
  if (_client) {
    _client.close();
    _client = null;
    _ready = null;
  }
}

// ----------------------------------------------------------------
// Helpers no formato que o store.ts usava com node:sqlite
// (.run / .get / .all), para a conversão ficar linha-a-linha.
// ----------------------------------------------------------------

/** INSERT/UPDATE/DELETE. Devolve o lastInsertRowid como number. */
export async function run(
  sql: string,
  args: InValue[] = [],
): Promise<{ lastInsertRowid: number; rowsAffected: number }> {
  const db = await getDb();
  const rs = await db.execute({ sql, args });
  return {
    lastInsertRowid: rs.lastInsertRowid ? Number(rs.lastInsertRowid) : 0,
    rowsAffected: rs.rowsAffected,
  };
}

/** SELECT de uma linha só. */
export async function get<T>(
  sql: string,
  args: InValue[] = [],
): Promise<T | undefined> {
  const db = await getDb();
  const rs = await db.execute({ sql, args });
  return rs.rows[0] as T | undefined;
}

/** SELECT de várias linhas. */
export async function all<T>(
  sql: string,
  args: InValue[] = [],
): Promise<T[]> {
  const db = await getDb();
  const rs = await db.execute({ sql, args });
  return rs.rows as unknown as T[];
}

export function uid(): string {
  return crypto.randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}
