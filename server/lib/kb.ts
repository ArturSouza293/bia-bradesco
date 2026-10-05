// =================================================================
// Consulta ao cérebro da Bia — busca BM25 nos chunks de educação
// (fase 'cliente') e lookup determinístico na matriz de produtos.
// Sem vector DB: corpus pequeno, domínio fechado, o próprio modelo
// reformula a pergunta (RAG agentic).
// =================================================================

import { KB_CHUNKS } from '../kb/kb.generated.js';
import { MATRIZ } from '../kb/matriz.generated.js';
import type { KbChunk, MatrizEstrategia, MatrizProduto } from './kb-types.js';

// ---- tokenização PT-BR -----------------------------------------
const STOPWORDS = new Set([
  'que', 'para', 'com', 'uma', 'por', 'mais', 'dos', 'das', 'como', 'mas',
  'foi', 'ele', 'ela', 'seu', 'sua', 'ser', 'tem', 'nao', 'sim', 'aos',
  'nas', 'nos', 'entre', 'sem', 'sobre', 'quando', 'muito', 'pode', 'onde',
  'qual', 'quais', 'isso', 'esse', 'essa', 'este', 'esta', 'meu', 'minha',
  'voce', 'voces', 'depois', 'antes', 'ate', 'porque', 'todo', 'toda',
]);

function tokenize(s: string): string[] {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .split(/[^a-z0-9]+/)
    .filter((t) => t.length >= 3 && !STOPWORDS.has(t));
}

// ---- índice BM25 (lazy, só sobre chunks fase 'cliente') --------
interface Indexed {
  chunk: KbChunk;
  tf: Map<string, number>;
  len: number;
}

let index: Indexed[] | null = null;
let df: Map<string, number> | null = null;
let avgLen = 1;

function buildIndex(): void {
  index = KB_CHUNKS.filter((c) => c.fase === 'cliente').map((chunk) => {
    const tokens = tokenize(`${chunk.titulo} ${chunk.tags.join(' ')} ${chunk.texto}`);
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
    return { chunk, tf, len: tokens.length };
  });
  df = new Map();
  for (const doc of index) {
    for (const term of doc.tf.keys()) df.set(term, (df.get(term) ?? 0) + 1);
  }
  avgLen = index.reduce((s, d) => s + d.len, 0) / Math.max(1, index.length);
}

const K1 = 1.4;
const B = 0.75;

export interface TrechoConhecimento {
  id: string;
  titulo: string;
  trecho: string;
  fonte: string;
  flags: string[];
}

export function searchConhecimento(pergunta: string, topK = 4): TrechoConhecimento[] {
  if (!index || !df) buildIndex();
  const docs = index as Indexed[];
  const dfm = df as Map<string, number>;
  const n = docs.length;
  const q = [...new Set(tokenize(pergunta))];
  const scored = docs
    .map((doc) => {
      let score = 0;
      for (const term of q) {
        const f = doc.tf.get(term);
        if (!f) continue;
        const dfi = dfm.get(term) ?? 0;
        const idf = Math.log(1 + (n - dfi + 0.5) / (dfi + 0.5));
        score += (idf * f * (K1 + 1)) / (f + K1 * (1 - B + (B * doc.len) / avgLen));
      }
      return { doc, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, topK);
  return scored.map(({ doc }) => ({
    id: `kb:${doc.chunk.id}`,
    titulo: doc.chunk.titulo,
    trecho: doc.chunk.texto,
    fonte: doc.chunk.fonte,
    flags: doc.chunk.flags,
  }));
}

// ---- matriz de produtos (lookup determinístico, USO INTERNO) ---
export interface FiltroProduto {
  busca?: string;
  objetivo_3l?: string;
  regime?: string;
  segmento?: string;
}

function norm(s: string): string {
  return s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

export function consultarProduto(filtro: FiltroProduto): {
  aviso: string;
  total: number;
  produtos: MatrizProduto[];
  estrategias: MatrizEstrategia[];
} {
  let rows = MATRIZ.produtos;
  if (filtro.objetivo_3l) {
    const o = norm(filtro.objetivo_3l);
    rows = rows.filter((r) => norm(r.obj).includes(o));
  }
  if (filtro.regime) {
    const t = norm(filtro.regime);
    rows = rows.filter(
      (r) => norm(r.tax).includes(t) || norm(MATRIZ.meta.tax_label[r.tax] ?? '').includes(t),
    );
  }
  if (filtro.segmento) {
    const s = norm(filtro.segmento);
    rows = rows.filter((r) => r.seg.some((x) => norm(x).includes(s)));
  }
  if (filtro.busca) {
    const terms = tokenize(filtro.busca);
    if (terms.length > 0) {
      rows = rows.filter((r) => {
        const hay = norm(`${r.id} ${r.product} ${r.mandate} ${r.cls} ${r.role} ${r.note} ${r.nota_v1 ?? ''}`);
        return terms.some((t) => hay.includes(t));
      });
    }
  }
  // estratégias da Camada 3 (matriz v1.0): só quando há busca, e só as que citam algum termo
  const termos = filtro.busca ? tokenize(filtro.busca) : [];
  const estrategias = termos.length
    ? (MATRIZ.estrategias ?? []).filter((e) => termos.some((t) => norm(`${e.id} ${e.texto}`).includes(t))).slice(0, 5)
    : [];
  return { aviso: MATRIZ.meta.aviso, total: rows.length, produtos: rows.slice(0, 8), estrategias };
}
