#!/usr/bin/env node
// =================================================================
// Extrai a matriz da lente interna a partir da MATRIZ VIGENTE do Vision —
// vision_goal_matrix_v1.jsx v1.0 (jul/2026), por decisão do dono de 22/07/2026
// (dec-matriz-v1-vigente) aplicada à Bia em 05/10/2026 (dec-bia-lente-matriz-v1).
//
//   • conjunto e campos do motor (71 produtos = 66 + 5 novos): v1.0 — `PRODUCTS`
//     (tipo, regime, alíquota-piso, horizonte, risco M/C/L/X, piso de suitability,
//     segmentos, objetivo 3L, marcas do motor) e a nota da linha (o comentário que
//     traz a correção da auditoria CFP × personas ou o A CONFIRMAR da linha nova);
//   • estratégias da Camada 3 (`STRATEGIES`) e os 20 objetivos (`GOALS`): v1.0;
//   • texto descritivo dos 66 de base (mandato, classe, duração, liquidez, alíquota
//     por extenso, evento, IOF, papel, base legal, nota de planejamento): v0.3 —
//     a própria v1.0 se declara espelho dos campos do motor e aponta a
//     vision_tax_duration_matrix.jsx como fonte canônica desse texto (o nome do
//     produto por extenso também vem daí; a v1.0 traz o rótulo curto de tela).
//
// Gera:
//   conhecimento/matriz-produtos/matriz.json  — dados tipados (fonte da verdade)
//   conhecimento/matriz-produtos/matriz.md    — leitura humana
// Determinístico: mesma entrada → mesma saída. Rode: node scripts/kb/extract-matriz.mjs
// =================================================================
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const FONTE = join(root, 'conhecimento', 'matriz-produtos', 'fonte');
const SRC_V1 = join(FONTE, 'vision_goal_matrix_v1.jsx');
const SRC_V03 = join(FONTE, 'vision_tax_duration_matrix.jsx');
const OUT_JSON = join(root, 'conhecimento', 'matriz-produtos', 'matriz.json');
const OUT_MD = join(root, 'conhecimento', 'matriz-produtos', 'matriz.md');

const OBJ = { LIQ: 'Liquidez', LON: 'Longevidade', LEG: 'Legado' };
const RLV = { Conservador: 1, Moderado: 2, Agressivo: 3 };

// Isola um literal `<abre> ... <fecha>` que termina no início de linha e o avalia num escopo com OBJ.
function literal(jsx, abre, fecha) {
  const start = jsx.indexOf(abre);
  if (start < 0) throw new Error(`não encontrei «${abre}»`);
  const end = jsx.indexOf(`\n${fecha}`, start);
  if (end < 0) throw new Error(`fim de «${abre}» não encontrado`);
  const texto = jsx.slice(start, end + 1 + fecha.length);
  const corpo = texto.slice(abre.length - 1); // começa no [ ou {
  // eslint-disable-next-line no-new-func
  return { valor: new Function('OBJ', `return ${corpo.replace(/;\s*$/, '')}`)(OBJ), texto };
}

const v1 = readFileSync(SRC_V1, 'utf-8');
const v03 = readFileSync(SRC_V03, 'utf-8');

const { valor: PRODUCTS, texto: textoProducts } = literal(v1, 'export const PRODUCTS = [', '];');
const { valor: STRATEGIES } = literal(v1, 'export const STRATEGIES = {', '};');
const { valor: GOALS } = literal(v1, 'export const GOALS = [', '];');
const { valor: MATRIX_V03 } = literal(v03, 'const MATRIX = [', '];');

if (PRODUCTS.length !== 71) throw new Error(`esperava 71 produtos na v1.0, extraí ${PRODUCTS.length}`);
if (MATRIX_V03.length !== 66) throw new Error(`esperava 66 produtos na v0.3, extraí ${MATRIX_V03.length}`);
if (GOALS.length !== 20) throw new Error(`esperava 20 objetivos na v1.0, extraí ${GOALS.length}`);

// O comentário no fim de cada linha da v1.0 (`{ id: "x", ... }, // [A-03] ...`).
const notaV1 = new Map();
for (const linha of textoProducts.split('\n')) {
  const m = linha.match(/\{\s*id:\s*"([^"]+)".*\}\s*,\s*\/\/\s*(.+)$/);
  if (m) notaV1.set(m[1], m[2].trim());
}

