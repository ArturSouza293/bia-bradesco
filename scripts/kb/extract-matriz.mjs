#!/usr/bin/env node
// =================================================================
// Extrai a matriz de 66 produtos do JSX-fonte (vision_tax_duration_matrix.jsx,
// v0.3 jul/2026, origem: acervo do vision-agents) e gera:
//   conhecimento/matriz-produtos/matriz.json  — dados tipados (fonte da verdade)
//   conhecimento/matriz-produtos/matriz.md    — leitura humana
// Determinístico: mesma entrada → mesma saída. Rode: node scripts/kb/extract-matriz.mjs
// =================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const SRC = join(root, 'conhecimento', 'matriz-produtos', 'fonte', 'vision_tax_duration_matrix.jsx');
const OUT_JSON = join(root, 'conhecimento', 'matriz-produtos', 'matriz.json');
const OUT_MD = join(root, 'conhecimento', 'matriz-produtos', 'matriz.md');

const jsx = readFileSync(SRC, 'utf-8');

// Isola o literal `const MATRIX = [ ... ];` — termina no primeiro `];` no início de linha.
const start = jsx.indexOf('const MATRIX = [');
if (start < 0) throw new Error('MATRIX não encontrado no JSX');
const end = jsx.indexOf('\n];', start);
if (end < 0) throw new Error('fim do MATRIX não encontrado');
const literal = jsx.slice(start, end + 3);

// O literal referencia OBJ.*; TAX/PTYPE são strings nos rows. Avalia num escopo controlado.
const OBJ = { LIQ: 'Liquidez', LON: 'Longevidade', LEG: 'Legado' };
// eslint-disable-next-line no-new-func
const MATRIX = new Function('OBJ', `${literal.replace('const MATRIX =', 'return')}`)(OBJ);
if (!Array.isArray(MATRIX) || MATRIX.length !== 66) {
  throw new Error(`esperava 66 produtos, extraí ${Array.isArray(MATRIX) ? MATRIX.length : typeof MATRIX}`);
}

// Rótulos dos enums do JSX (mantidos aqui para o JSON ser autossuficiente).
const TAX_LABEL = {
  isento: 'Isento PF', rf: 'RF regressivo', comecotas: 'Come-cotas',
  gcrv: 'Ganho cap. RV', etf: 'ETF (fonte)', etfrf: 'ETF-RF regressivo',
  prev: 'Previdência regr.', offshore: 'Offshore 15%/a', gcprog: 'Ganho cap. progr.',
  itcmd: 'ITCMD sucessão', semir: 'Sem IR', porativo: 'Ativo a ativo',
  deducao: 'Dedução IRPF', irpf: 'IRPF progressivo', pjdiv: 'Dividendos + IRPFM',
};
const PTYPE_LABEL = {
  inv: 'Investimento', prot: 'Proteção', cred: 'Crédito', estr: 'Estrutura', mod: 'Modelado',
};

const meta = {
  fonte: 'vision_tax_duration_matrix.jsx v0.3 (jul/2026) — acervo do projeto Vision (vision-agents)',
  registro_fonte: 'F1.1',
  extraido_em: 'gerado por scripts/kb/extract-matriz.mjs (determinístico; sem data para diff estável)',
  aviso: 'DADOS ILUSTRATIVOS — ratificar com o Tributário antes de qualquer uso com cliente. Uso na Bia: SOMENTE lente interna (cross-sell silencioso, notas fora de escopo, futura Etapa 3). NUNCA citar ao cliente na Etapa 2.',
  fundamentos: 'Lei 15.270/2025, Lei 14.754/2023, LC 227/2026, STF Tema 1.214, Lei 14.803/2024, Decreto 12.499/2025; MP 1.303/2025 caducou em 08/10/2025.',
  tax_label: TAX_LABEL,
  ptype_label: PTYPE_LABEL,
};

writeFileSync(OUT_JSON, `${JSON.stringify({ meta, produtos: MATRIX }, null, 1)}\n`);

// ---- matriz.md — leitura humana --------------------------------
const md = [];
md.push(`---
id: matriz-produtos
modulo: matriz
topico: "Matriz de 66 produtos × duração × tributação (v0.3)"
tags: [matriz, produtos, tributacao, suitability, cross-sell]
fase_bia: interna
fonte: F1.1
flags: ["FONTE INTERNA", "DADOS ILUSTRATIVOS — ratificar com Tributário"]
status: base
---

# Matriz de produtos — leitura humana

> **GERADO** por \`scripts/kb/extract-matriz.mjs\` a partir de \`fonte/vision_tax_duration_matrix.jsx\`
> (v0.3, jul/2026, acervo Vision). Não edite à mão — edite a fonte e regenere.
> **Dados ilustrativos; ratificar com Tributário. Uso interno (lente de gerente) — nunca citado ao cliente na Etapa 2.**
`);
for (const objetivo of ['Liquidez', 'Longevidade', 'Legado']) {
  const rows = MATRIX.filter((r) => r.obj === objetivo);
  md.push(`\n## ${objetivo} (${rows.length} produtos)\n`);
  md.push('| Produto | Tipo | Classe | Duração | Regime | Alíquota LP | Risco | Segmentos |');
  md.push('|---|---|---|---|---|---|---|---|');
  for (const r of rows) {
    md.push(`| ${r.product} | ${PTYPE_LABEL[r.ptype] ?? r.ptype} | ${r.cls} | ${r.dur} | ${TAX_LABEL[r.tax] ?? r.tax} | ${r.floor}% | ${r.risk} | ${r.seg.join(', ')} |`);
  }
  md.push('');
  for (const r of rows) {
    md.push(`### ${r.product} (\`${r.id}\`)`);
    md.push(`- **Papel:** ${r.role} · **Mandato:** ${r.mandate} · **Horizonte:** ${r.yrs[0]}–${r.yrs[1]} anos · **Liquidez:** ${r.liq}`);
    md.push(`- **Tributação:** ${TAX_LABEL[r.tax] ?? r.tax} — ${r.rate} (evento: ${r.ev}${r.iof ? '; IOF' : ''}) · **Base legal:** ${r.basis}`);
    if (r.dims) md.push(`- **Risco M/C/L/X:** ${r.dims.m}/${r.dims.c}/${r.dims.l}/${r.dims.x} · **Piso suitability:** ${r.risk} · **Status:** ${r.status}`);
    else md.push(`- **Risco:** não se aplica (produto de ${PTYPE_LABEL[r.ptype] ?? r.ptype}) · **Piso suitability:** ${r.risk} · **Status:** ${r.status}`);
    md.push(`- **Nota de planejamento:** ${r.note}`);
    md.push('');
  }
}
writeFileSync(OUT_MD, `${md.join('\n')}\n`);

console.log(`ok: ${MATRIX.length} produtos → matriz.json + matriz.md`);
