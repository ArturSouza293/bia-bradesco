#!/usr/bin/env node
// =================================================================
// Checkup do cérebro da Bia — valida conhecimento/ e confere que os
// gerados (server/kb/*.generated.ts) estão em dia. Exit 1 em erro.
// Rode: npm run kb:check
// =================================================================
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { ROOT, generate, loadCerebro } from './build-kb.mjs';

const erros = [];
const avisos = [];

// ---- 1. front-matter obrigatório e válido ----------------------
const FASES = new Set(['cliente', 'interna', 'etapa3']);
const MODULOS = new Set(['curriculo', 'matriz', 'persona']);
const OBRIGATORIOS = ['id', 'modulo', 'topico', 'tags', 'fase_bia', 'fonte', 'flags', 'status'];

let arquivos;
try {
  arquivos = loadCerebro();
} catch (e) {
  console.error(`ERRO fatal ao ler o cérebro: ${e.message}`);
  process.exit(1);
}

const ids = new Map();
for (const a of arquivos) {
  for (const campo of OBRIGATORIOS) {
    if (a.meta[campo] === undefined) erros.push(`${a.rel}: falta "${campo}" no front-matter`);
  }
  if (a.meta.fase_bia && !FASES.has(a.meta.fase_bia)) {
    erros.push(`${a.rel}: fase_bia inválida "${a.meta.fase_bia}"`);
  }
  if (a.meta.modulo && !MODULOS.has(a.meta.modulo)) {
    erros.push(`${a.rel}: modulo inválido "${a.meta.modulo}"`);
  }
  if (a.meta.id) {
    if (ids.has(a.meta.id)) erros.push(`id duplicado "${a.meta.id}": ${a.rel} e ${ids.get(a.meta.id)}`);
    ids.set(a.meta.id, a.rel);
  }
}

// ---- 2. fontes citadas existem em fontes.md --------------------
const fontesMd = readFileSync(join(ROOT, 'conhecimento', 'fontes.md'), 'utf-8');
const fontesIds = new Set([...fontesMd.matchAll(/^\| (F\d+\.\d+) \|/gm)].map((m) => m[1]));
for (const a of arquivos) {
  if (a.meta.fonte && !fontesIds.has(a.meta.fonte)) {
    erros.push(`${a.rel}: fonte "${a.meta.fonte}" não está em fontes.md`);
  }
}

// ---- 3. matriz íntegra -----------------------------------------
const matriz = JSON.parse(readFileSync(join(ROOT, 'conhecimento', 'matriz-produtos', 'matriz.json'), 'utf-8'));
if (matriz.produtos.length !== 66) erros.push(`matriz.json: esperava 66 produtos, tem ${matriz.produtos.length}`);
if (!matriz.meta.aviso?.includes('ILUSTRATIVOS')) erros.push('matriz.json: meta.aviso perdeu a flag de dados ilustrativos');
for (const r of matriz.produtos) {
  if (typeof r.floor !== 'number') erros.push(`matriz.json: produto "${r.id}" com floor não numérico`);
  if (!r.note) avisos.push(`matriz.json: produto "${r.id}" sem nota de planejamento`);
}

// ---- 4. guardrail: matriz nunca é fase 'cliente' ----------------
for (const a of arquivos) {
  if (a.meta.modulo === 'matriz' && a.meta.fase_bia === 'cliente') {
    erros.push(`${a.rel}: conteúdo da matriz NÃO pode ser fase_bia: cliente (decisão dec-rag-bia-cfp-aprovado)`);
  }
}

// ---- 5. gerados em dia -----------------------------------------
let chunksCliente = 0;
try {
  const { files, chunks } = generate();
  chunksCliente = chunks.filter((c) => c.fase === 'cliente').length;
  if (chunksCliente === 0) erros.push('nenhum chunk fase=cliente — a Bia ficaria sem educação financeira');
  for (const [rel, esperado] of files) {
    let atual = '';
    try {
      atual = readFileSync(join(ROOT, rel), 'utf-8');
    } catch {
      erros.push(`${rel}: não existe — rode npm run kb:build`);
      continue;
    }
    if (atual !== esperado) erros.push(`${rel}: desatualizado — rode npm run kb:build e commite`);
  }
} catch (e) {
  erros.push(`falha ao gerar para comparação: ${e.message}`);
}

// ---- veredito ---------------------------------------------------
for (const a of avisos) console.log(`aviso: ${a}`);
if (erros.length > 0) {
  for (const e of erros) console.error(`ERRO: ${e}`);
  console.error(`\ncheck-kb: ${erros.length} erro(s).`);
  process.exit(1);
}
console.log(
  `check-kb OK: ${arquivos.length} arquivos curados, ${ids.size} ids, ${chunksCliente} chunks fase=cliente, matriz com 66 produtos, gerados em dia.`,
);