const porIdV03 = new Map(MATRIX_V03.map((r) => [r.id, r]));
const MARCAS = ['dm', 'matchableL', 'drag', 'income', 'wrapper', 'weak', 'review'];
const CAMPOS_MOTOR = ['ptype', 'tax', 'floor', 'yrs', 'dims', 'risk', 'seg', 'obj'];
const igual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

const correcoes = [];
const produtos = PRODUCTS.map((p) => {
  const d = porIdV03.get(p.id);
  const r = {
    id: p.id,
    ptype: p.ptype,
    product: d?.product ?? p.p, // o nome por extenso é texto descritivo (v0.3); a v1.0 traz rótulo curto de tela
    mandate: d?.mandate ?? '',
    cls: d?.cls ?? '',
    dur: d?.dur ?? '',
    yrs: p.yrs,
    liq: d?.liq ?? '',
    tax: p.tax,
    rate: d?.rate ?? '',
    floor: p.floor,
    ev: d?.ev ?? '',
    iof: d?.iof ?? false,
    obj: p.obj,
    role: d?.role ?? '',
    risk: p.risk,
    rl: RLV[p.risk] ?? 0,
    dims: p.dims ?? null,
    seg: p.seg,
    status: p.review ? 'review' : (d?.status ?? 'base'),
    basis: d?.basis ?? '',
    note: d?.note ?? '',
    nota_v1: notaV1.get(p.id) ?? '',
    marcas_motor: MARCAS.filter((k) => p[k] === true),
    origem: { motor: 'v1.0', descricao: d ? 'v0.3' : 'nenhuma (linha nova da v1.0)' },
  };
  if (d) {
    const mudou = CAMPOS_MOTOR.filter((k) => !igual(r[k], d[k]));
    if (mudou.length) correcoes.push({ id: p.id, campos: mudou.map((k) => `${k}: ${JSON.stringify(d[k])} → ${JSON.stringify(r[k])}`) });
  }
  return r;
});
const saiu = MATRIX_V03.filter((d) => !PRODUCTS.some((p) => p.id === d.id)).map((d) => d.id);
if (saiu.length) throw new Error(`produtos da v0.3 ausentes na v1.0: ${saiu.join(', ')}`);

const estrategias = Object.entries(STRATEGIES).map(([id, texto]) => ({ id, texto }));
const objetivos = GOALS.map((g) => ({ ...g }));

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
for (const r of produtos) {
  if (!TAX_LABEL[r.tax]) throw new Error(`regime sem rótulo: ${r.tax} (${r.id})`);
  if (!PTYPE_LABEL[r.ptype]) throw new Error(`tipo sem rótulo: ${r.ptype} (${r.id})`);
}

const meta = {
  fonte: 'vision_goal_matrix_v1.jsx v1.0 (jul/2026) — a matriz vigente do projeto Vision (decisão do dono de 22/07/2026); texto descritivo dos 66 de base herdado da vision_tax_duration_matrix.jsx v0.3',
  registro_fonte: 'F1.5 (conjunto, motor, estratégias, objetivos) · F1.1 (texto descritivo)',
  extraido_em: 'gerado por scripts/kb/extract-matriz.mjs (determinístico; sem data para diff estável)',
  aviso: 'DADOS ILUSTRATIVOS — ratificar com o Tributário antes de qualquer uso com cliente; as 5 linhas novas da v1.0 estão em status review (Tributário, Risco e Compliance). Uso na Bia: SOMENTE lente interna, e só DEPOIS que o número do plano da pessoa existe na conversa (plano antes do produto). NUNCA citar ao cliente produtos, alíquotas ou regimes.',
  fundamentos: 'Lei 15.270/2025, Lei 14.754/2023, LC 227/2026, STF Tema 1.214, Lei 14.803/2024, Decreto 12.499/2025; MP 1.303/2025 caducou em 08/10/2025.',
  tax_label: TAX_LABEL,
  ptype_label: PTYPE_LABEL,
  correcoes_v1: correcoes.length,
};

writeFileSync(OUT_JSON, `${JSON.stringify({ meta, produtos, estrategias, objetivos }, null, 1)}\n`);

