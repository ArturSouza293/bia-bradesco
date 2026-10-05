import React, { useState, useMemo } from "react";

/**
 * Vision — Matriz de Objetivos (v1.0 · jul/2026)
 * Camada 2 do goal-based: Necessidade (7, doc 04) → Objetivo (20) → Política de risco → Elegibilidade.
 *
 * v1.0 — correções da Auditoria CFP × 14 Personas (Vision_Auditoria_Matrizes_x_Personas_v1):
 *  [D-02] Piso de risco NÃO se aplica a estruturas/proteção (estr, prot) nem a wrappers de mandato.
 *  [D-03] Escada mecanizada: gates sistêmicos (dívida cara) + avisos (reserva, proteção) via ctx.flags.
 *  [D-05] Score rebalanceado em metas datadas: dm 5→20; bônus fiscal condicionado a instrumento datável.
 *  [D-04] Come-cotas visível: penalidade `drag` no score (fundos abertos; exclusivo pós-Lei 14.754).
 *  [D-07] Wrappers (carteira-adm, fundo-exclusivo) herdam mandato do perfil (dims dinâmicos) — sem bypass de caps.
 *  [A-03] Kit de renda isenta liberado p/ Conservador em decumulação via override de piso + flag de mandato.
 *  [A-04/B-01] meta-fx: glidepath incide só sobre M ex-câmbio (fxLiability) + novas linhas usd-cash / usd-bonds.
 *  [A-05] aposentadoria: cap X 2→3; etf-intl piso Agressivo→Moderado (B-05).
 *  [A-06] cuidado-vitalicio: cap M 1→2 (dual-sleeve), dm por rolagem (dmRolling), ptypes + estr.
 *  [A-07] Novo objetivo: desmobilizacao-fisica (iliquidez do balanço — Antônio).
 *  [A-08] prev-suc admitido em liquidez-espolio via extraIds.
 *  [A-09] Cap de L colapsa com vencimento casado (matchableL + dmOn → L→0, hold-to-maturity).
 *  [A-11] Classes modeladas visíveis como "base do plano" (modIds) — mapeáveis, nunca recomendadas.
 *  [A-01/02/12/13 · B-04] seg corrigidos: seguro/pgbl/vgbl ⊇ Retail; multi ⊇ Prime; prestamista ⊇ Private; holding ⊇ Principal.
 *  [A-10/B-02/B-03/B-07] Novas linhas (status review): seg-invalidez, renda-vitalicia, parcelamento-fatura.
 *
 * - REGRA ZERO: esta matriz decide ESTRUTURA (o que é elegível e por quê). Valores, retornos,
 *   probabilidade de sucesso e dimensionamento são do motor determinístico.
 * - O ESPELHO de produtos (71) é read-only da Matriz de Produtos; ao portar para o app,
 *   extrair para módulo único compartilhado (fonte única — matar a duplicação).
 * - exports: evalGoalGate / evalProduct / scoreProduct / suitabilityVeto — a visão Pinpoint
 *   (matriz de produtos) DEVE consumir suitabilityVeto + scoreProduct [D-01/D-08: motor único].
 */

// ---- Brand tokens ---------------------------------------------------------
const C = {
  oxblood: "#3B0507", red: "#CC092F", navy: "#1E2761", gold: "#BFA06A",
  ivory: "#FBF7F1", ink: "#2B2420", line: "#E7DFD5", paper: "#FFFFFF",
};
const SERIF = "'Newsreader', Georgia, 'Times New Roman', serif";
const SANS = "'Nunito Sans', -apple-system, system-ui, sans-serif";
const MONO = "'SFMono-Regular', ui-monospace, Menlo, monospace";

// ---- Enums ----------------------------------------------------------------
const OBJ = { LIQ: "Liquidez", LON: "Longevidade", LEG: "Legado" };
const SEGMENTS = ["Retail", "Prime", "Principal", "Private"];
const PROFILES = ["Conservador", "Moderado", "Agressivo"];
const RLV = { Conservador: 1, Moderado: 2, Agressivo: 3 };
// [D-07] Mandato máximo por perfil — wrappers (carteira-adm, fundo-exclusivo) herdam estes dims.
export const MANDATE = {
  Conservador: { m: 1, c: 1, l: 1, x: 1 },
  Moderado: { m: 2, c: 2, l: 1, x: 2 },
  Agressivo: { m: 3, c: 2, l: 2, x: 3 },
};
const OBJ_STYLE = {
  [OBJ.LIQ]: { fg: C.navy, bg: "#E8EAF2", dot: C.navy },
  [OBJ.LON]: { fg: "#6B5327", bg: "#F5EEDF", dot: C.gold },
  [OBJ.LEG]: { fg: "#7A1420", bg: "#F5E3E3", dot: C.oxblood },
};
const PTYPE = {
  inv: { label: "Investimento", dot: "#1E2761" },
  prot: { label: "Proteção", dot: "#0E6B43" },
  cred: { label: "Crédito", dot: "#9A4A06" },
  estr: { label: "Estrutura", dot: "#3B0507" },
  mod: { label: "Modelado", dot: "#57534E" },
};
// As 7 necessidades comuns (doc 04, Parte 2)
const NEEDS = {
  1: "Segurança e paz de espírito",
  2: "Proteção de dependentes e renda",
  3: "Um lar",
  4: "Futuro dos filhos",
  5: "Aposentadoria / renda para a vida",
  6: "Estilo de vida sem deriva",
  7: "Legado e sucessão",
};
const NATURE = { data: "Data-alvo", fluxo: "Fluxo recorrente", cont: "Contingente", evento: "Evento (estoque)", estrut: "Estrutural", sane: "Saneamento" };
const FLEXV = { needs: "Essencial", wants: "Importante", wishes: "Aspiracional" };
// Rótulos curtos dos regimes (espelho da Matriz de Produtos)
const TAXL = {
  isento: "Isento PF", rf: "RF regressivo", comecotas: "Come-cotas", gcrv: "Ganho cap. RV",
  etf: "ETF (fonte)", etfrf: "ETF-RF regr.", prev: "Previdência regr.", offshore: "Offshore 15%/a",
  gcprog: "Ganho cap. progr.", itcmd: "ITCMD", semir: "Sem IR", porativo: "Ativo a ativo",
  deducao: "Dedução IRPF", irpf: "IRPF progr.", pjdiv: "Div. + IRPFM",
};

