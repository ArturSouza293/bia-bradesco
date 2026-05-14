// Apaga o banco SQLite local. Ele é recriado (vazio) no próximo start.
// Uso: npm run db:reset

import { rmSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const DATA_DIR = join(__dirname, '..', '..', 'data');

let removed = 0;
for (const f of ['bia.db', 'bia.db-wal', 'bia.db-shm', 'bia.db-journal']) {
  const p = join(DATA_DIR, f);
  if (existsSync(p)) {
    rmSync(p);
    console.log('removido:', f);
    removed++;
  }
}
console.log(
  removed > 0
    ? 'Banco resetado — será recriado vazio no próximo "npm start".'
    : 'Nada para remover (banco já estava limpo).',
);