// ---- matriz.md — leitura humana --------------------------------
const md = [];
md.push(`---
id: matriz-produtos
modulo: matriz
topico: "Matriz vigente v1.0: 71 produtos × duração × tributação, estratégias e objetivos"
tags: [matriz, produtos, tributacao, suitability, estrategias, objetivos]
fase_bia: interna
fonte: F1.5
flags: ["FONTE INTERNA", "DADOS ILUSTRATIVOS — ratificar com Tributário"]
status: base
---

# Matriz de produtos — leitura humana

> **GERADO** por \`scripts/kb/extract-matriz.mjs\` a partir de \`fonte/vision_goal_matrix_v1.jsx\` (v1.0, jul/2026, a
> matriz vigente do Vision) com o texto descritivo dos 66 de base herdado de \`fonte/vision_tax_duration_matrix.jsx\`
> (v0.3). Não edite à mão — edite a fonte e regenere.
> **Dados ilustrativos; ratificar com Tributário. Uso interno (lente de gerente), só depois do número do plano — nunca
> citado ao cliente.**

## O que a v1.0 mudou nos campos do motor (${correcoes.length} produtos de base)
`);
for (const c of correcoes) md.push(`- \`${c.id}\`: ${c.campos.join(' · ')}`);
md.push('');
for (const objetivo of ['Liquidez', 'Longevidade', 'Legado']) {
  const rows = produtos.filter((r) => r.obj === objetivo);
  md.push(`\n## ${objetivo} (${rows.length} produtos)\n`);
  md.push('| Produto | Tipo | Classe | Duração | Regime | Alíquota LP | Risco | Segmentos | Status |');
  md.push('|---|---|---|---|---|---|---|---|---|');
  for (const r of rows) {
    md.push(`| ${r.product} | ${PTYPE_LABEL[r.ptype]} | ${r.cls || '—'} | ${r.dur || '—'} | ${TAX_LABEL[r.tax]} | ${r.floor}% | ${r.risk} | ${r.seg.join(', ')} | ${r.status} |`);
  }
  md.push('');
  for (const r of rows) {
    md.push(`### ${r.product} (\`${r.id}\`)`);
    if (r.origem.descricao === 'v0.3') {
      md.push(`- **Papel:** ${r.role} · **Mandato:** ${r.mandate} · **Horizonte:** ${r.yrs[0]}–${r.yrs[1]} anos · **Liquidez:** ${r.liq}`);
      md.push(`- **Tributação:** ${TAX_LABEL[r.tax]} — ${r.rate} (evento: ${r.ev}${r.iof ? '; IOF' : ''}) · **Base legal:** ${r.basis}`);
    } else {
      md.push(`- **Linha nova da v1.0** · **Horizonte:** ${r.yrs[0]}–${r.yrs[1]} anos · **Tributação:** ${TAX_LABEL[r.tax]} (alíquota-piso ${r.floor}%)`);
    }
    if (r.dims) md.push(`- **Risco M/C/L/X:** ${r.dims.m}/${r.dims.c}/${r.dims.l}/${r.dims.x} · **Piso suitability:** ${r.risk} · **Status:** ${r.status}`);
    else md.push(`- **Risco:** não se aplica (produto de ${PTYPE_LABEL[r.ptype]}) · **Piso suitability:** ${r.risk} · **Status:** ${r.status}`);
    if (r.marcas_motor.length) md.push(`- **Marcas do motor:** ${r.marcas_motor.join(', ')}`);
    if (r.note) md.push(`- **Nota de planejamento (v0.3):** ${r.note}`);
    if (r.nota_v1) md.push(`- **Nota da v1.0:** ${r.nota_v1}`);
    md.push('');
  }
}
md.push(`\n## Estratégias candidatas (Camada 3, ${estrategias.length})\n`);
for (const e of estrategias) md.push(`- \`${e.id}\`: ${e.texto}`);
md.push(`\n## Objetivos (${objetivos.length})\n`);
md.push('| Objetivo | 3L | Natureza | Horizonte típico (anos) | Tipos de produto |');
md.push('|---|---|---|---|---|');
for (const g of objetivos) md.push(`| ${g.name} (\`${g.id}\`) | ${g.l3} | ${g.nature} | ${g.hRange[0]}–${g.hRange[1]} | ${g.ptypes.join(', ')} |`);
writeFileSync(OUT_MD, `${md.join('\n')}\n`);

console.log(`ok: ${produtos.length} produtos (${correcoes.length} com campo do motor corrigido pela v1.0), ${estrategias.length} estratégias, ${objetivos.length} objetivos → matriz.json + matriz.md`);
