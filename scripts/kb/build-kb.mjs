#!/usr/bin/env node
// =================================================================
// Gera os artefatos de runtime do cérebro (server/kb/*.generated.ts)
// a partir de conhecimento/. Determinístico; os gerados são COMMITADOS.
//   node scripts/kb/build-kb.mjs          → escreve os arquivos
//   import { generate } from '...'        → usado pelo check-kb p/ diff
// =================================================================
import { readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';

export const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const KNOW = join(ROOT, 'conhecimento');

// ---- front-matter (subset restrito: chave: valor | "valor" | [a, "b c"]) ----
export function parseFrontMatter(raw, file) {
  const m = raw.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!m) return { meta: null, body: raw };
  const meta = {};
  for (const line of m[1].split('\n')) {
    if (!line.trim() || line.startsWith('#')) continue;
    const kv = line.match(/^([a-z_]+):\s*(.*)$/);
    if (!kv) throw new Error(`${file}: linha de front-matter inválida: "${line}"`);
    const [, key, valRaw] = kv;
    let val = valRaw.trim();
    if (val.startsWith('[')) {
      const inner = val.slice(1, -1).trim();
      val = inner
        ? (inner.match(/"[^"]*"|[^,]+/g) ?? []).map((s) => s.trim().replace(/^"|"$/g, '')).filter(Boolean)
        : [];
    } else {
      val = val.replace(/^"|"$/g, '');
      if (/^\d+$/.test(val)) val = Number(val);
    }
    meta[key] = val;
  }
  return { meta, body: raw.slice(m[0].length) };
}

function* mdFiles(dir) {
  for (const name of readdirSync(dir).sort()) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) {
      if (name === 'inbox' || name === 'fonte') continue;
      yield* mdFiles(p);
    } else if (name.endsWith('.md')) {
      yield p;
    }
  }
}

const SEM_FRONT_MATTER = new Set(['AGENTS.md', 'INDEX.md', 'fontes.md', 'README.md']);

export function slug(s) {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 60);
}

export function loadCerebro() {
  const arquivos = [];
  for (const p of mdFiles(KNOW)) {
    const rel = relative(KNOW, p);
    const base = rel.split('/').pop();
    if (SEM_FRONT_MATTER.has(base)) continue;
    const { meta, body } = parseFrontMatter(readFileSync(p, 'utf-8'), rel);
    if (!meta) throw new Error(`${rel}: falta front-matter (ou catalogue em SEM_FRONT_MATTER)`);
    arquivos.push({ rel, meta, body });
  }
  return arquivos;
}

export function generate() {
  const arquivos = loadCerebro();

  // ---- persona → SYSTEM_PROMPT (blocos por `ordem`) ----
  const persona = arquivos
    .filter((a) => a.meta.modulo === 'persona')
    .sort((a, b) => (a.meta.ordem ?? 99) - (b.meta.ordem ?? 99));
  if (persona.length === 0) throw new Error('nenhum arquivo de persona');
  const systemPrompt = persona.map((a) => a.body.trim()).join('\n\n');

  // ---- currículo → chunks de busca (ementas ficam de fora: são mapa) ----
  const chunks = [];
  for (const a of arquivos) {
    if (a.meta.modulo !== 'curriculo') continue;
    if (String(a.meta.id).startsWith('ementa-')) continue;
    const partes = a.body.split(/^### /m);
    const secoes = partes.length > 1
      ? partes.slice(1).map((s) => {
          const nl = s.indexOf('\n');
          return { titulo: s.slice(0, nl).trim(), texto: s.slice(nl + 1).trim() };
        })
      : [{ titulo: a.meta.topico, texto: a.body.trim() }];
    for (const sec of secoes) {
      chunks.push({
        id: `${a.meta.id}#${slug(sec.titulo)}`,
        titulo: sec.titulo,
        texto: sec.texto,
        tags: a.meta.tags ?? [],
        fase: a.meta.fase_bia,
        fonte: a.meta.fonte,
        flags: a.meta.flags ?? [],
        arquivo: `conhecimento/${a.rel}`,
      });
    }
  }
  const ids = new Set();
  for (const c of chunks) {
    if (ids.has(c.id)) throw new Error(`chunk id duplicado: ${c.id}`);
    ids.add(c.id);
  }

  // ---- matriz ----
  const matrizRaw = JSON.parse(readFileSync(join(KNOW, 'matriz-produtos', 'matriz.json'), 'utf-8'));
  const matriz = {
    meta: {
      fonte: matrizRaw.meta.fonte,
      registro_fonte: matrizRaw.meta.registro_fonte,
      aviso: matrizRaw.meta.aviso,
      fundamentos: matrizRaw.meta.fundamentos,
      tax_label: matrizRaw.meta.tax_label,
      ptype_label: matrizRaw.meta.ptype_label,
    },
    produtos: matrizRaw.produtos,
  };

  const AVISO = '// GERADO por scripts/kb/build-kb.mjs a partir de conhecimento/ — NÃO EDITAR À MÃO.\n// Edite o conhecimento e rode: npm run kb:build\n';
  const files = new Map();
  files.set(
    'server/kb/persona.generated.ts',
    `${AVISO}\nexport const SYSTEM_PROMPT: string = ${JSON.stringify(systemPrompt)};\n`,
  );
  files.set(
    'server/kb/kb.generated.ts',
    `${AVISO}import type { KbChunk } from '../lib/kb-types.js';\n\nexport const KB_CHUNKS: KbChunk[] = ${JSON.stringify(chunks, null, 1)};\n`,
  );
  files.set(
    'server/kb/matriz.generated.ts',
    `${AVISO}import type { MatrizData } from '../lib/kb-types.js';\n\nexport const MATRIZ: MatrizData = ${JSON.stringify(matriz, null, 1)};\n`,
  );
  return { files, chunks, persona, matriz };
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1];
if (isMain) {
  const { files, chunks, matriz } = generate();
  for (const [rel, content] of files) writeFileSync(join(ROOT, rel), content);
  console.log(
    `ok: ${chunks.length} chunks (${chunks.filter((c) => c.fase === 'cliente').length} fase=cliente), ` +
      `${matriz.produtos.length} produtos, prompt de ${[...files.get('server/kb/persona.generated.ts')].length} bytes`,
  );
}