// ---- ESPELHO read-only · Matriz de Produtos (71 = 66 + 5 novas) -------------
// Campos do motor. Fonte canônica: vision_tax_duration_matrix (ao portar: módulo único compartilhado).
// dm=true: título marcado cujo M colapsa se casado ao vencimento (duration matching).
// matchableL=true [A-09]: vencimento casável ao objetivo → L→0 (hold-to-maturity) quando dmOn.
// drag=true [D-04]: come-cotas (fundos abertos; exclusivo pós-14.754) — penaliza score em h≥3.
// income=true: paga renda recorrente — bônus em objetivos de decumulação.
// wrapper=true [D-07]: veículo de mandato — dims herdam MANDATE[perfil]; piso não se aplica (mandato enquadra).
export const PRODUCTS = [
  { id: "selic", p: "Tesouro Selic", ptype: "inv", tax: "rf", floor: 15, yrs: [0, 1], dims: { m: 0, c: 0, l: 0, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LIQ },
  { id: "cdb-liq", p: "CDB liquidez diária", ptype: "inv", tax: "rf", floor: 15, yrs: [0, 1], dims: { m: 0, c: 1, l: 0, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LIQ },
  { id: "fundo-di", p: "Fundo DI", ptype: "inv", tax: "comecotas", floor: 15, yrs: [0, 1], dims: { m: 0, c: 1, l: 0, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LIQ, drag: true },
  { id: "poupanca", p: "Poupança", ptype: "inv", tax: "isento", floor: 0, yrs: [0, 1], dims: { m: 0, c: 0, l: 0, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime"], obj: OBJ.LIQ, weak: true },
  { id: "lci-lca", p: "LCI / LCA", ptype: "inv", tax: "isento", floor: 0, yrs: [1, 3], dims: { m: 0, c: 1, l: 2, x: 0 }, risk: "Conservador", seg: ["Prime", "Principal", "Private"], obj: OBJ.LIQ, matchableL: true },
  { id: "ipca", p: "Tesouro IPCA+", ptype: "inv", tax: "rf", floor: 15, yrs: [5, 15], dims: { m: 2, c: 0, l: 0, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LON, dm: true },
  { id: "ipca-cupom", p: "Tesouro IPCA+ Juros Sem.", ptype: "inv", tax: "rf", floor: 15, yrs: [5, 15], dims: { m: 2, c: 0, l: 0, x: 0 }, risk: "Conservador", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON, dm: true, income: true },
  { id: "rendamais", p: "Tesouro Renda+", ptype: "inv", tax: "rf", floor: 15, yrs: [10, 40], dims: { m: 2, c: 0, l: 1, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LON, dm: true, income: true },
  { id: "educamais", p: "Tesouro Educa+", ptype: "inv", tax: "rf", floor: 15, yrs: [5, 18], dims: { m: 2, c: 0, l: 1, x: 0 }, risk: "Conservador", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON, dm: true },
  { id: "cri-cra", p: "CRI / CRA", ptype: "inv", tax: "isento", floor: 0, yrs: [4, 10], dims: { m: 1, c: 2, l: 3, x: 0 }, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LON, income: true },
  { id: "deb-inc", p: "Debêntures incentivadas", ptype: "inv", tax: "isento", floor: 0, yrs: [4, 10], dims: { m: 1, c: 2, l: 2, x: 0 }, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LON, income: true },
  { id: "deb-reg", p: "Debêntures regulares", ptype: "inv", tax: "rf", floor: 15, yrs: [3, 7], dims: { m: 1, c: 2, l: 2, x: 0 }, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LON },
  { id: "fundo-cp", p: "Fundo RF Crédito Privado", ptype: "inv", tax: "comecotas", floor: 15, yrs: [1, 3], dims: { m: 1, c: 2, l: 2, x: 0 }, risk: "Moderado", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON, drag: true },
  { id: "fundo-imab", p: "Fundo Inflação (IMA-B)", ptype: "inv", tax: "comecotas", floor: 15, yrs: [3, 10], dims: { m: 2, c: 1, l: 1, x: 0 }, risk: "Moderado", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON, drag: true },
  { id: "pgbl", p: "PGBL", ptype: "inv", tax: "prev", floor: 10, yrs: [10, 40], dims: { m: 1, c: 1, l: 2, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LON }, // [A-02] +Retail
  { id: "vgbl", p: "VGBL", ptype: "inv", tax: "prev", floor: 10, yrs: [10, 40], dims: { m: 1, c: 1, l: 2, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LON }, // [A-02] +Retail
  { id: "acoes", p: "Ações BR (buy & hold)", ptype: "inv", tax: "gcrv", floor: 15, yrs: [5, 15], dims: { m: 3, c: 0, l: 0, x: 0 }, risk: "Agressivo", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON },
  { id: "etf-acoes", p: "ETF de ações (BOVA11)", ptype: "inv", tax: "etf", floor: 15, yrs: [5, 15], dims: { m: 3, c: 0, l: 0, x: 0 }, risk: "Agressivo", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON },
  { id: "fundo-acoes", p: "Fundo de ações", ptype: "inv", tax: "gcrv", floor: 15, yrs: [5, 15], dims: { m: 3, c: 0, l: 2, x: 0 }, risk: "Agressivo", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON },
  { id: "fii", p: "FII", ptype: "inv", tax: "isento", floor: 0, yrs: [5, 15], dims: { m: 2, c: 1, l: 1, x: 0 }, risk: "Moderado", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON, income: true },
  { id: "multi", p: "Fundo Multimercado", ptype: "inv", tax: "comecotas", floor: 15, yrs: [3, 7], dims: { m: 2, c: 1, l: 2, x: 0 }, risk: "Moderado", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON, drag: true }, // [B-04] +Prime
  { id: "intl", p: "Internacional / Offshore", ptype: "inv", tax: "offshore", floor: 15, yrs: [5, 15], dims: { m: 2, c: 1, l: 2, x: 3 }, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LON },
  { id: "bdr", p: "BDRs", ptype: "inv", tax: "gcrv", floor: 15, yrs: [5, 15], dims: { m: 3, c: 0, l: 1, x: 3 }, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LON },
  { id: "fidc", p: "FIDC", ptype: "inv", tax: "gcrv", floor: 15, yrs: [2, 5], dims: { m: 1, c: 3, l: 3, x: 0 }, risk: "Agressivo", seg: ["Principal", "Private"], obj: OBJ.LON },
  { id: "alts", p: "Alternativos (PE/FIP)", ptype: "inv", tax: "gcrv", floor: 15, yrs: [7, 15], dims: { m: 3, c: 2, l: 3, x: 0 }, risk: "Agressivo", seg: ["Private"], obj: OBJ.LON },
  { id: "seguro", p: "Seguro de vida (termo)", ptype: "prot", tax: "isento", floor: 0, yrs: [0, 40], dims: null, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LEG }, // [A-01] +Retail
  { id: "prev-suc", p: "Previdência como sucessão", ptype: "estr", tax: "itcmd", floor: 0, yrs: [0, 40], dims: null, risk: "Conservador", seg: ["Prime", "Principal", "Private"], obj: OBJ.LEG },
  { id: "holding", p: "Holding patrimonial", ptype: "estr", tax: "itcmd", floor: 8, yrs: [0, 40], dims: null, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LEG }, // [A-12] +Principal · [D-02] piso não se aplica a estr
  { id: "usufruto", p: "Doação c/ reserva de usufruto", ptype: "estr", tax: "itcmd", floor: 8, yrs: [0, 40], dims: null, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LEG },
  { id: "cgi", p: "CGI (garantia de investimentos)", ptype: "cred", tax: "semir", floor: 0, yrs: [0, 5], dims: null, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LIQ },
  { id: "fgts", p: "FGTS", ptype: "mod", tax: "isento", floor: 0, yrs: [1, 20], dims: { m: 0, c: 0, l: 3, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime"], obj: OBJ.LIQ },
  { id: "consorcio", p: "Consórcio", ptype: "cred", tax: "semir", floor: 0, yrs: [2, 7], dims: null, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LON },
  { id: "prefixado", p: "Tesouro Prefixado", ptype: "inv", tax: "rf", floor: 15, yrs: [2, 10], dims: { m: 3, c: 0, l: 0, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LON, dm: true },
  { id: "lig", p: "LIG", ptype: "inv", tax: "isento", floor: 0, yrs: [3, 10], dims: { m: 0, c: 1, l: 2, x: 0 }, risk: "Conservador", seg: ["Principal", "Private"], obj: OBJ.LON, matchableL: true }, // basis correta: Lei 13.097/2015 [B-06]
  { id: "coe", p: "COE", ptype: "inv", tax: "rf", floor: 15, yrs: [1, 5], dims: { m: 2, c: 2, l: 3, x: 0 }, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LON },
  { id: "etf-rf", p: "ETF de renda fixa", ptype: "inv", tax: "etfrf", floor: 15, yrs: [1, 7], dims: { m: 1, c: 1, l: 0, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LIQ },
  { id: "fundo-cambial", p: "Fundo Cambial", ptype: "inv", tax: "comecotas", floor: 20, yrs: [0, 2], dims: { m: 2, c: 0, l: 1, x: 3 }, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LIQ, drag: true },
  { id: "fiagro", p: "FIAgro", ptype: "inv", tax: "isento", floor: 0, yrs: [4, 10], dims: { m: 2, c: 2, l: 1, x: 0 }, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LON, income: true },
  { id: "fi-infra", p: "FI-Infra / FIP-IE", ptype: "inv", tax: "isento", floor: 0, yrs: [5, 15], dims: { m: 2, c: 2, l: 1, x: 0 }, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LON, income: true },
  { id: "acoes-exterior", p: "Ações no exterior (direto)", ptype: "inv", tax: "offshore", floor: 15, yrs: [5, 15], dims: { m: 3, c: 0, l: 1, x: 3 }, risk: "Agressivo", seg: ["Private"], obj: OBJ.LON },
  { id: "trust", p: "Trust", ptype: "estr", tax: "itcmd", floor: 8, yrs: [0, 40], dims: null, risk: "Moderado", seg: ["Private"], obj: OBJ.LEG },
  { id: "home-equity", p: "Home Equity", ptype: "cred", tax: "semir", floor: 0, yrs: [5, 20], dims: null, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LIQ },
  { id: "consignado", p: "Crédito Consignado", ptype: "cred", tax: "semir", floor: 0, yrs: [1, 6], dims: null, risk: "Conservador", seg: ["Retail", "Prime"], obj: OBJ.LIQ },
  { id: "cdb-prazo", p: "CDB a prazo (2a+)", ptype: "inv", tax: "rf", floor: 15, yrs: [2, 5], dims: { m: 0, c: 1, l: 2, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LON, matchableL: true },
  { id: "lcd", p: "LCD", ptype: "inv", tax: "isento", floor: 0, yrs: [3, 10], dims: { m: 0, c: 1, l: 2, x: 0 }, risk: "Conservador", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON, matchableL: true },
  { id: "carteira-adm", p: "Carteira administrada", ptype: "inv", tax: "porativo", floor: 15, yrs: [3, 40], dims: null, risk: "Conservador", seg: ["Principal", "Private"], obj: OBJ.LON, wrapper: true }, // [D-07] mandato do perfil
  { id: "fundo-exclusivo", p: "Fundo exclusivo / fechado", ptype: "inv", tax: "comecotas", floor: 15, yrs: [5, 40], dims: null, risk: "Moderado", seg: ["Private"], obj: OBJ.LEG, wrapper: true, drag: true }, // [D-04/D-07]
  { id: "etf-intl", p: "ETF internacional (IVVB11)", ptype: "inv", tax: "etf", floor: 15, yrs: [5, 15], dims: { m: 3, c: 0, l: 0, x: 3 }, risk: "Moderado", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON }, // [B-05] piso Agressivo→Moderado (índice diversificado)
  { id: "capitalizacao", p: "Capitalização", ptype: "inv", tax: "rf", floor: 20, yrs: [1, 5], dims: { m: 0, c: 1, l: 2, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime"], obj: OBJ.LON, weak: true },
  { id: "vida-resgatavel", p: "Seguro de vida resgatável", ptype: "prot", tax: "isento", floor: 0, yrs: [0, 40], dims: null, risk: "Conservador", seg: ["Principal", "Private"], obj: OBJ.LEG },
  { id: "prestamista", p: "Seguro prestamista", ptype: "prot", tax: "semir", floor: 0, yrs: [0, 20], dims: null, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LEG }, // [A-13] +Private
  { id: "saude", p: "Plano de saúde", ptype: "prot", tax: "deducao", floor: 0, yrs: [0, 40], dims: null, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LIQ },
  { id: "seg-patrimonial", p: "Seguros patrimoniais", ptype: "prot", tax: "semir", floor: 0, yrs: [0, 40], dims: null, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LIQ },
  { id: "financ-imob", p: "Financiamento imobiliário", ptype: "cred", tax: "semir", floor: 0, yrs: [5, 35], dims: null, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LON },
  { id: "cdc", p: "CDC / crédito pessoal", ptype: "cred", tax: "semir", floor: 0, yrs: [0, 4], dims: null, risk: "Conservador", seg: ["Retail", "Prime"], obj: OBJ.LIQ },
  { id: "rotativo", p: "Rotativo / cheque especial", ptype: "cred", tax: "semir", floor: 0, yrs: [0, 1], dims: null, risk: "Conservador", seg: ["Retail", "Prime"], obj: OBJ.LIQ },
  { id: "antecipacao", p: "Antecipação 13º/restituição", ptype: "cred", tax: "semir", floor: 0, yrs: [0, 1], dims: null, risk: "Conservador", seg: ["Retail", "Prime"], obj: OBJ.LIQ },
  { id: "capital-giro", p: "Capital de giro (PJ)", ptype: "cred", tax: "semir", floor: 0, yrs: [0, 3], dims: null, risk: "Moderado", seg: ["Prime", "Principal", "Private"], obj: OBJ.LIQ },
  { id: "offshore-pj", p: "Offshore PJ (controlada)", ptype: "estr", tax: "offshore", floor: 15, yrs: [0, 40], dims: null, risk: "Moderado", seg: ["Private"], obj: OBJ.LEG },
  { id: "doacao", p: "Doação em dinheiro/bens", ptype: "estr", tax: "itcmd", floor: 8, yrs: [0, 40], dims: null, risk: "Conservador", seg: ["Principal", "Private"], obj: OBJ.LEG },
  { id: "imovel-renda", p: "Imóvel para renda", ptype: "mod", tax: "irpf", floor: 27.5, yrs: [5, 40], dims: { m: 2, c: 0, l: 3, x: 0 }, risk: "Moderado", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON, income: true },
  { id: "imovel-proprio", p: "Imóvel residencial próprio", ptype: "mod", tax: "gcprog", floor: 15, yrs: [5, 40], dims: { m: 1, c: 0, l: 3, x: 0 }, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LON },
  { id: "participacao", p: "Participação societária", ptype: "mod", tax: "pjdiv", floor: 10, yrs: [0, 40], dims: { m: 3, c: 2, l: 3, x: 0 }, risk: "Agressivo", seg: ["Principal", "Private"], obj: OBJ.LEG },
  { id: "cripto", p: "Cripto (ativos virtuais)", ptype: "mod", tax: "gcprog", floor: 15, yrs: [3, 10], dims: { m: 3, c: 0, l: 1, x: 2 }, risk: "Agressivo", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON },
  { id: "inss", p: "INSS", ptype: "mod", tax: "irpf", floor: 27.5, yrs: [10, 40], dims: null, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LON, income: true },
  { id: "veiculo", p: "Veículo (bem de uso)", ptype: "mod", tax: "semir", floor: 0, yrs: [0, 10], dims: null, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LON },
  // ---- NOVAS LINHAS v1.0 (todas status:review — ratificar Tributário/Risco antes de cliente) ----
  { id: "usd-cash", p: "Caixa em moeda forte (conta global)", ptype: "inv", tax: "offshore", floor: 15, yrs: [0, 10], dims: { m: 0, c: 0, l: 1, x: 3 }, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LON, review: true }, // [B-01] regime Lei 14.754 A CONFIRMAR (depósito não remunerado pode ser isento)
  { id: "usd-bonds", p: "RF em moeda forte (Treasuries/bonds)", ptype: "inv", tax: "offshore", floor: 15, yrs: [1, 10], dims: { m: 1, c: 0, l: 1, x: 3 }, risk: "Moderado", seg: ["Principal", "Private"], obj: OBJ.LON, dm: true, income: true, review: true }, // [B-01] escada casável na moeda do passivo
  { id: "seg-invalidez", p: "Seguro invalidez / doenças graves / DIT", ptype: "prot", tax: "isento", floor: 0, yrs: [0, 40], dims: null, risk: "Conservador", seg: ["Retail", "Prime", "Principal", "Private"], obj: OBJ.LIQ, review: true }, // [B-02] mecânica SUSEP A CONFIRMAR
  { id: "renda-vitalicia", p: "Renda vitalícia contratada (anuidade)", ptype: "prot", tax: "prev", floor: 10, yrs: [0, 40], dims: null, risk: "Conservador", seg: ["Prime", "Principal", "Private"], obj: OBJ.LON, income: true, review: true }, // [B-03] tributação da fase de renda A CONFIRMAR
  { id: "parcelamento-fatura", p: "Parcelamento de fatura (rampa de saída)", ptype: "cred", tax: "semir", floor: 0, yrs: [0, 1], dims: null, risk: "Conservador", seg: ["Retail", "Prime"], obj: OBJ.LIQ, review: true }, // [A-10/B-07]
];

// ---- Camada 3 (preview) · Estratégias candidatas ---------------------------
export const STRATEGIES = {
  "reserva-first": "Reserva antes de qualquer objetivo de risco — 1º degrau da escada (doc 04).",
  "dimensionar-reserva": "Meses de reserva por risco de renda: mais para renda variável e provedor único (flags VIS-806).",
  "gate-rotativo": "Rotativo detectado → bloqueia alocação até plano de quitação (Marcos).",
  "consolidacao-divida": "Trocar dívida cara por barata: rotativo → parcelamento de fatura / consignado / CGI / home equity.",
  "amortizar-vs-investir": "Taxa do contrato vs. retorno líquido de IR — juros não são dedutíveis no BR (Roberto).",
  "fgts-imovel": "FGTS amortiza/quita financiamento a cada 2 anos; lance em consórcio imobiliário.",
  "isencao-180d": "Vender residencial + comprar outro em 180 dias: GCAP zero (1×/5 anos) na troca de casa.",
  "escada-vencimentos": "Títulos vencendo na data de cada objetivo (José Carlos: escada IPCA+).",
  "duration-match": "Título marcado casado ao vencimento → risco de mercado colapsa (M→0).",
  "glidepath-derisk": "De-risking programado conforme o objetivo se aproxima (caps de M por fase).",
  "bucket-decumulacao": "3 baldes na aposentadoria: caixa (2a) · renda · crescimento (José Carlos/Helena).",
  "renda-isenta-decumulacao": "Renda mensal isenta: FII + FI-Infra + incentivadas + IPCA+ cupom (Helena) — p/ Conservador via mandato diversificado [A-03].",
  "asset-location": "Alocar por eficiência: tributados dentro de wrappers eficientes; isentos fora.",
  "evitar-come-cotas": "Dinheiro longo fora de fundos abertos: títulos diretos, ETF, previdência, carteira adm.",
  "harvest-isencoes": "Consumir as franquias anuais: R$20k/mês ações, R$35k/mês cripto, doação estadual.",
  "pgbl-12-completa": "Gasto de saúde alto → declaração completa vence → dedução de 12% no PGBL.",
  "vgbl-fracionado-600k": "Fracionar aportes de VGBL entre anos para não disparar o IOF de 5% (>R$600k/CPF/ano).",
  "prev-substituto-inss": "PJ/autônomo: previdência privada como substituto do INSS fraco (Thiago).",
  "consorcio-vs-cdc": "Bem depreciante: consórcio/poupança programada; nunca CDC sobre veículo.",
  "staging-soma-subita": "Herança/venda/bônus: estacionar em DI e posicionar em etapas com política (Patrícia).",
  "trio-sucessorio": "Seguro (liquidez do espólio) + previdência (bypass) + estrutura (holding/doação).",
  "seguro-dimensionado-itcmd": "Capital segurado = ITCMD + custas do inventário: herdeiros não vendem ativos (Antônio).",
  "usufruto-trava-2027": "Doar com usufruto antes das leis estaduais de 2027: trava base e alíquota de hoje.",
  "doacao-seriada-isencao": "Doações anuais dentro da isenção estadual — atenção à regra de consolidação (LC 227).",
  "holding-com-substancia": "Holding com substância e governança; ITBI limitado (Tema 796); quotas a valor de mercado (LC 227).",
  "dolarizacao-em-camadas": "X por camadas: ETF B3 → BDR → offshore direto, conforme segmento e meta em moeda.",
  "rota-liquidez-fisica": "Por ativo físico: vender (staging), alugar (renda) ou dar em garantia (CGI/home equity) — custo de carregamento no motor. [A-07]",
};

// ---- Matriz de Objetivos (20 = 19 + desmobilizacao-fisica) -------------------
// caps = teto por dimensão (produto elegível se dim ≤ cap; M sujeito a GP/DM; L sujeito a hold-to-maturity).
// Novos campos v1.0: gatedByDebt [D-03], extraIds [A-08], pisoOverrideIds [A-03], fxLiability [A-04],
// dmRolling [A-06], decumul [A-03/A-JC1], modIds [A-11].
export const GOALS = [
  { id: "reserva", name: "Reserva de emergência", need: 1, l3: OBJ.LIQ, nature: "cont", h: 1, hRange: [0, 2], flexY: 1, flexV: "needs", ptypes: ["inv"], caps: { M: 0, C: 1, L: 0, X: 0 }, gp: false, dmOn: false, funding: "Aporte até 6–12× despesas", hardRule: "1º degrau da escada: nenhum objetivo de risco antes da reserva mínima (doc 04).", triggers: "Sobra parada → reserva (A12); flags: renda variável / provedor único ampliam o alvo", strategies: ["reserva-first", "dimensionar-reserva"], personas: "Marcos, Júlia, Aline, Luana, Thiago — todos primeiro", segs: ["Retail", "Prime", "Principal", "Private"], kpi: "Meses de despesa cobertos", status: "base" },
  { id: "divida", name: "Sair da dívida cara / consolidar", need: 1, l3: OBJ.LIQ, nature: "sane", h: 1, hRange: [0, 3], flexY: 1, flexV: "needs", ptypes: ["cred"], credIds: ["consignado", "cgi", "home-equity", "parcelamento-fatura"], caps: { M: 3, C: 3, L: 3, X: 3 }, gp: false, dmOn: false, funding: "Fluxo liberado da renegociação", hardRule: "GATE sistêmico: rotativo/cheque especial detectado bloqueia qualquer alocação em investimento até existir plano de quitação (Marcos).", triggers: "Dívida cara → consolidação (A12)", strategies: ["gate-rotativo", "consolidacao-divida", "amortizar-vs-investir"], personas: "Marcos, Aline", segs: ["Retail", "Prime"], kpi: "CET médio ↓ · data de quitação", status: "base" },
  { id: "protecao-familia", name: "Proteção da família (se eu faltar)", need: 2, l3: OBJ.LEG, nature: "cont", h: 20, hRange: [0, 40], flexY: 40, flexV: "needs", ptypes: ["prot"], caps: { M: 3, C: 3, L: 3, X: 3 }, gp: false, dmOn: false, funding: "Prêmio mensal (custo, não aporte)", hardRule: "Capital segurado = passivos + n anos de renda; prestamista em todo financiamento relevante; invalidez/DIT na cobertura de provedor único [B-02].", triggers: "Lacuna de proteção → vida (A12); dependentes 2+ (flag VIS-806)", strategies: ["trio-sucessorio", "dimensionar-reserva"], personas: "Luana, Fernanda, Bruno, José Carlos", segs: ["Retail", "Prime", "Principal", "Private"], kpi: "Capital segurado / necessidade", status: "base" },
  { id: "protecao-fluxo", name: "Proteção de fluxo e balanço (saúde/patrimônio)", need: 2, l3: OBJ.LIQ, nature: "cont", h: 20, hRange: [0, 40], flexY: 40, flexV: "needs", ptypes: ["prot"], caps: { M: 3, C: 3, L: 3, X: 3 }, gp: false, dmOn: false, funding: "Mensalidade/prêmio", hardRule: "Proteção-primeiro: choque sem seguro drena a reserva ou força venda de ativos (doc 04) [C-02].", triggers: "Saúde alta → declaração completa → habilita PGBL 12%", strategies: ["pgbl-12-completa"], personas: "Fernanda, Luana, Roberto", segs: ["Retail", "Prime", "Principal", "Private"], kpi: "Coberturas ativas vs. lacunas", status: "base" },
  { id: "lar-adquirir", name: "Adquirir / trocar o lar", need: 3, l3: OBJ.LON, nature: "data", h: 5, hRange: [2, 10], flexY: 2, flexV: "needs", ptypes: ["inv", "cred"], credIds: ["financ-imob", "consorcio"], caps: { M: 1, C: 1, L: 2, X: 0 }, gp: true, dmOn: true, gatedByDebt: true, modIds: ["fgts"], funding: "Híbrido: aporte + FGTS + financiamento", hardRule: null, triggers: "Meta de entrada definida; na troca, janela de 180 dias da isenção", strategies: ["fgts-imovel", "escada-vencimentos", "isencao-180d", "consorcio-vs-cdc"], personas: "Camila & Diego, Júlia, Roberto", segs: ["Retail", "Prime", "Principal", "Private"], kpi: "% da entrada acumulada", status: "base" },
  { id: "lar-quitar", name: "Quitar o lar (amortizar vs. investir)", need: 3, l3: OBJ.LON, nature: "sane", h: 3, hRange: [1, 10], flexY: 3, flexV: "wants", ptypes: ["inv", "cred"], credIds: ["financ-imob"], caps: { M: 1, C: 1, L: 1, X: 0 }, gp: false, dmOn: true, gatedByDebt: true, modIds: ["fgts", "imovel-proprio"], funding: "Sobra mensal direcionada", hardRule: "Decisão viva: taxa do contrato vs. retorno LÍQUIDO de IR — juros não são dedutíveis no BR.", triggers: "Sobra recorrente + financiamento ativo (Roberto)", strategies: ["amortizar-vs-investir", "fgts-imovel"], personas: "Roberto", segs: ["Retail", "Prime", "Principal"], kpi: "Δ líquido amortizar vs. investir (motor)", status: "base" },
  { id: "educacao", name: "Educação dos filhos", need: 4, l3: OBJ.LON, nature: "data", h: 10, hRange: [3, 18], flexY: 0, flexV: "needs", ptypes: ["inv"], caps: { M: 2, C: 1, L: 2, X: 1 }, gp: true, dmOn: true, gatedByDebt: true, funding: "Aporte mensal (sleeve dedicada)", hardRule: "Data DURA (vestibular não espera): glidepath obrigatório; flexibilidade de prazo zero.", triggers: "Nascimento/idade do filho define a data-âncora", strategies: ["duration-match", "glidepath-derisk", "escada-vencimentos"], personas: "Luana, Fernanda, Ricardo, Camila & Diego", segs: ["Retail", "Prime", "Principal", "Private"], kpi: "% do custo-alvo financiado", status: "base" },
  { id: "cuidado-vitalicio", name: "Cuidado vitalício (perpetuidade médica)", need: 4, l3: OBJ.LON, nature: "fluxo", h: 30, hRange: [10, 40], flexY: 40, flexV: "needs", ptypes: ["inv", "prot", "estr"], caps: { M: 2, C: 1, L: 1, X: 0 }, gp: false, dmOn: true, dmRolling: true, gatedByDebt: true, funding: "Fundo ring-fenced + seguro que o capitaliza + estrutura administrada em benefício do dependente", hardRule: "Fluxo perpétuo que cresce acima do IPCA (inflação médica): dual-sleeve — núcleo IPCA+ em escada rolada (casada ao fluxo) + satélite de crescimento limitado a M2; ring-fence, não misturar com outras metas. [A-06]", triggers: "Dependente com cuidado contínuo (Fernanda)", strategies: ["renda-isenta-decumulacao", "duration-match", "trio-sucessorio", "escada-vencimentos"], personas: "Fernanda", segs: ["Prime", "Principal", "Private"], kpi: "Fluxo perpétuo coberto vs. inflação médica (motor)", status: "review" },
  { id: "aposentadoria", name: "Aposentadoria / independência", need: 5, l3: OBJ.LON, nature: "fluxo", h: 25, hRange: [10, 40], flexY: 5, flexV: "needs", ptypes: ["inv"], caps: { M: 3, C: 2, L: 3, X: 3 }, gp: true, dmOn: true, gatedByDebt: true, modIds: ["inss"], funding: "Aporte % da renda (teto = sobra, VIS-801)", hardRule: null, triggers: "Horizonte longo + sucessão → previdência (A12); gap vs. INSS projetado", strategies: ["pgbl-12-completa", "asset-location", "evitar-come-cotas", "glidepath-derisk", "prev-substituto-inss", "vgbl-fracionado-600k", "dolarizacao-em-camadas"], personas: "Ricardo, Thiago, José Carlos", segs: ["Retail", "Prime", "Principal", "Private"], kpi: "Gap = despesa desejada − INSS projetado (motor)", status: "base" }, // [A-05] X 2→3
  { id: "renda-decumulacao", name: "Viver de renda (decumulação)", need: 5, l3: OBJ.LON, nature: "fluxo", h: 2, hRange: [0, 40], flexY: 40, flexV: "needs", ptypes: ["inv"], extraIds: ["renda-vitalicia"], caps: { M: 2, C: 2, L: 1, X: 1 }, gp: false, dmOn: true, decumul: true, gatedByDebt: true, pisoOverrideIds: ["fii", "fi-infra", "fiagro", "deb-inc", "cri-cra"], modIds: ["inss", "imovel-renda"], funding: "Estoque acumulado → renda", hardRule: "2 anos de gastos sempre em liquidez (balde 1); renda antes de crescimento; kit isento p/ Conservador SÓ via mandato diversificado (concentração vetada) [A-03].", triggers: "Transição saldo → renda (José Carlos); renda durável à prova de inflação (Helena)", strategies: ["bucket-decumulacao", "renda-isenta-decumulacao", "escada-vencimentos", "harvest-isencoes"], personas: "Helena, José Carlos", segs: ["Prime", "Principal", "Private"], kpi: "Renda real mensal sustentável (motor)", status: "base" },
  { id: "veiculo-troca", name: "Trocar de veículo", need: 6, l3: OBJ.LON, nature: "data", h: 3, hRange: [1, 6], flexY: 1, flexV: "wants", ptypes: ["inv", "cred"], credIds: ["consorcio"], caps: { M: 0, C: 1, L: 2, X: 0 }, gp: false, dmOn: true, gatedByDebt: true, funding: "Aporte programado ou consórcio", hardRule: "CDC sobre bem depreciante (−12% real) é a pior combinação da matriz.", triggers: "Idade/km do veículo atual", strategies: ["consorcio-vs-cdc", "escada-vencimentos"], personas: "Camila & Diego, Ricardo", segs: ["Retail", "Prime", "Principal", "Private"], kpi: "% do valor-alvo", status: "base" },
  { id: "projeto-pessoal", name: "Projeto pessoal (viagem, casamento, sabático)", need: 6, l3: OBJ.LIQ, nature: "data", h: 2, hRange: [1, 4], flexY: 1, flexV: "wishes", ptypes: ["inv"], caps: { M: 1, C: 1, L: 1, X: 0 }, gp: false, dmOn: true, gatedByDebt: true, funding: "Poupança por meta (anti-deriva)", hardRule: null, triggers: "Controlar o creep discricionário: meta nomeada em vez de gasto difuso (doc 02)", strategies: ["escada-vencimentos", "duration-match"], personas: "Camila & Diego, Ricardo, Patrícia", segs: ["Retail", "Prime", "Principal", "Private"], kpi: "% da meta", status: "base" },
  { id: "alocar-subita", name: "Alocar soma súbita (herança, venda, bônus)", need: 6, l3: OBJ.LON, nature: "evento", h: 1, hRange: [0, 3], flexY: 2, flexV: "wants", ptypes: ["inv"], caps: { M: 1, C: 1, L: 1, X: 0 }, gp: false, dmOn: false, gatedByDebt: true, funding: "Estoque a posicionar (staging)", hardRule: "Política de staging: estacionar em DI e posicionar em etapas — nunca all-in num dia (Patrícia: pilha de 35% em DI).", triggers: "Evento de liquidez detectado; política de bônus (Ricardo)", strategies: ["staging-soma-subita", "asset-location", "harvest-isencoes"], personas: "Patrícia, Ricardo, Antônio", segs: ["Principal", "Private"], kpi: "% posicionado conforme política-destino", status: "base" },
  { id: "meta-fx", name: "Meta em moeda estrangeira (educação fora, morar fora)", need: 4, l3: OBJ.LON, nature: "data", h: 8, hRange: [3, 20], flexY: 2, flexV: "wants", ptypes: ["inv", "estr"], caps: { M: 3, C: 2, L: 2, X: 3 }, gp: true, dmOn: true, fxLiability: true, gatedByDebt: true, funding: "Aporte em ativos na moeda do passivo", hardRule: "A moeda do objetivo define o X: ter câmbio É o hedge — X alto é requisito. De-risking correto acontece DENTRO da moeda (glidepath só aperta M dos ativos sem câmbio; RF em moeda forte é o porto). [A-04]", triggers: "Meta com passivo em moeda forte (Ricardo: educação no exterior)", strategies: ["dolarizacao-em-camadas", "glidepath-derisk", "escada-vencimentos"], personas: "Ricardo, Patrícia, Antônio", segs: ["Prime", "Principal", "Private"], kpi: "% da meta na moeda do passivo", status: "review" },
  { id: "negocio-capital", name: "Capitalizar o negócio próprio", need: 6, l3: OBJ.LON, nature: "data", h: 4, hRange: [1, 10], flexY: 2, flexV: "wants", ptypes: ["inv", "cred"], credIds: ["capital-giro"], caps: { M: 1, C: 2, L: 2, X: 0 }, gp: false, dmOn: true, gatedByDebt: true, funding: "Sobra PF + crédito PJ na fronteira certa", hardRule: "Fronteira PF×PJ: pró-labore disciplinado; caixa da empresa não é patrimônio pessoal (Thiago).", triggers: "Renda irregular + reserva ampliada antes de arriscar capital próprio", strategies: ["amortizar-vs-investir", "dimensionar-reserva"], personas: "Thiago, Bruno, Patrícia", segs: ["Prime", "Principal", "Private"], kpi: "Capital disponível sem contaminar a PF", status: "review" },
  { id: "sucessao", name: "Sucessão organizada (menor vazamento)", need: 7, l3: OBJ.LEG, nature: "estrut", h: 20, hRange: [0, 40], flexY: 40, flexV: "needs", ptypes: ["estr", "prot", "inv"], caps: { M: 2, C: 2, L: 3, X: 2 }, gp: false, dmOn: false, funding: "Estrutura + prêmios + realocação", hardRule: "Janela fechando: leis estaduais do ITCMD progressivo valem a partir de 2027 — travar base/alíquota de hoje.", triggers: "Horizonte longo + sucessão → previdência (A12); patrimônio imobilizado/quotas", strategies: ["trio-sucessorio", "usufruto-trava-2027", "holding-com-substancia", "evitar-come-cotas"], personas: "Antônio, Patrícia, Helena, José Carlos", segs: ["Principal", "Private"], kpi: "% do patrimônio com rota sucessória definida", status: "base" },
  { id: "sucessao-negocio", name: "Sucessão do negócio (manter vs. vender)", need: 7, l3: OBJ.LEG, nature: "estrut", h: 5, hRange: [2, 15], flexY: 3, flexV: "needs", ptypes: ["estr"], caps: { M: 3, C: 3, L: 3, X: 2 }, gp: false, dmOn: false, modIds: ["participacao"], funding: "Estrutura societária + eventual liquidez de venda", hardRule: "Quotas entram no ITCMD a VALOR DE MERCADO (LC 227) — a avaliação contábil morreu; valuation é pré-requisito.", triggers: "Fundador 60+ / dependência do dono (Bruno); participação concentrada (Patrícia)", strategies: ["holding-com-substancia", "usufruto-trava-2027", "staging-soma-subita"], personas: "Bruno, Patrícia, Antônio", segs: ["Principal", "Private"], kpi: "Rota definida: manter (governança) ou vender (staging)", status: "review" },
  { id: "liquidez-espolio", name: "Liquidez do espólio (ITCMD e custas)", need: 7, l3: OBJ.LEG, nature: "cont", h: 20, hRange: [0, 40], flexY: 40, flexV: "needs", ptypes: ["prot", "inv"], extraIds: ["prev-suc"], caps: { M: 0, C: 1, L: 1, X: 0 }, gp: false, dmOn: false, funding: "Prêmio de seguro dimensionado + previdência-bypass", hardRule: "Sem liquidez, herdeiros vendem ativos com pressa e desconto: seguro + previdência (fora do inventário) pagam o ITCMD, não o espólio. [A-08]", triggers: "Patrimônio imobilizado alto vs. caixa (Antônio)", strategies: ["seguro-dimensionado-itcmd", "trio-sucessorio"], personas: "Antônio", segs: ["Principal", "Private"], kpi: "ITCMD + custas estimados cobertos (motor)", status: "base" },
  { id: "doacao-vida", name: "Doar em vida / filantropia", need: 7, l3: OBJ.LEG, nature: "estrut", h: 10, hRange: [0, 40], flexY: 40, flexV: "wishes", ptypes: ["estr"], caps: { M: 3, C: 3, L: 3, X: 3 }, gp: false, dmOn: false, funding: "Excedente após needs/wants", hardRule: null, triggers: "Isenção anual estadual como capacidade consumível; regra de consolidação (LC 227) a monitorar", strategies: ["doacao-seriada-isencao", "usufruto-trava-2027", "harvest-isencoes"], personas: "Antônio, Helena", segs: ["Principal", "Private"], kpi: "Isenção anual utilizada", status: "review" },
  // ---- NOVO v1.0 [A-07] ----
  { id: "desmobilizacao-fisica", name: "Desmobilizar patrimônio físico (rota de liquidez)", need: 7, l3: OBJ.LEG, nature: "estrut", h: 5, hRange: [1, 15], flexY: 3, flexV: "wants", ptypes: ["inv", "cred", "estr"], credIds: ["cgi", "home-equity"], caps: { M: 1, C: 1, L: 2, X: 0 }, gp: false, dmOn: false, modIds: ["imovel-renda", "imovel-proprio", "participacao"], funding: "Venda programada (staging) / aluguel / crédito-ponte sobre o ativo", hardRule: "A iliquidez do balanço é a causa-raiz do risco de espólio: cada ativo físico precisa de rota — vender, alugar ou dar em garantia. Valuation e custo de carregamento são do motor. [A-07]", triggers: "Patrimônio físico ≫ financeiro (Antônio: R$55M/R$80M); pós-venda alimenta alocar-subita", strategies: ["rota-liquidez-fisica", "staging-soma-subita", "holding-com-substancia", "seguro-dimensionado-itcmd"], personas: "Antônio, Patrícia", segs: ["Principal", "Private"], kpi: "% do balanço físico com rota de liquidez definida", status: "review" },
];

// ---- Motor de elegibilidade v1.0 ---------------------------------------------
function capMByPhase(h) { return h >= 10 ? 3 : h >= 5 ? 2 : h >= 2 ? 1 : 0; }

// [D-03] Gate de objetivo (escada mecanizada). ctx.flags = { dividaCara, reservaOk, protecaoOk }
// alimentadas pela jornada (A12) / dados do cliente. Gate duro: dívida cara. Avisos: reserva, proteção.
export function evalGoalGate(goal, ctx) {
  const flags = ctx.flags || {};
  const warnings = [];
  if (flags.dividaCara && goal.gatedByDebt) {
    return { gated: true, reason: "GATE da escada: dívida cara ativa (rotativo/cheque especial) — quitar/consolidar antes de alocar (doc 04 · objetivo 'divida').", warnings };
  }
  if (flags.reservaOk === false && goal.gatedByDebt) warnings.push("Reserva mínima incompleta — 1º degrau da escada antes de metas de risco (doc 04).");
  if (flags.protecaoOk === false && goal.need >= 4) warnings.push("Proteção (necessidades 1–2) incompleta — priorizar cobertura antes de metas longas (doc 04).");
  return { gated: false, reason: null, warnings };
}

export function evalProduct(prod, goal, ctx) {
  const reasons = [];
  const flagsOut = [];
  const inScope = goal.ptypes.includes(prod.ptype) || (goal.extraIds || []).includes(prod.id); // [A-08]
  if (!inScope) reasons.push(`tipo ${PTYPE[prod.ptype].label.toLowerCase()} fora do escopo`);
  else if (prod.ptype === "cred" && !(goal.credIds || []).includes(prod.id)) reasons.push("crédito não mapeado para este objetivo (entra por indicação explícita)");
  if (!prod.seg.includes(ctx.seg)) reasons.push("fora do segmento");
  // [D-02] Piso de risco NÃO se aplica a estruturas/proteção nem a wrappers (mandato enquadra).
  // [A-03] Override de piso por objetivo (decumulação) com flag de mandato obrigatória.
  const floorExempt = prod.ptype === "estr" || prod.ptype === "prot" || prod.wrapper;
  const floorOverridden = (goal.pisoOverrideIds || []).includes(prod.id) && RLV[prod.risk] === RLV[ctx.profile] + 1;
  if (!floorExempt && !floorOverridden && RLV[prod.risk] > RLV[ctx.profile]) reasons.push(`piso ${prod.risk} > perfil`);
  if (floorOverridden && RLV[prod.risk] > RLV[ctx.profile]) flagsOut.push("piso: override de decumulação — exigir diversificação via mandato [A-03]");
  const h = ctx.h;
  // Gate unilateral de janela (produto mais curto é rolável — penaliza no score, exceto decumulação).
  if (prod.ptype !== "cred" && prod.yrs[0] > h + goal.flexY) reasons.push(`início mínimo ${prod.yrs[0]}a além do horizonte ${h}a (±${goal.flexY})`);
  let dmApplied = false;
  let lMatched = false;
  // [D-07] Wrappers herdam o mandato do perfil (dims dinâmicos) — caps SEMPRE se aplicam.
  const dims = prod.wrapper ? MANDATE[ctx.profile] : prod.dims;
  if (dims) {
    // [A-06] dmRolling: escada rolada casa quando o horizonte cobre a janela mínima do título.
    dmApplied = goal.dmOn && !!prod.dm && (goal.dmRolling ? h >= prod.yrs[0] : (prod.yrs[0] <= h && h <= prod.yrs[1]));
    const mEff = dmApplied ? 0 : dims.m;
    // [A-04] fxLiability: glidepath aperta M só dos ativos SEM câmbio (x ≤ 1) — o hedge não é de-risked p/ fora da moeda.
    const gpApplies = goal.gp && !(goal.fxLiability && dims.x >= 2);
    const capM = Math.min(goal.caps.M, gpApplies ? capMByPhase(h) : 3);
    if (mEff > capM) reasons.push(`mercado M${dims.m} > cap M${capM}${gpApplies ? " (glidepath)" : ""}`);
    if (dims.c > goal.caps.C) reasons.push(`crédito C${dims.c} > cap C${goal.caps.C}`);
    // [A-09] Hold-to-maturity: vencimento casável dentro do objetivo → L efetivo 0.
    lMatched = goal.dmOn && !!prod.matchableL && h >= prod.yrs[0];
    const lEff = lMatched ? 0 : dims.l;
    if (lEff > goal.caps.L) reasons.push(`liquidez L${dims.l} > cap L${goal.caps.L}`);
    if (dims.x > goal.caps.X) reasons.push(`câmbio X${dims.x} > cap X${goal.caps.X}`);
  }
  return { ok: reasons.length === 0, reasons, dmApplied, lMatched, flags: flagsOut };
}

// [D-08] Função de score CANÔNICA — a visão Pinpoint (Matriz de Produtos) consome ESTA função.
export function scoreProduct(prod, goal, ctx, dmApplied) {
  let s = 0;
  s += prod.obj === goal.l3 ? 15 : 6; // 3L primário do produto (sinal fraco)
  const h = ctx.h;
  // [A-JC1] Decumulação é multi-horizonte por definição: sem penalidade de distância.
  if (goal.decumul) {
    s += 30;
  } else {
    const inside = prod.yrs[0] <= h && h <= prod.yrs[1];
    const dist = inside ? 0 : Math.min(Math.abs(h - prod.yrs[0]), Math.abs(h - prod.yrs[1]));
    s += Math.max(0, 30 - 6 * dist); // aderência de horizonte (rolagem penaliza aqui)
  }
  // [D-05] Metas com trajetória (data dura OU gp+dm): bônus fiscal pleno só p/ instrumento datável.
  const dateLike = goal.nature === "data" || (goal.gp && goal.dmOn);
  const datable = !!prod.dm || !!prod.matchableL;
  const fiscalMax = dateLike && !datable ? 10 : 30;
  s += Math.min(fiscalMax, Math.round((1 - Math.min(prod.floor, 27.5) / 27.5) * 30)); // eficiência fiscal LP
  const dp = RLV[ctx.profile] - RLV[prod.risk];
  s += dp === 0 ? 20 : dp === 1 ? 12 : 6; // proximidade do piso
  if (dmApplied) s += dateLike ? 20 : 5; // [D-05] duration match domina em meta datada (era +5)
  if (goal.decumul && prod.income) s += 15; // renda recorrente vale em decumulação
  if (prod.weak) s -= 20; // "popular e financeiramente fraco" (doc 02)
  if (prod.drag && h >= 3) s -= 20; // [D-04] come-cotas: arrasto relevante a partir do médio prazo
  return Math.max(0, Math.min(100, s));
}

// [D-01] Veto duro de suitability p/ a visão de PRODUTOS (Pinpoint): investimento/modelado acima do
// perfil NUNCA é recomendável (RCVM 30 art. 7º) — sem rótulo "Ótima", sem ranking. Wrappers isentos (mandato enquadra).
export function suitabilityVeto(prod, profile) {
  const gated = (prod.ptype === "inv" || prod.ptype === "mod") && !prod.wrapper;
  return gated && RLV[prod.risk] > RLV[profile];
}

// ---- UI atoms ---------------------------------------------------------------
function Badge({ label, fg, bg }) {
  return <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 700, color: fg, background: bg, padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap" }}>{label}</span>;
}
function Chip({ label }) {
  return <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: "#6B5B4E", background: "#F3ECE3", padding: "1px 6px", borderRadius: 999, border: `1px solid ${C.line}` }}>{label}</span>;
}
const lblStyle = { fontFamily: SANS, fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase", color: "#8A7A6B", marginBottom: 5 };
const selStyle = { fontFamily: SANS, fontSize: 12.5, padding: "6px 10px", border: `1px solid ${C.line}`, borderRadius: 8, background: C.ivory, color: C.ink, cursor: "pointer" };
function DetailLabel({ children }) {
  return <div style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>{children}</div>;
}
function FlagToggle({ label, active, danger, onClick }) {
  return (
    <button onClick={onClick} style={{ fontFamily: SANS, fontSize: 11, fontWeight: active ? 800 : 600, color: active ? (danger ? "#7A1420" : "#0E6B43") : "#8A7A6B", background: active ? (danger ? "#F5E3E3" : "#E4F1E9") : C.ivory, border: `1px solid ${active ? (danger ? "#E3C3C3" : "#BFDCC9") : C.line}`, borderRadius: 999, padding: "5px 11px", cursor: "pointer" }}>
      {label}
    </button>
  );
}

export default function App() {
  const [profile, setProfile] = useState("Moderado");
  const [seg, setSeg] = useState("Principal");
  const [open, setOpen] = useState(null);
  const [hOverride, setHOverride] = useState({});
  const [showBlocked, setShowBlocked] = useState(false);
  const [fNeed, setFNeed] = useState("Todas");
  const [fL3, setFL3] = useState("Todos");
  // [D-03] Flags da escada — na jornada real, vêm dos dados do cliente (A12/VIS-806).
  const [flags, setFlags] = useState({ dividaCara: false, reservaOk: true, protecaoOk: true });

  const goals = useMemo(() => GOALS.filter((g) =>
    (fNeed === "Todas" || g.need === Number(fNeed)) && (fL3 === "Todos" || g.l3 === fL3)
  ), [fNeed, fL3]);

  const th = { fontFamily: SANS, fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "#8A7A6B", textAlign: "left", padding: "9px 10px", borderBottom: `2px solid ${C.line}`, whiteSpace: "nowrap", position: "sticky", top: 0, background: C.ivory, zIndex: 2 };
  const td = { fontFamily: SANS, fontSize: 12.5, color: C.ink, padding: "10px", borderBottom: `1px solid ${C.line}`, verticalAlign: "top" };

  return (
    <div style={{ background: C.ivory, minHeight: "100vh", padding: "22px 20px 60px", color: C.ink }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Nunito+Sans:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box} ::selection{background:${C.gold}44}
        .grow:hover{background:#FCF9F4}
        input:focus,select:focus{outline:2px solid ${C.gold}66;outline-offset:1px}
      `}</style>

      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, borderBottom: `2px solid ${C.oxblood}`, paddingBottom: 14, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: C.gold }}>Projeto Vision · Goal-based · Camada 2 · v1.0</div>
            <h1 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, margin: "4px 0 3px", color: C.oxblood, lineHeight: 1.1 }}>Matriz de Objetivos</h1>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: "#6B5B4E" }}>7 necessidades (doc 04) → {GOALS.length} objetivos → política de risco → elegibilidade sobre as {PRODUCTS.length} linhas da prateleira. Correções da auditoria CFP × 14 personas aplicadas.</div>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-end" }}>
            {[[OBJ.LIQ], [OBJ.LON], [OBJ.LEG]].map(([o]) => (
              <div key={o} style={{ textAlign: "right" }}>
                <div style={{ fontFamily: SERIF, fontSize: 24, color: OBJ_STYLE[o].dot, fontWeight: 600 }}>{GOALS.filter((g) => g.l3 === o).length}</div>
                <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "#8A7A6B" }}>{o}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Contexto do cliente + filtros + flags da escada */}
        <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 14, display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-end" }}>
          <div>
            <div style={lblStyle}>Perfil do cliente (VIS-806)</div>
            <div style={{ display: "flex", gap: 4 }}>
              {PROFILES.map((p) => (
                <button key={p} onClick={() => setProfile(p)} style={{ fontFamily: SANS, fontSize: 12, fontWeight: profile === p ? 800 : 600, color: profile === p ? C.ivory : "#6B5B4E", background: profile === p ? C.navy : C.ivory, border: `1px solid ${profile === p ? C.navy : C.line}`, borderRadius: 7, padding: "6px 11px", cursor: "pointer" }}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <div style={lblStyle}>Segmento</div>
            <select value={seg} onChange={(e) => setSeg(e.target.value)} style={selStyle}>{SEGMENTS.map((s) => <option key={s}>{s}</option>)}</select>
          </div>
          <div>
            <div style={lblStyle}>Necessidade (doc 04)</div>
            <select value={fNeed} onChange={(e) => setFNeed(e.target.value)} style={selStyle}>
              <option value="Todas">Todas</option>
              {Object.entries(NEEDS).map(([k, v]) => <option key={k} value={k}>{k} · {v}</option>)}
            </select>
          </div>
          <div>
            <div style={lblStyle}>3L</div>
            <select value={fL3} onChange={(e) => setFL3(e.target.value)} style={selStyle}>
              <option>Todos</option>{Object.values(OBJ).map((o) => <option key={o}>{o}</option>)}
            </select>
          </div>
          <div>
            <div style={lblStyle}>Flags da escada (jornada A12) · D-03</div>
            <div style={{ display: "flex", gap: 6 }}>
              <FlagToggle label={flags.dividaCara ? "⚠ dívida cara ativa" : "sem dívida cara"} active={flags.dividaCara} danger onClick={() => setFlags({ ...flags, dividaCara: !flags.dividaCara })} />
              <FlagToggle label={flags.reservaOk ? "reserva ok" : "reserva incompleta"} active={flags.reservaOk} onClick={() => setFlags({ ...flags, reservaOk: !flags.reservaOk })} />
              <FlagToggle label={flags.protecaoOk ? "proteção ok" : "proteção incompleta"} active={flags.protecaoOk} onClick={() => setFlags({ ...flags, protecaoOk: !flags.protecaoOk })} />
            </div>
          </div>
          <div style={{ marginLeft: "auto", fontFamily: SANS, fontSize: 12, color: "#8A7A6B", paddingBottom: 4 }}>{goals.length} de {GOALS.length} objetivos · horizonte ajustável por objetivo</div>
        </div>

        {/* Tabela de objetivos */}
        <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: 1180 }}>
              <thead>
                <tr>
                  <th style={{ ...th, minWidth: 230 }}>Objetivo</th>
                  <th style={th}>Nec.</th>
                  <th style={th}>3L</th>
                  <th style={th}>Natureza</th>
                  <th style={th}>Horizonte</th>
                  <th style={th}>Prioridade</th>
                  <th style={th}>Política (caps)</th>
                  <th style={th}>Tipos</th>
                  <th style={th}>Funding</th>
                  <th style={th}>Status</th>
                  <th style={{ ...th, width: 30 }} />
                </tr>
              </thead>
              <tbody>
                {goals.map((g) => {
                  const isOpen = open === g.id;
                  const h = hOverride[g.id] ?? g.h;
                  const ctx = { profile, seg, h, flags };
                  const gate = evalGoalGate(g, ctx);
                  const evals = isOpen && !gate.gated ? PRODUCTS.map((p) => ({ p, r: evalProduct(p, g, ctx) })) : [];
                  const ok = evals.filter((e) => e.r.ok).map((e) => ({ ...e, s: scoreProduct(e.p, g, ctx, e.r.dmApplied) })).sort((a, b) => b.s - a.s);
                  const blocked = evals.filter((e) => !e.r.ok);
                  const modHeld = (g.modIds || []).map((id) => PRODUCTS.find((p) => p.id === id)).filter(Boolean);
                  return (
                    <React.Fragment key={g.id}>
                      <tr className="grow" style={{ cursor: "pointer", background: isOpen ? "#FCF9F4" : undefined }} onClick={() => setOpen(isOpen ? null : g.id)}>
                        <td style={td}>
                          <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 800, color: C.oxblood, lineHeight: 1.2 }}>{g.name}</div>
                          <div style={{ fontFamily: SANS, fontSize: 10.5, color: "#9A8A7B", marginTop: 2 }}>{g.personas}</div>
                        </td>
                        <td style={td}><span title={NEEDS[g.need]} style={{ fontFamily: SERIF, fontSize: 15, fontWeight: 600, color: C.navy }}>{g.need}</span></td>
                        <td style={td}><Badge label={g.l3} fg={OBJ_STYLE[g.l3].fg} bg={OBJ_STYLE[g.l3].bg} /></td>
                        <td style={{ ...td, fontSize: 11.5, color: "#6B5B4E" }}>{NATURE[g.nature]}</td>
                        <td style={td}>
                          <div style={{ fontWeight: 700, fontSize: 12 }}>{h}a {g.flexY >= 40 ? "· aberto" : `±${g.flexY}`}</div>
                          <div style={{ fontSize: 10, color: "#9A8A7B" }}>{g.hRange[0]}–{g.hRange[1]}a{g.flexY === 0 ? " · data dura" : ""}</div>
                        </td>
                        <td style={{ ...td, fontSize: 11.5, color: "#6B5B4E" }}>{FLEXV[g.flexV]}</td>
                        <td style={td}>
                          <div style={{ fontFamily: MONO, fontSize: 10.5, color: C.ink }}>M{g.caps.M}·C{g.caps.C}·L{g.caps.L}·X{g.caps.X}</div>
                          <div style={{ fontSize: 9.5, color: "#9A8A7B", marginTop: 1 }}>{g.gp ? "⇢ glidepath " : ""}{g.dmOn ? "⌁ duration match" : ""}{g.fxLiability ? " · X=hedge" : ""}{!g.gp && !g.dmOn ? "—" : ""}</div>
                        </td>
                        <td style={td}><div style={{ display: "flex", gap: 4 }}>{g.ptypes.map((t) => <span key={t} title={PTYPE[t].label} style={{ width: 8, height: 8, borderRadius: 999, background: PTYPE[t].dot, display: "inline-block" }} />)}</div></td>
                        <td style={{ ...td, fontSize: 11, color: "#6B5B4E", maxWidth: 170 }}>{g.funding}</td>
                        <td style={td}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: SANS, fontSize: 10.5, fontWeight: 700, color: g.status === "review" ? "#9A4A06" : "#0E6B43" }}>
                            <span style={{ width: 7, height: 7, borderRadius: 999, background: g.status === "review" ? "#D9822B" : "#2FA36B" }} />
                            {g.status === "review" ? "A validar" : "Base regra"}
                          </span>
                        </td>
                        <td style={{ ...td, color: "#B8A794" }}>{isOpen ? "▾" : "▸"}</td>
                      </tr>
                      {isOpen && (
                        <tr>
                          <td colSpan={11} style={{ background: "#FBF7F0", borderBottom: `1px solid ${C.line}`, padding: "16px 18px" }}>
                            {/* [D-03] Banner de gate da escada */}
                            {gate.gated && (
                              <div style={{ background: "#F5E3E3", border: `1px solid #E3C3C3`, borderRadius: 8, padding: "10px 12px", marginBottom: 12 }}>
                                <div style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase", color: "#7A1420", marginBottom: 3 }}>Objetivo bloqueado pela escada</div>
                                <div style={{ fontFamily: SERIF, fontSize: 13, lineHeight: 1.45, color: "#5A1018" }}>{gate.reason}</div>
                              </div>
                            )}
                            {!gate.gated && gate.warnings.map((w, i) => (
                              <div key={i} style={{ background: "#F5EBDD", border: `1px solid #E3D3B3`, borderRadius: 8, padding: "8px 11px", marginBottom: 8, fontFamily: SANS, fontSize: 12, color: "#6B4A06" }}>⚠ {w}</div>
                            ))}
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1.5fr 1fr", gap: 22 }}>
                              {/* Regras & gatilhos */}
                              <div>
                                {g.hardRule && (
                                  <div style={{ background: "#F5E3E3", border: `1px solid #E3C3C3`, borderRadius: 8, padding: "9px 11px", marginBottom: 10 }}>
                                    <div style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase", color: "#7A1420", marginBottom: 3 }}>Regra dura</div>
                                    <div style={{ fontFamily: SERIF, fontSize: 13, lineHeight: 1.45, color: "#5A1018" }}>{g.hardRule}</div>
                                  </div>
                                )}
                                <DetailLabel>Necessidade-mãe (doc 04)</DetailLabel>
                                <div style={{ fontFamily: SANS, fontSize: 12.5, color: C.ink, marginBottom: 10 }}>{g.need}. {NEEDS[g.need]}</div>
                                <DetailLabel>Gatilhos / sinais</DetailLabel>
                                <div style={{ fontFamily: SANS, fontSize: 12, color: "#6B5B4E", lineHeight: 1.5, marginBottom: 10 }}>{g.triggers}</div>
                                <DetailLabel>KPI (motor)</DetailLabel>
                                <div style={{ fontFamily: SANS, fontSize: 12, color: "#6B5B4E", marginBottom: 10 }}>{g.kpi}</div>
                                <DetailLabel>Segmentos</DetailLabel>
                                <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>{g.segs.map((s) => <Chip key={s} label={s} />)}</div>
                              </div>
                              {/* Cruzamento: elegibilidade */}
                              <div>
                                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                                  <DetailLabel>Produtos elegíveis · {profile} · {seg}</DetailLabel>
                                  <label style={{ fontFamily: SANS, fontSize: 11, color: "#6B5B4E", display: "flex", alignItems: "center", gap: 6 }}>
                                    horizonte
                                    <input type="number" min={0} max={40} value={h} onChange={(e) => setHOverride({ ...hOverride, [g.id]: Math.max(0, Math.min(40, Number(e.target.value))) })} onClick={(e) => e.stopPropagation()} style={{ width: 54, fontFamily: SANS, fontSize: 12, padding: "3px 6px", border: `1px solid ${C.line}`, borderRadius: 6, background: C.paper }} /> anos
                                  </label>
                                </div>
                                {gate.gated && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13, color: "#8A7A6B" }}>Elegibilidade suspensa: resolver o gate da escada primeiro (objetivo "divida").</div>}
                                {!gate.gated && ok.length === 0 && <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13, color: "#8A7A6B" }}>Nenhum produto passa nos gates com este contexto — ajuste horizonte/perfil/segmento.</div>}
                                {!gate.gated && ok.slice(0, 12).map(({ p, s, r }) => (
                                  <div key={p.id} style={{ display: "flex", alignItems: "center", gap: 8, padding: "5px 0", borderBottom: `1px dashed ${C.line}` }}>
                                    <span style={{ width: 7, height: 7, borderRadius: 999, background: PTYPE[p.ptype].dot, flexShrink: 0 }} />
                                    <span style={{ fontFamily: SANS, fontSize: 12.5, fontWeight: 700, color: C.ink, minWidth: 170 }}>{p.p}{p.review ? " *" : ""}</span>
                                    <div style={{ flex: 1, height: 5, background: "#EFE7DC", borderRadius: 999, overflow: "hidden" }}>
                                      <div style={{ width: `${s}%`, height: "100%", background: s >= 80 ? C.gold : s >= 60 ? C.navy : "#C9BBA9" }} />
                                    </div>
                                    <span style={{ fontFamily: SERIF, fontSize: 13, fontWeight: 600, color: s >= 60 ? C.oxblood : "#8A7A6B", width: 26, textAlign: "right" }}>{s}</span>
                                    <span style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 700, color: "#6B5B4E", width: 96 }}>{TAXL[p.tax]}</span>
                                    <span style={{ fontFamily: MONO, fontSize: 9.5, color: p.floor === 0 ? "#0E6B43" : "#9A8A7B", width: 40, textAlign: "right" }}>{String(p.floor).replace(".", ",")}%</span>
                                    {r.dmApplied && <span title="duration match aplicado: M→0" style={{ fontFamily: SANS, fontSize: 9, fontWeight: 800, color: C.navy, background: "#E8EAF2", borderRadius: 4, padding: "1px 5px" }}>⌁ casado</span>}
                                    {r.lMatched && <span title="hold-to-maturity: vencimento casado ao objetivo → L→0 [A-09]" style={{ fontFamily: SANS, fontSize: 9, fontWeight: 800, color: "#0E6B43", background: "#E4F1E9", borderRadius: 4, padding: "1px 5px" }}>⌁ venc.</span>}
                                    {r.flags.length > 0 && <span title={r.flags.join(" · ")} style={{ fontFamily: SANS, fontSize: 9, fontWeight: 800, color: "#9A4A06", background: "#F5EBDD", borderRadius: 4, padding: "1px 5px" }}>mandato</span>}
                                    {p.weak && <span title="popular, mas financeiramente fraco (doc 02): −20 no score" style={{ fontFamily: SANS, fontSize: 9, fontWeight: 800, color: "#9A4A06", background: "#F5EBDD", borderRadius: 4, padding: "1px 5px" }}>fraco · doc 02</span>}
                                    {p.drag && ctx.h >= 3 && <span title="come-cotas: arrasto fiscal no médio/longo prazo [D-04]" style={{ fontFamily: SANS, fontSize: 9, fontWeight: 800, color: "#9A4A06", background: "#F5EBDD", borderRadius: 4, padding: "1px 5px" }}>come-cotas</span>}
                                  </div>
                                ))}
                                {!gate.gated && modHeld.length > 0 && (
                                  <div style={{ marginTop: 10 }}>
                                    <DetailLabel>Base do plano (detido · mapeável, não recomendável) · A-11</DetailLabel>
                                    {modHeld.map((p) => (
                                      <div key={p.id} style={{ display: "flex", gap: 8, padding: "3px 0", alignItems: "baseline" }}>
                                        <span style={{ width: 7, height: 7, borderRadius: 999, background: PTYPE.mod.dot, flexShrink: 0, display: "inline-block", alignSelf: "center" }} />
                                        <span style={{ fontFamily: SANS, fontSize: 11.5, color: "#57534E", minWidth: 170 }}>{p.p}</span>
                                        <span style={{ fontFamily: SANS, fontSize: 10.5, color: "#9A8A7B" }}>{TAXL[p.tax]} · entra no plano como estoque/fluxo existente (motor)</span>
                                      </div>
                                    ))}
                                  </div>
                                )}
                                {!gate.gated && (
                                  <>
                                    <button onClick={(e) => { e.stopPropagation(); setShowBlocked(!showBlocked); }} style={{ marginTop: 8, fontFamily: SANS, fontSize: 11, fontWeight: 700, color: "#8A7A6B", background: "transparent", border: "none", cursor: "pointer", padding: 0 }}>
                                      {showBlocked ? "▾" : "▸"} bloqueados ({blocked.length}) — motivo do gate
                                    </button>
                                    {showBlocked && blocked.map(({ p, r }) => (
                                      <div key={p.id} style={{ display: "flex", gap: 8, padding: "3px 0", alignItems: "baseline" }}>
                                        <span style={{ fontFamily: SANS, fontSize: 11.5, color: "#B8A794", minWidth: 170, textDecoration: "line-through" }}>{p.p}</span>
                                        <span style={{ fontFamily: SANS, fontSize: 10.5, color: "#9A8A7B" }}>{r.reasons[0]}</span>
                                      </div>
                                    ))}
                                  </>
                                )}
                              </div>
                              {/* Estratégias (Camada 3) */}
                              <div>
                                <DetailLabel>Estratégias aplicáveis (Camada 3)</DetailLabel>
                                {g.strategies.map((sid) => (
                                  <div key={sid} style={{ marginBottom: 9 }}>
                                    <div style={{ fontFamily: SANS, fontSize: 12, fontWeight: 800, color: C.navy }}>{sid}</div>
                                    <div style={{ fontFamily: SERIF, fontSize: 12.5, lineHeight: 1.4, color: "#5B4B3E" }}>{STRATEGIES[sid]}</div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Disclaimer */}
        <div style={{ marginTop: 16, borderTop: `1px solid ${C.line}`, paddingTop: 12, fontFamily: SANS, fontSize: 11, color: "#9A8A7B", lineHeight: 1.6 }}>
          <strong style={{ color: "#8A7A6B" }}>v1.0 ilustrativa — não é aconselhamento.</strong> Incorpora as correções da Auditoria CFP × 14 Personas (jul/2026): piso de risco restrito a investimento/modelado (estruturas e proteção fora do gate; wrappers herdam mandato do perfil); escada mecanizada por flags de contexto (dívida cara = gate duro; reserva/proteção = avisos); score rebalanceado em metas datadas (duration match +20; bônus fiscal pleno só para instrumento datável); come-cotas penalizado a partir do médio prazo; hold-to-maturity colapsa o cap de L; meta em moeda estrangeira preserva o hedge no glidepath (aperta só M ex-câmbio); kit de renda isenta liberado a Conservador em decumulação via override + mandato diversificado; classes modeladas visíveis como base do plano (nunca recomendação). Linhas e objetivos marcados com * / "A validar" (incl. usd-cash, usd-bonds, seg-invalidez, renda-vitalicia, parcelamento-fatura, desmobilizacao-fisica) NÃO vão a cliente sem ratificação de Tributário, Risco e Compliance. A prioridade Essencial (flexV) apertando caps em 1 nível permanece decisão aberta de Risco (motor v2). REGRA ZERO: esta matriz decide estrutura e elegibilidade; valores, retornos, probabilidade de sucesso (VIS-803) e dimensionamento de aportes (VIS-801) pertencem ao motor determinístico. A visão de produtos (Pinpoint) DEVE consumir suitabilityVeto + scoreProduct exportados daqui — motor único, duas telas.
        </div>
      </div>
    </div>
  );
}
