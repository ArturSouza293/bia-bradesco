// =================================================================
// Avaliação do retrieval — roda o golden set contra a busca real.
//   npm run eval:kb      (tsx; usa o mesmo BM25 do runtime)
// Golden: conhecimento/eval/golden.json — perguntas como um cliente
// faria, cada uma apontando o chunk que DEVERIA responder.
// Métrica: hit@1 e hit@4 (o chunk esperado está no top-1 / top-4?).
// Exit 1 se hit@4 < 60% (regressão de retrieval); informativo acima.
// =================================================================
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { searchConhecimento } from '../../server/lib/kb.js';
// @ts-expect-error — módulo .mjs sem tipos (slug é a mesma função do build)
import { slug } from './build-kb.mjs';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');

interface GoldenItem {
  pergunta: string;
  arquivo_id: string;
  secao_titulo: string;
}

const golden: GoldenItem[] = JSON.parse(
  readFileSync(join(root, 'conhecimento', 'eval', 'golden.json'), 'utf-8'),
);

let hit1 = 0;
let hit4 = 0;
const misses: { pergunta: string; esperado: string; top: string[] }[] = [];

for (const g of golden) {
  const esperadoChunk = `kb:${g.arquivo_id}#${slug(g.secao_titulo)}`;
  const esperadoArquivo = `kb:${g.arquivo_id}#`;
  const res = searchConhecimento(g.pergunta);
  const ids = res.map((r) => r.id);
  // acerto por chunk exato OU pelo arquivo certo (seção irmã serve — o
  // modelo lê o trecho e responde; o arquivo é a unidade temática)
  const ok1 = ids[0] === esperadoChunk || (ids[0]?.startsWith(esperadoArquivo) ?? false);
  const ok4 = ids.some((id) => id === esperadoChunk || id.startsWith(esperadoArquivo));
  if (ok1) hit1++;
  if (ok4) hit4++;
  else misses.push({ pergunta: g.pergunta, esperado: esperadoChunk, top: ids });
}

const n = golden.length;
const pct = (x: number) => `${Math.round((x / Math.max(1, n)) * 100)}%`;
console.log(`eval-kb: ${n} perguntas · hit@1 ${hit1}/${n} (${pct(hit1)}) · hit@4 ${hit4}/${n} (${pct(hit4)})`);
if (misses.length) {
  console.log('\nMisses (pergunta → esperado | top-4 retornado):');
  for (const m of misses) {
    console.log(`  • "${m.pergunta}"`);
    console.log(`    esperado ${m.esperado}`);
    console.log(`    veio     ${m.top.join(', ') || '(nada)'}`);
  }
}
if (n > 0 && hit4 / n < 0.6) {
  console.error(`\neval-kb FALHOU: hit@4 ${pct(hit4)} < 60%.`);
  process.exit(1);
}
