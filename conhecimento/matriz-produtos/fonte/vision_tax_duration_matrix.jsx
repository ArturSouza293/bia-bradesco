import React, { useState, useMemo } from "react";

/**
 * Vision — Matriz Produto × Duração × Tributação (v0.3 · revisão de prateleira completa · jul/2026)
 * Escopo ampliado: prateleira inteira da consultoria + balanço completo do cliente — investimentos,
 * isentos, fundos, previdência, seguros, crédito/financiamentos, estruturas e classes modeladas
 * (imóveis, participação societária, INSS, cripto, veículo, FGTS). 66 linhas.
 *
 * Modelo de risco v2:
 *   - ptype: inv | prot | cred | estr | mod (tipo de produto — decide quais regras se aplicam)
 *   - dims { m, c, l, x }: risco de Mercado, Crédito, Liquidez, Câmbio (0–3) — atributo do PRODUTO
 *   - risk: piso de suitability (Conservador/Moderado/Agressivo — bandas do VIS-806)
 *   - o risco do OBJETIVO (shortfall vs. horizonte) é papel do motor, não desta tabela (Regra Zero)
 *
 * Dados ILUSTRATIVOS, ancorados nos docs 02/03 + engine params + sanity check jurídico (jul/2026):
 * Lei 15.270/2025, Lei 14.754/2023, LC 227/2026, STF Tema 1.214, Lei 14.803/2024, Decreto 12.499/2025;
 * MP 1.303/2025 caducou em 08/10/2025. Ratificar com Tributário antes de uso com cliente.
 */

// ---- Brand tokens ---------------------------------------------------------
const C = {
  oxblood: "#3B0507",
  red: "#CC092F",
  navy: "#1E2761",
  gold: "#BFA06A",
  ivory: "#FBF7F1",
  ink: "#2B2420",
  line: "#E7DFD5",
  paper: "#FFFFFF",
};
const SERIF = "'Newsreader', Georgia, 'Times New Roman', serif";
const SANS = "'Nunito Sans', -apple-system, system-ui, sans-serif";
const MONO = "'SFMono-Regular', ui-monospace, Menlo, monospace";

// ---- Enums ----------------------------------------------------------------
const OBJ = { LIQ: "Liquidez", LON: "Longevidade", LEG: "Legado" };
const SEGMENTS = ["Retail", "Prime", "Principal", "Private"];
const PROFILES = ["Conservador", "Moderado", "Agressivo"]; // bandas oficiais do suitability Vision (VIS-806)
const HORIZONS = [
  { key: "curtissimo", label: "Curtíssimo · <1a", range: [0, 1] },
  { key: "curto", label: "Curto · 1–3a", range: [1, 3] },
  { key: "medio", label: "Médio · 3–7a", range: [3, 7] },
  { key: "longo", label: "Longo · 7–15a", range: [7, 15] },
  { key: "vitalicio", label: "Vitalício · 15a+", range: [15, 40] },
];

// Tipo de produto — decide quais regras sistêmicas se aplicam
const PTYPE = {
  inv: { label: "Investimento", dot: "#1E2761" },
  prot: { label: "Proteção", dot: "#0E6B43" },
  cred: { label: "Crédito", dot: "#9A4A06" },
  estr: { label: "Estrutura", dot: "#3B0507" },
  mod: { label: "Modelado", dot: "#57534E" },
};

// Regimes tributários → cor de badge
const TAX = {
  isento: { label: "Isento PF", fg: "#0E6B43", bg: "#E4F3EB" },
  rf: { label: "RF regressivo", fg: "#1E2761", bg: "#E8EAF2" },
  comecotas: { label: "Come-cotas", fg: "#9A4A06", bg: "#FBEBD9" },
  gcrv: { label: "Ganho cap. RV", fg: "#0F6E66", bg: "#DFF0EE" },
  etf: { label: "ETF (fonte)", fg: "#3F5B8A", bg: "#E6ECF6" },
  etfrf: { label: "ETF-RF regressivo", fg: "#3F5B8A", bg: "#E6ECF6" },
  prev: { label: "Previdência regr.", fg: "#5B2AB0", bg: "#EDE6FA" },
  offshore: { label: "Offshore 15%/a", fg: "#57534E", bg: "#EEEAE5" },
  gcprog: { label: "Ganho cap. progr.", fg: "#8A5A06", bg: "#F6ECD9" },
  itcmd: { label: "ITCMD sucessão", fg: "#7A1420", bg: "#F5E3E3" },
  semir: { label: "Sem IR", fg: "#4B5563", bg: "#EEF0F2" },
  porativo: { label: "Ativo a ativo", fg: "#1E2761", bg: "#E8EAF2" },
  deducao: { label: "Dedução IRPF", fg: "#0E6B43", bg: "#E4F3EB" },
  irpf: { label: "IRPF progressivo", fg: "#7A1420", bg: "#F5E3E3" },
  pjdiv: { label: "Dividendos + IRPFM", fg: "#7A1420", bg: "#F5E3E3" },
};

const OBJ_STYLE = {
  [OBJ.LIQ]: { fg: C.navy, bg: "#E8EAF2", dot: C.navy },
  [OBJ.LON]: { fg: "#6B5327", bg: "#F5EEDF", dot: C.gold },
  [OBJ.LEG]: { fg: "#7A1420", bg: "#F5E3E3", dot: C.oxblood },
};

// ---- The matrix (66 linhas) ------------------------------------------------
// floor = alíquota efetiva de longo prazo (menor = mais eficiente) · rl = piso p/ Pinpoint (1..3)
// dims = risco do produto {m: mercado, c: crédito, l: liquidez, x: câmbio} 0–3 · null = não se aplica
const MATRIX = [
  // ————— LIQUIDEZ —————
  { id: "selic", ptype: "inv", product: "Tesouro Selic", mandate: "Caixa / Selic", cls: "Liquidez / caixa", dur: "Curtíssimo", yrs: [0, 1], liq: "D+1 · sem marcação", tax: "rf", rate: "22,5%→15%", floor: 15, ev: "No resgate", iof: true, obj: OBJ.LIQ, role: "Reserva de emergência", risk: "Conservador", rl: 1, dims: { m: 0, c: 0, l: 0, x: 0 }, seg: ["Retail", "Prime", "Principal", "Private"], status: "base", basis: "Tabela regressiva RF", note: "Único título sem marcação a mercado; capital sempre preservado — o veículo de reserva mais limpo." },
  { id: "cdb-liq", ptype: "inv", product: "CDB liquidez diária", mandate: "Caixa / Selic", cls: "Renda fixa bancária", dur: "Curtíssimo", yrs: [0, 1], liq: "D+0 · FGC R$250k", tax: "rf", rate: "22,5%→15%", floor: 15, ev: "No resgate", iof: true, obj: OBJ.LIQ, role: "Reserva / caixa", risk: "Conservador", rl: 1, dims: { m: 0, c: 1, l: 0, x: 0 }, seg: ["Retail", "Prime", "Principal", "Private"], status: "base", basis: "Tabela regressiva RF · FGC", note: "Core de reserva, familiar; sem come-cotas. Versões a prazo penalizam saída antecipada." },
  { id: "fundo-di", ptype: "inv", product: "Fundo DI / Referenciado DI", mandate: "Caixa / Selic", cls: "Fundos (aberto)", dur: "Curtíssimo", yrs: [0, 1], liq: "D+0 / D+1", tax: "comecotas", rate: "22,5%→15% + come-cotas", floor: 15, ev: "Semestral (mai/nov) + resgate", iof: true, obj: OBJ.LIQ, role: "Caixa conveniente", risk: "Conservador", rl: 1, dims: { m: 0, c: 1, l: 0, x: 0 }, seg: ["Retail", "Prime", "Principal", "Private"], status: "base", basis: "Come-cotas + regressiva", note: "Come-cotas quebra a composição silenciosamente; atenção à taxa de administração." },
  { id: "poupanca", ptype: "inv", product: "Poupança", mandate: "Caixa / Selic", cls: "Liquidez / caixa", dur: "Curtíssimo", yrs: [0, 1], liq: "Saque livre · rende no aniversário", tax: "isento", rate: "0%", floor: 0, ev: "—", iof: false, obj: OBJ.LIQ, role: "Default por inércia", risk: "Conservador", rl: 1, dims: { m: 0, c: 0, l: 0, x: 0 }, seg: ["Retail", "Prime"], status: "base", basis: "Isenção legal", note: "TR + 0,5%/mês — perde para inflação. O hábito mais corrigível; o que o Vision substitui." },
  { id: "lci-lca", ptype: "inv", product: "LCI / LCA (pós-fixada)", mandate: "Inflação / crédito", cls: "Renda fixa bancária", dur: "Curto", yrs: [1, 3], liq: "Carência, depois líquida/venc.", tax: "isento", rate: "0%", floor: 0, ev: "No resgate/venc.", iof: false, obj: OBJ.LIQ, role: "Renda fixa tax-free", risk: "Conservador", rl: 1, dims: { m: 0, c: 1, l: 2, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Isenção PF · FGC", note: "Isenta de IR; sticky por design. Risco de crédito no emissor (FGC até R$250k). Vencedor silencioso da RF. Carência mínima vigente a confirmar (mudou 2022–24)." },

  // ————— LONGEVIDADE —————
  { id: "ipca", ptype: "inv", product: "Tesouro IPCA+", mandate: "Inflação (IPCA+)", cls: "Títulos em custódia", dur: "Longo", yrs: [5, 15], liq: "D+1 · marcação a mercado", tax: "rf", rate: "15% (2a+)", floor: 15, ev: "No resgate", iof: true, obj: OBJ.LON, role: "Proteção poder de compra", risk: "Conservador", rl: 1, dims: { m: 2, c: 0, l: 0, x: 0 }, seg: ["Retail", "Prime", "Principal", "Private"], status: "base", basis: "Tabela regressiva RF", note: "Principal protegido da inflação se levado ao vencimento; oscila (MtM) se vendido antes — o risco de mercado colapsa quando duration ≤ horizonte do objetivo." },
  { id: "ipca-cupom", ptype: "inv", product: "Tesouro IPCA+ Juros Semestrais", mandate: "Inflação (IPCA+)", cls: "Títulos em custódia", dur: "Longo", yrs: [5, 15], liq: "Cupom semestral · MtM", tax: "rf", rate: "15% (2a+)", floor: 15, ev: "Semestral (cupom) + resgate", iof: true, obj: OBJ.LON, role: "Renda protegida da inflação", risk: "Conservador", rl: 1, dims: { m: 2, c: 0, l: 0, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Tabela regressiva RF", note: "Core da decumulação (Helena): renda protegida da inflação na aposentadoria." },
  { id: "rendamais", ptype: "inv", product: "Tesouro Renda+ (NTN-B1)", mandate: "Inflação (IPCA+)", cls: "Títulos em custódia", dur: "Vitalício", yrs: [10, 40], liq: "Carência 60d · 240 pgtos mensais", tax: "rf", rate: "15% (2a+)", floor: 15, ev: "Fase de pagamento", iof: false, obj: OBJ.LON, role: "Renda de aposentadoria", risk: "Conservador", rl: 1, dims: { m: 2, c: 0, l: 1, x: 0 }, seg: ["Retail", "Prime", "Principal", "Private"], status: "base", basis: "Regressiva RF · isenção custódia até 4 SM", note: "Cadência de pagamento (não lump); desenhado com R. Merton. Disciplina comportamental brasileira." },
  { id: "educamais", ptype: "inv", product: "Tesouro Educa+", mandate: "Inflação (IPCA+)", cls: "Títulos em custódia", dur: "Longo", yrs: [5, 18], liq: "Carência 60d · 60 pgtos mensais", tax: "rf", rate: "15% (2a+)", floor: 15, ev: "Fase de pagamento", iof: false, obj: OBJ.LON, role: "Objetivo educação", risk: "Conservador", rl: 1, dims: { m: 2, c: 0, l: 1, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Tabela regressiva RF", note: "Financiamento programado de faculdade — encaixe natural para famílias com filhos (Fernanda)." },
  { id: "cri-cra", ptype: "inv", product: "CRI / CRA", mandate: "Crédito privado", cls: "Renda fixa bancária", dur: "Longo", yrs: [4, 10], liq: "Venc. (secundário fino)", tax: "isento", rate: "0%", floor: 0, ev: "No vencimento", iof: false, obj: OBJ.LON, role: "RF isenta longa", risk: "Moderado", rl: 2, dims: { m: 1, c: 2, l: 3, x: 0 }, seg: ["Principal", "Private"], status: "base", basis: "Isenção PF (imob./agro)", note: "Uma LCI/LCA mais longa, tax-free; risco de crédito no emissor e iliquidez. Tickets maiores." },
  { id: "deb-inc", ptype: "inv", product: "Debêntures incentivadas", mandate: "Crédito privado", cls: "Renda fixa bancária", dur: "Longo", yrs: [4, 10], liq: "Venc. (secundário)", tax: "isento", rate: "0%", floor: 0, ev: "No vencimento", iof: false, obj: OBJ.LON, role: "Crédito corporativo isento", risk: "Moderado", rl: 2, dims: { m: 1, c: 2, l: 2, x: 0 }, seg: ["Principal", "Private"], status: "base", basis: "Lei 12.431/2011 (infraestrutura)", note: "Renda fixa corporativa com bônus tributário em infra. Isenta de IR para PF. Não confundir com a debênture de infraestrutura da Lei 14.801/2024 — nela o benefício é do EMISSOR e a PF é tributada normalmente." },
  { id: "deb-reg", ptype: "inv", product: "Debêntures regulares", mandate: "Crédito privado", cls: "Renda fixa bancária", dur: "Médio", yrs: [3, 7], liq: "Venc. (secundário)", tax: "rf", rate: "22,5%→15%", floor: 15, ev: "No resgate/venc.", iof: false, obj: OBJ.LON, role: "Crédito privado", risk: "Moderado", rl: 2, dims: { m: 1, c: 2, l: 2, x: 0 }, seg: ["Principal", "Private"], status: "base", basis: "Tabela regressiva RF", note: "Pagam IR (vs. incentivadas isentas). Yield sobre o DI com risco de crédito." },
  { id: "fundo-cp", ptype: "inv", product: "Fundo RF Crédito Privado", mandate: "Crédito privado", cls: "Fundos (aberto)", dur: "Médio", yrs: [1, 3], liq: "D+30 (alguns D+90)", tax: "comecotas", rate: "22,5%→15% + come-cotas", floor: 15, ev: "Semestral + resgate", iof: true, obj: OBJ.LON, role: "Yield pickup sobre DI", risk: "Moderado", rl: 2, dims: { m: 1, c: 2, l: 2, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Come-cotas + regressiva", note: "Yield sobre o DI via crédito; come-cotas arrasta. Atenção ao risco de crédito do pool." },
  { id: "fundo-imab", ptype: "inv", product: "Fundo Inflação (IMA-B)", mandate: "Inflação (IPCA+)", cls: "Fundos (aberto)", dur: "Longo", yrs: [3, 10], liq: "D+1 a D+30", tax: "comecotas", rate: "22,5%→15% + come-cotas", floor: 15, ev: "Semestral + resgate", iof: true, obj: OBJ.LON, role: "Sleeve longa anti-inflação", risk: "Moderado", rl: 2, dims: { m: 2, c: 1, l: 1, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Come-cotas + regressiva", note: "Substitui Tesouro IPCA+ com diversificação; come-cotas reduz a eficiência vs. o título direto." },
  { id: "pgbl", ptype: "inv", product: "PGBL", mandate: "Por mandato − taxa", cls: "Previdência", dur: "Vitalício", yrs: [10, 40], liq: "Resgate / renda", tax: "prev", rate: "35%→10% (10a+)", floor: 10, ev: "Na saída / renda", iof: false, obj: OBJ.LON, role: "Dedução 12% + regressiva", risk: "Conservador", rl: 1, dims: { m: 1, c: 1, l: 2, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Regressiva previdência · dedução 12% · Lei 14.803/2024", note: "Três benefícios: dedução (12% da renda, só declarante completa) + regressiva + sucessão fora do inventário. Lei 14.803/2024: a opção pelo regime (regressivo/progressivo) passou a ser feita no momento do resgate/benefício — decisão flexibilizada. Risco: conforme o FIE contratado." },
  { id: "vgbl", ptype: "inv", product: "VGBL", mandate: "Por mandato − taxa", cls: "Previdência", dur: "Vitalício", yrs: [10, 40], liq: "Resgate / renda", tax: "prev", rate: "35%→10% (só ganho)", floor: 10, ev: "Na saída / renda", iof: false, obj: OBJ.LON, role: "Regressiva + sucessão", risk: "Conservador", rl: 1, dims: { m: 1, c: 1, l: 2, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Regressiva previdência (só ganho) · Lei 14.803/2024", note: "Sem dedução; tributa só o ganho. Ideal para declarante pela simplificada e alocação sucessória. IOF de entrada: 5% sobre aportes anuais acima de R$600k/CPF (Decreto 12.499/2025) — PGBL não é afetado; fracionar entre anos evita. Lei 14.803/2024: opção de regime no resgate. Risco: conforme o FIE." },
  { id: "acoes", ptype: "inv", product: "Ações BR (buy & hold)", mandate: "Ações BR", cls: "Títulos em custódia", dur: "Longo", yrs: [5, 15], liq: "B3 · D+2", tax: "gcrv", rate: "15% + isenção R$20k/mês", floor: 15, ev: "Na venda", iof: false, obj: OBJ.LON, role: "Crescimento", risk: "Agressivo", rl: 3, dims: { m: 3, c: 0, l: 0, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Ganho de capital RV · isenção spot", note: "Isenção de R$20k/mês em vendas spot (que ETF não tem); dividendos isentos até o teto de 2026." },
  { id: "etf-acoes", ptype: "inv", product: "ETF de ações (BOVA11)", mandate: "Ações BR", cls: "Títulos em custódia", dur: "Longo", yrs: [5, 15], liq: "B3 · a qualquer hora", tax: "etf", rate: "15% · sem isenção 20k", floor: 15, ev: "Na venda", iof: false, obj: OBJ.LON, role: "Mercado inteiro num ticker", risk: "Agressivo", rl: 3, dims: { m: 3, c: 0, l: 0, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Ganho de capital · dividendos tributados", note: "Simples e barato para ter o índice; tributação menos amigável que ações diretas (sem isenção de R$20k)." },
  { id: "fundo-acoes", ptype: "inv", product: "Fundo de ações", mandate: "Ações BR", cls: "Fundos (aberto)", dur: "Longo", yrs: [5, 15], liq: "D+30", tax: "gcrv", rate: "15% · sem come-cotas", floor: 15, ev: "No resgate", iof: false, obj: OBJ.LON, role: "Gestão delegada", risk: "Agressivo", rl: 3, dims: { m: 3, c: 0, l: 2, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "15% s/ ganho · sem come-cotas", note: "Fundos de ação não sofrem come-cotas; razoavelmente eficiente para dinheiro longo em ações." },
  { id: "fii", ptype: "inv", product: "FII (Fundo Imobiliário)", mandate: "Imobiliário / renda", cls: "Títulos em custódia", dur: "Longo", yrs: [5, 15], liq: "B3 · líquida", tax: "isento", rate: "Distrib. isenta · 20% no ganho", floor: 0, ev: "Distrib. mensal + venda", iof: false, obj: OBJ.LON, role: "Renda isenta mensal", risk: "Moderado", rl: 2, dims: { m: 2, c: 1, l: 1, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Distribuição isenta PF · ganho 20%", note: "Motor de renda isenta (Helena). O ganho de capital na venda de cotas é tributado a 20%. Isenção exige 50+ cotistas, negociação em bolsa e cotista PF <10%." },
  { id: "multi", ptype: "inv", product: "Fundo Multimercado", mandate: "Multimercado", cls: "Fundos (aberto)", dur: "Médio", yrs: [3, 7], liq: "D+30 cotização + D+1", tax: "comecotas", rate: "22,5%→15% + come-cotas", floor: 15, ev: "Semestral + resgate", iof: true, obj: OBJ.LON, role: "Gestão ativa", risk: "Moderado", rl: 2, dims: { m: 2, c: 1, l: 2, x: 0 }, seg: ["Principal", "Private"], status: "base", basis: "Come-cotas + regressiva", note: "Sleeve de gestão ativa (juros/FX/ações); come-cotas arrasta a composição. Confirmar classificação curto vs. longo prazo do fundo — muda o piso (20% vs. 15%)." },
  { id: "intl", ptype: "inv", product: "Internacional / Offshore", mandate: "Internacional", cls: "Internacional", dur: "Longo", yrs: [5, 15], liq: "Varia (conta/fundo)", tax: "offshore", rate: "15% flat anual", floor: 15, ev: "Anual (31/dez) ou realização", iof: false, obj: OBJ.LON, role: "Diversificação + moeda", risk: "Moderado", rl: 2, dims: { m: 2, c: 1, l: 2, x: 3 }, seg: ["Principal", "Private"], status: "review", basis: "Lei 14.754/2023", note: "Fim do diferimento; substância importa. FX é a maior incerteza. Escala ~11% Principal → ~34% Private." },
  { id: "bdr", ptype: "inv", product: "BDRs", mandate: "Internacional", cls: "Títulos em custódia", dur: "Longo", yrs: [5, 15], liq: "B3", tax: "gcrv", rate: "15% · dividendos tributados", floor: 15, ev: "Na venda", iof: false, obj: OBJ.LON, role: "Ações globais em BRL", risk: "Moderado", rl: 2, dims: { m: 3, c: 0, l: 1, x: 3 }, seg: ["Principal", "Private"], status: "base", basis: "Ganho de capital RV", note: "Acesso a ações estrangeiras em BRL sem conta offshore; dividendos estrangeiros passam por tributação. Se BDR tem a isenção de R$20k/mês: a confirmar." },
  { id: "fidc", ptype: "inv", product: "FIDC", mandate: "Crédito privado", cls: "Fundos (aberto)", dur: "Médio", yrs: [2, 5], liq: "Fechado / semi-líquido", tax: "gcrv", rate: "15% (qualificado, sem come-cotas)", floor: 15, ev: "Na realização", iof: false, obj: OBJ.LON, role: "Aumentador de retorno", risk: "Agressivo", rl: 3, dims: { m: 1, c: 3, l: 3, x: 0 }, seg: ["Principal", "Private"], status: "review", basis: "Lei 14.754 (exceção FIDC)", note: "Spread alto, risco de crédito no pool; para perfis sofisticados. Qualificado escapa do come-cotas — confirmar classificação Entidade de Investimento do fundo específico. Subscrição sofre IOF de 0,38% (desde jul/2025)." },
  { id: "alts", ptype: "inv", product: "Alternativos (PE / FIP)", mandate: "Alternativos", cls: "Títulos em custódia", dur: "Vitalício", yrs: [7, 15], liq: "Fechado / ilíquido", tax: "gcrv", rate: "15% (FIP qualificado)", floor: 15, ev: "Na realização / desinv.", iof: false, obj: OBJ.LON, role: "Prêmio de iliquidez", risk: "Agressivo", rl: 3, dims: { m: 3, c: 2, l: 3, x: 0 }, seg: ["Private"], status: "review", basis: "Lei 14.754 (exceção FIP)", note: "Prêmio de iliquidez (~+10% real, ilustrativo); só Private. FIP qualificado escapa do come-cotas." },

  // ————— LEGADO / ESTRUTURAS —————
  { id: "seguro", ptype: "prot", product: "Seguro de vida (termo)", mandate: "—", cls: "Proteção / seguro", dur: "Vitalício", yrs: [0, 40], liq: "Pagamento no evento coberto", tax: "isento", rate: "Isento · fora do ITCMD", floor: 0, ev: "Na morte (evento)", iof: false, obj: OBJ.LEG, role: "Liquidez de espólio", risk: "Conservador", rl: 1, dims: null, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Código Civil (não é herança)", note: "A ferramenta de liquidez sucessória mais pura: paga rápido, contorna o inventário, isento aos beneficiários. Dimensionar para pagar o ITCMD do espólio." },
  { id: "prev-suc", ptype: "estr", product: "Previdência como sucessão", mandate: "Por mandato − taxa", cls: "Previdência", dur: "Vitalício", yrs: [0, 40], liq: "Beneficiários · acesso rápido", tax: "itcmd", rate: "Fora do inventário · sem ITCMD", floor: 0, ev: "Na morte (beneficiários)", iof: false, obj: OBJ.LEG, role: "Bypass de inventário", risk: "Conservador", rl: 1, dims: null, seg: ["Prime", "Principal", "Private"], status: "review", basis: "STF Tema 1.214 (RE 1.363.013) — definitivo", note: "Tese do STF é definitiva (mérito 12/2024, modulação recusada): passa fora do inventário aos beneficiários designados, sem ITCMD. Ressalvas reais — resistência administrativa de alguns fiscos estaduais; exceção do próprio STF para simulação/abuso (aporte desproporcional, perto da morte, que preterie herdeiro ou prejudique meação/credores). Confirmar com Tributário se há dispositivo da LC 227/2026 que reforce a tese para PGBL/VGBL." },
  { id: "holding", ptype: "estr", product: "Holding patrimonial (familiar)", mandate: "—", cls: "Estrutura societária", dur: "Vitalício", yrs: [0, 40], liq: "Estrutural (quotas)", tax: "itcmd", rate: "ITCMD na sucessão societária", floor: 8, ev: "Na transferência de quotas", iof: false, obj: OBJ.LEG, role: "Governança + sucessão", risk: "Moderado", rl: 2, dims: null, seg: ["Private"], status: "review", basis: "Direito societário · ITCMD estadual · STF Tema 796", note: "Sucessão corre no quadro societário (não em inventário lento). Válida com substância e documentação; estruturas de fachada são o que evitar. Integralizar imóveis: imunidade de ITBI limitada ao valor do capital (STF Tema 796) — o excedente paga." },
  { id: "usufruto", ptype: "estr", product: "Doação com reserva de usufruto", mandate: "—", cls: "Estrutura sucessória", dur: "Vitalício", yrs: [0, 40], liq: "Estrutural", tax: "itcmd", rate: "ITCMD na doação (trava a base)", floor: 8, ev: "Na doação", iof: false, obj: OBJ.LEG, role: "Antecipa e trava a base", risk: "Moderado", rl: 2, dims: null, seg: ["Principal", "Private"], status: "review", basis: "EC 132/2023 · LC 227/2026 · isenção estadual", note: "Trava as regras e a base de hoje e move a valorização para fora de um inventário futuro; doador mantém renda/controle. Cronologia: a LC 227/2026 tornou a progressividade obrigatória, mas não é autoaplicável — cada estado precisa de lei própria e, por anterioridade, ela só vale a partir de 2027 (SP segue a 4% fixo em 2026). A janela está fechando, não fechada." },
  { id: "cgi", ptype: "cred", product: "CGI (crédito c/ garantia de investimentos)", mandate: "—", cls: "Liquidez / crédito", dur: "Médio", yrs: [0, 5], liq: "Sob demanda · carteira penhorada", tax: "semir", rate: "Sem IR (não vende)", floor: 0, ev: "— (sem evento tributável)", iof: false, obj: OBJ.LIQ, role: "Liquidez sem realizar ganho", risk: "Moderado", rl: 2, dims: null, seg: ["Principal", "Private"], status: "base", basis: "Crédito garantido", note: "Levanta liquidez contra a carteira sem vender e disparar IR — a carteira continua compondo. Atenção à chamada de margem se a carteira cair. Ferramenta consciente de tributação." },
  { id: "fgts", ptype: "mod", product: "FGTS", mandate: "—", cls: "FGTS", dur: "Longo", yrs: [1, 20], liq: "Vinculado (saque em hipóteses legais)", tax: "isento", rate: "0%", floor: 0, ev: "—", iof: false, obj: OBJ.LIQ, role: "Saldo vinculado", risk: "Conservador", rl: 1, dims: { m: 0, c: 0, l: 3, x: 0 }, seg: ["Retail", "Prime"], status: "base", basis: "Remuneração legal TR+3%", note: "TR + 3% — negativo em termos reais. Modelar como arrasto; usar/sacar quando a hipótese legal permite. Ponte principal: amortizar/quitar financiamento imobiliário a cada 2 anos." },
  { id: "consorcio", ptype: "cred", product: "Consórcio", mandate: "—", cls: "Aquisição programada", dur: "Médio", yrs: [2, 7], liq: "Travado até contemplação", tax: "semir", rate: "Sem IR", floor: 0, ev: "—", iof: false, obj: OBJ.LON, role: "Aquisição programada", risk: "Conservador", rl: 1, dims: null, seg: ["Retail", "Prime", "Principal", "Private"], status: "base", basis: "—", note: "Poupança forçada + aquisição adiada; sem juros mas com taxa de administração. Acesso só por sorteio ou lance (FGTS pode dar lance em imobiliário). Stickiness de dupla face: ótimo quando força bom comportamento, ruim quando trava no produto errado." },

  // ————— ADIÇÕES · sanity check jurídico (jul/2026) —————
  { id: "prefixado", ptype: "inv", product: "Tesouro Prefixado (LTN/NTN-F)", mandate: "Taxa fixa", cls: "Títulos em custódia", dur: "Médio", yrs: [2, 10], liq: "D+1 · marcação a mercado", tax: "rf", rate: "22,5%→15%", floor: 15, ev: "No resgate", iof: true, obj: OBJ.LON, role: "Trava taxa nominal hoje", risk: "Conservador", rl: 1, dims: { m: 3, c: 0, l: 0, x: 0 }, seg: ["Retail", "Prime", "Principal", "Private"], status: "review", basis: "Tabela regressiva RF", note: "Útil quando a visão é de queda de juro nominal — sofre marcação a mercado CHEIA se vendido antes do vencimento (M3), mais que o IPCA+. Casado com o vencimento, o risco de mercado colapsa. Não protege da inflação." },
  { id: "lig", ptype: "inv", product: "LIG (Letra Imobiliária Garantida)", mandate: "Inflação / crédito", cls: "Renda fixa bancária", dur: "Longo", yrs: [3, 10], liq: "Carência, depois líquida/venc.", tax: "isento", rate: "0%", floor: 0, ev: "No resgate/venc.", iof: false, obj: OBJ.LON, role: "RF isenta com garantia dupla", risk: "Conservador", rl: 1, dims: { m: 0, c: 1, l: 2, x: 0 }, seg: ["Principal", "Private"], status: "review", basis: "Lei 14.421/2022 — isenção PF", note: "Como LCI/LCA, mas com patrimônio de afetação + garantia direta do emissor (dupla proteção); tickets e prazos maiores, encaixa em Principal/Private." },
  { id: "coe", ptype: "inv", product: "COE (Operações Estruturadas)", mandate: "Tático / estruturado", cls: "Renda fixa bancária", dur: "Médio", yrs: [1, 5], liq: "Só no vencimento (regra geral)", tax: "rf", rate: "22,5%→15%", floor: 15, ev: "No vencimento", iof: true, obj: OBJ.LON, role: "Visão tática, capital protegido (opcional)", risk: "Moderado", rl: 2, dims: { m: 2, c: 2, l: 3, x: 0 }, seg: ["Principal", "Private"], status: "review", basis: "Tabela regressiva RF", note: "Um único evento tributário no vencimento; o risco real está na estrutura (capital protegido vs. não) e no emissor, não no IR — exige nota de risco própria por série, não genérica." },
  { id: "etf-rf", ptype: "inv", product: "ETF de renda fixa", mandate: "Caixa ou Inflação, conforme índice", cls: "Fundos (aberto)", dur: "Médio", yrs: [1, 7], liq: "B3 · a qualquer hora", tax: "etfrf", rate: "25%→15% (prazo médio da carteira)", floor: 15, ev: "Na venda/resgate", iof: false, obj: OBJ.LIQ, role: "Cesta de RF num ticker, sem come-cotas", risk: "Conservador", rl: 1, dims: { m: 1, c: 1, l: 0, x: 0 }, seg: ["Retail", "Prime", "Principal", "Private"], status: "review", basis: "Regressiva por PMRC — Portaria MF 163/2016", note: "Alíquota corre pelo prazo médio de repactuação da carteira (PMRC), não pelo tempo que o investidor segurou a cota — pode nascer perto do piso de 15%. Sem come-cotas e sem IOF mesmo <30 dias." },
  { id: "fundo-cambial", ptype: "inv", product: "Fundo Cambial", mandate: "Câmbio / dólar", cls: "Fundos (aberto)", dur: "Curto", yrs: [0, 2], liq: "D+1 a D+30", tax: "comecotas", rate: "22,5%→20% (curto prazo típico)", floor: 20, ev: "Semestral + resgate", iof: true, obj: OBJ.LIQ, role: "Hedge cambial / dólar onshore", risk: "Moderado", rl: 2, dims: { m: 2, c: 0, l: 1, x: 3 }, seg: ["Principal", "Private"], status: "review", basis: "Regra geral de fundos curto prazo", note: "A maioria é curto prazo (carteira média <365 dias) — teto de come-cotas de 20%, não 15%; confirmar a classificação do fundo específico antes de assumir o piso de 15% usado em outras linhas." },
  { id: "fiagro", ptype: "inv", product: "FIAgro", mandate: "Agro / crédito", cls: "Títulos em custódia", dur: "Longo", yrs: [4, 10], liq: "B3 · líquida", tax: "isento", rate: "Distrib. isenta (c/ requisitos) · 20% ganho", floor: 0, ev: "Distrib. + venda", iof: false, obj: OBJ.LON, role: "Renda isenta ligada ao agro", risk: "Moderado", rl: 2, dims: { m: 2, c: 2, l: 1, x: 0 }, seg: ["Principal", "Private"], status: "review", basis: "Lei 14.130/2021; Lei 11.033/2004 art. 3º", note: "Isenção da distribuição só vale com 50+ cotistas, cotas negociadas em bolsa/balcão e nenhum cotista PF com >=10% — fora disso, 20% na distribuição. Ganho na venda é sempre 20% (o FI-Infra também isenta o ganho; o FIAgro não)." },
  { id: "fi-infra", ptype: "inv", product: "FI-Infra / FIP-IE", mandate: "Infraestrutura / crédito", cls: "Títulos em custódia", dur: "Longo", yrs: [5, 15], liq: "B3 · líquida (ou fechado)", tax: "isento", rate: "Distrib. isenta · ganho isento", floor: 0, ev: "Distrib. + venda", iof: false, obj: OBJ.LON, role: "Renda + ganho isentos — mais amplo que FII", risk: "Moderado", rl: 2, dims: { m: 2, c: 2, l: 1, x: 0 }, seg: ["Principal", "Private"], status: "review", basis: "Lei 12.431/2011; Resolução CVM 175", note: "Isenção cobre distribuição E ganho de capital na venda das cotas — mais ampla que a do FII (que tributa o ganho a 20%). Exige >=85% do PL em ativos de infraestrutura elegíveis, majoritariamente debêntures incentivadas." },
  { id: "acoes-exterior", ptype: "inv", product: "Ações no exterior (custódia direta)", mandate: "Internacional", cls: "Internacional", dur: "Longo", yrs: [5, 15], liq: "Mercado de origem", tax: "offshore", rate: "A CONFIRMAR — 15%/a (Lei 14.754) ou ganho de capital", floor: 15, ev: "Anual e/ou na venda — a confirmar", iof: false, obj: OBJ.LON, role: "Exposição direta sem wrapper BR", risk: "Agressivo", rl: 3, dims: { m: 3, c: 0, l: 1, x: 3 }, seg: ["Private"], status: "review", basis: "Lei 14.754/2023 — mecânica a confirmar", note: "ZONA CINZENTA: não confirmado se ações estrangeiras em custódia direta caem em aplicações financeiras no exterior (15%/ano) ou no regime tradicional de ganho de capital sobre bens no exterior. CONFIANÇA BAIXA — não usar com cliente sem confirmação do Tributário." },
  { id: "trust", ptype: "estr", product: "Trust (sucessão internacional)", mandate: "—", cls: "Estrutura sucessória", dur: "Vitalício", yrs: [0, 40], liq: "Estrutural", tax: "itcmd", rate: "ITCMD no repasse ou na morte do settlor (o 1º)", floor: 8, ev: "Repasse ao beneficiário / morte do settlor", iof: false, obj: OBJ.LEG, role: "Sucessão internacional com substância", risk: "Moderado", rl: 2, dims: null, seg: ["Private"], status: "review", basis: "Lei 14.754/2023; LC 227/2026", note: "A LC 227/2026 fixou o ITCMD no repasse ao beneficiário ou na morte do instituidor, o que ocorrer primeiro — encerrando a cobrança na constituição de trusts revogáveis. A Lei 14.754 trata bens em trust como do instituidor em vida (transparência): sem substância, não há blindagem." },
  { id: "home-equity", ptype: "cred", product: "Home Equity (crédito c/ garantia de imóvel)", mandate: "—", cls: "Liquidez / crédito", dur: "Longo", yrs: [5, 20], liq: "Sob demanda · imóvel em garantia", tax: "semir", rate: "Sem IR (é dívida)", floor: 0, ev: "— (sem fato gerador p/ o mutuário)", iof: false, obj: OBJ.LIQ, role: "Liquidez de menor custo sem vender", risk: "Moderado", rl: 2, dims: null, seg: ["Principal", "Private"], status: "review", basis: "Natureza de dívida", note: "Paralelo ao CGI, com imóvel como colateral em vez da carteira; custo (juros) menor pelo colateral. iof=false porque a coluna mede o IOF<30d de resgate; o IOF/crédito próprio (~0,38% + diário até teto) incide na contratação, fora do escopo. Juros não dedutíveis no IRPF." },
  { id: "consignado", ptype: "cred", product: "Crédito Consignado", mandate: "—", cls: "Liquidez / crédito", dur: "Médio", yrs: [1, 6], liq: "Desconto em folha/benefício", tax: "semir", rate: "Sem IR (é dívida)", floor: 0, ev: "— (sem fato gerador)", iof: false, obj: OBJ.LIQ, role: "Crédito mais barato com margem consignável", risk: "Conservador", rl: 1, dims: null, seg: ["Retail", "Prime"], status: "review", basis: "Natureza de dívida", note: "Mesma lógica de CGI/home equity: sem IR ao tomador; IOF/crédito próprio na contratação, fora do escopo IOF<30d. Mais relevante em Retail/Prime — contraponto direto ao financiar-vs-investir. Também instrumento de CONSOLIDAÇÃO de dívida rotativa cara." },

  // ————— REVISÃO DE PRATELEIRA v0.3 · categorias ausentes (jul/2026) —————
  // Investimento
  { id: "cdb-prazo", ptype: "inv", product: "CDB a prazo (2a+)", mandate: "Crédito bancário (pós/pré/IPCA)", cls: "Renda fixa bancária", dur: "Médio", yrs: [2, 5], liq: "Vencimento (saída penalizada)", tax: "rf", rate: "22,5%→15%", floor: 15, ev: "No resgate/venc.", iof: true, obj: OBJ.LON, role: "RF datada núcleo", risk: "Conservador", rl: 1, dims: { m: 0, c: 1, l: 2, x: 0 }, seg: ["Retail", "Prime", "Principal", "Private"], status: "review", basis: "Tabela regressiva RF · FGC", note: "Versão a prazo do CDB: piso de 15% em 2a+, FGC até R$250k, sem liquidez até o vencimento. Casamento natural com objetivos datados de médio prazo; comparar sempre com o kit isento (LCI/LCA) no líquido." },
  { id: "lcd", ptype: "inv", product: "LCD (Letra de Crédito do Desenvolvimento)", mandate: "Crédito / desenvolvimento", cls: "Renda fixa bancária", dur: "Longo", yrs: [3, 10], liq: "Carência/vencimento", tax: "isento", rate: "0%", floor: 0, ev: "No vencimento", iof: false, obj: OBJ.LON, role: "RF isenta (desenvolvimento)", risk: "Conservador", rl: 1, dims: { m: 0, c: 1, l: 2, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "review", basis: "Lei 14.937/2024 — isenção PF", note: "Emitida por bancos de desenvolvimento (BNDES e congêneres), isenta de IR para PF como LCI/LCA, com limite global anual de emissão. Prateleira ainda rasa; confirmar disponibilidade no catálogo." },
  { id: "carteira-adm", ptype: "inv", product: "Carteira administrada", mandate: "Por composição − mandatos", cls: "Títulos em custódia (gestão)", dur: "Longo", yrs: [3, 40], liq: "Por ativo · mandato contratado", tax: "porativo", rate: "Cada ativo segue sua regra · sem come-cotas de wrapper", floor: 15, ev: "Por ativo (venda/cupom)", iof: false, obj: OBJ.LON, role: "Gestão sob medida sem come-cotas", risk: "Conservador", rl: 1, dims: null, seg: ["Principal", "Private"], status: "base", basis: "Tributação por ativo · doc 03", note: "O wrapper estratégico do Principal/Private (UC04): ativos no nome do cliente, tributação ativo a ativo, SEM come-cotas de estrutura — vantagem estrutural sobre fundo exclusivo pós-Lei 14.754. Taxa de gestão sobre AuA não é dedutível na PF. O risco é o da composição contratada, limitada pelo perfil." },
  { id: "fundo-exclusivo", ptype: "inv", product: "Fundo exclusivo / fechado", mandate: "Por composição", cls: "Fundos (fechado)", dur: "Vitalício", yrs: [5, 40], liq: "Fechado · amortizações/eventos", tax: "comecotas", rate: "22,5%→15% + come-cotas (salvo FIA/FIP/FIDC/FIAgro)", floor: 15, ev: "Semestral + resgate", iof: false, obj: OBJ.LEG, role: "Governança + sucessão familiar", risk: "Moderado", rl: 2, dims: null, seg: ["Private"], status: "base", basis: "Lei 14.754/2023", note: "Pós-Lei 14.754 sofre come-cotas (salvo FIA/FIP/FIDC/FIAgro qualificados) — perdeu o diferimento que o justificava. Segue relevante por governança e sucessão (doação de cotas com usufruto), com custo de estrutura que só fecha em patrimônios grandes. Comparar sempre com carteira administrada." },
  { id: "etf-intl", ptype: "inv", product: "ETF internacional na B3 (IVVB11)", mandate: "Internacional", cls: "Títulos em custódia", dur: "Longo", yrs: [5, 15], liq: "B3 · a qualquer hora", tax: "etf", rate: "15% · sem isenção 20k", floor: 15, ev: "Na venda", iof: false, obj: OBJ.LON, role: "Dolarização simples via B3", risk: "Agressivo", rl: 3, dims: { m: 3, c: 0, l: 0, x: 3 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Regime de ETF de ações (B3)", note: "IVVB11 e afins: 15% no ganho, sem isenção de R$20k/mês, sem come-cotas — com exposição cambial embutida. Dolarização simples sem conta offshore nem regime da Lei 14.754." },
  { id: "capitalizacao", ptype: "inv", product: "Capitalização", mandate: "—", cls: "Capitalização", dur: "Médio", yrs: [1, 5], liq: "Resgate com penalidade/prazo", tax: "rf", rate: "A CONFIRMAR · sorteios 30% na fonte", floor: 20, ev: "No resgate/sorteio", iof: false, obj: OBJ.LON, role: "Disciplina comportamental (fraco)", risk: "Conservador", rl: 1, dims: { m: 0, c: 1, l: 2, x: 0 }, seg: ["Retail", "Prime"], status: "review", basis: "Mecânica de IR do resgate a confirmar", note: "Popular e financeiramente fraco (doc 02): rendimento real ~nulo (TR), sorteios tributados a 30% exclusivo na fonte. Papel honesto: disciplina comportamental — sinalizar upgrade para consórcio/Tesouro programado. Mecânica exata do IR no resgate: A CONFIRMAR." },

  // Proteção
  { id: "vida-resgatavel", ptype: "prot", product: "Seguro de vida resgatável (vida inteira/dotal)", mandate: "—", cls: "Proteção / seguro", dur: "Vitalício", yrs: [0, 40], liq: "Resgate após carência · morte paga rápido", tax: "isento", rate: "Morte: isenta/fora ITCMD · Resgate: IR a confirmar", floor: 0, ev: "Na morte / no resgate", iof: false, obj: OBJ.LEG, role: "Proteção + acumulação sucessória", risk: "Conservador", rl: 1, dims: null, seg: ["Principal", "Private"], status: "review", basis: "Código Civil · mecânica de resgate por SKU (SUSEP)", note: "Na morte: isento e fora do inventário/ITCMD como o vida a termo. O resgate EM VIDA é tributado sobre o rendimento — mecânica varia por produto SUSEP, A CONFIRMAR por SKU. Combina proteção + acumulação sucessória para Private." },
  { id: "prestamista", ptype: "prot", product: "Seguro prestamista", mandate: "—", cls: "Proteção / seguro", dur: "Médio", yrs: [0, 20], liq: "Contingente (evento)", tax: "semir", rate: "Indenização quita a dívida · sem IR", floor: 0, ev: "No evento (quita dívida)", iof: false, obj: OBJ.LEG, role: "Protege a família da dívida", risk: "Conservador", rl: 1, dims: null, seg: ["Retail", "Prime", "Principal"], status: "base", basis: "Natureza securitária", note: "Quita o saldo devedor no óbito/invalidez — o beneficiário é o credor; indenização sem IR. Protege a família de herdar dívida (embutido no CET do crédito). Regra sistêmica: todo financiamento relevante carrega prestamista ou vida equivalente." },
  { id: "saude", ptype: "prot", product: "Plano de saúde", mandate: "—", cls: "Proteção / saúde", dur: "Vitalício", yrs: [0, 40], liq: "Uso contínuo (mensalidade)", tax: "deducao", rate: "Despesa dedutível SEM TETO (completa)", floor: 0, ev: "Anual (dedução na DIRPF)", iof: false, obj: OBJ.LIQ, role: "Proteção de fluxo + dedução", risk: "Conservador", rl: 1, dims: null, seg: ["Retail", "Prime", "Principal", "Private"], status: "base", basis: "Dedução integral de despesas médicas (declaração completa)", note: "Não é investimento — é proteção + a alavanca de dedução mais subestimada: despesas médicas (incluindo o plano) são dedutíveis SEM TETO na completa. Regra sistêmica: gasto de saúde alto → completa quase sempre vence → habilita a dedução de 12% do PGBL. Reajustes acima do IPCA: modelar inflação médica própria (Fernanda)." },
  { id: "seg-patrimonial", ptype: "prot", product: "Seguros patrimoniais (residencial/auto)", mandate: "—", cls: "Proteção / seguro", dur: "Vitalício", yrs: [0, 40], liq: "Contingente (sinistro)", tax: "semir", rate: "Indenização = recomposição · sem IR", floor: 0, ev: "No sinistro", iof: false, obj: OBJ.LIQ, role: "Protege o balanço", risk: "Conservador", rl: 1, dims: null, seg: ["Retail", "Prime", "Principal", "Private"], status: "base", basis: "Indenização não é renda", note: "Indenização é recomposição patrimonial, não renda tributável. Sem dimensão de investimento — protege o balanço de choques que, sem seguro, drenariam a reserva ou forçariam venda de ativos (o elo com Liquidez)." },

  // Crédito / financiamentos
  { id: "financ-imob", ptype: "cred", product: "Financiamento imobiliário (SFH/SFI)", mandate: "—", cls: "Passivo / financiamento", dur: "Longo", yrs: [5, 35], liq: "Amortizável (SAC/Price) · FGTS a cada 2a", tax: "semir", rate: "Sem IR · juros NÃO dedutíveis", floor: 0, ev: "—", iof: false, obj: OBJ.LON, role: "Aquisição alavancada de moradia", risk: "Conservador", rl: 1, dims: null, seg: ["Retail", "Prime", "Principal", "Private"], status: "base", basis: "Doc 03 · SFH/SFI", note: "O maior passivo da PF. Juros NÃO são dedutíveis no IRPF (diferente dos EUA — doc 03); FGTS pode amortizar/quitar a cada 2 anos (a ponte FGTS→imóvel). Decisão viva do goal-based: amortizar vs. investir = taxa do contrato vs. retorno LÍQUIDO de IR esperado, com prestamista embutido no CET." },
  { id: "cdc", ptype: "cred", product: "CDC / crédito pessoal (incl. veículo)", mandate: "—", cls: "Passivo / crédito", dur: "Curto", yrs: [0, 4], liq: "Parcelas fixas", tax: "semir", rate: "Sem IR (é dívida)", floor: 0, ev: "—", iof: false, obj: OBJ.LIQ, role: "Consumo a prazo (evitar)", risk: "Conservador", rl: 1, dims: null, seg: ["Retail", "Prime"], status: "base", basis: "Natureza de dívida", note: "CET alto, sem qualquer benefício fiscal. Regra sistêmica: quitar antes de qualquer alocação (exceto reserva mínima) — nenhum retorno líquido realista bate o custo. Financiar bem depreciante (veículo, −12% real) é a pior combinação da matriz." },
  { id: "rotativo", ptype: "cred", product: "Cartão rotativo / cheque especial", mandate: "—", cls: "Passivo / crédito", dur: "Curtíssimo", yrs: [0, 1], liq: "Revolvente (evitar)", tax: "semir", rate: "Sem IR (é dívida)", floor: 0, ev: "—", iof: false, obj: OBJ.LIQ, role: "Emergência cara (eliminar)", risk: "Conservador", rl: 1, dims: null, seg: ["Retail", "Prime"], status: "base", basis: "Natureza de dívida", note: "CET de três dígitos — destruidor de patrimônio. Regra sistêmica dura: dívida rotativa detectada → plano de quitação/consolidação (consignado, CGI) ANTES de qualquer conversa de investimento (Marcos)." },
  { id: "antecipacao", ptype: "cred", product: "Antecipação de 13º / restituição / recebíveis", mandate: "—", cls: "Passivo / crédito", dur: "Curtíssimo", yrs: [0, 1], liq: "Quita no recebível", tax: "semir", rate: "Sem IR (é dívida)", floor: 0, ev: "—", iof: false, obj: OBJ.LIQ, role: "Suavização pontual", risk: "Conservador", rl: 1, dims: null, seg: ["Retail", "Prime"], status: "base", basis: "Natureza de dívida", note: "Liquidez pontual com spread do banco. Uso excepcional de suavização — arriscado como hábito; se recorrente, o problema é orçamento, não crédito." },
  { id: "capital-giro", ptype: "cred", product: "Capital de giro / conta garantida (PJ)", mandate: "—", cls: "Passivo / crédito PJ", dur: "Curto", yrs: [0, 3], liq: "Rotativo PJ", tax: "semir", rate: "Sem IR ao tomador · juros dedutíveis na PJ", floor: 0, ev: "—", iof: false, obj: OBJ.LIQ, role: "Fôlego da empresa (PJ)", risk: "Moderado", rl: 2, dims: null, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Natureza de dívida (PJ)", note: "Mantém a empresa respirando sem contaminar a PF. Regra de fronteira: pró-labore disciplinado + não misturar caixa PJ e patrimônio pessoal (Thiago, Patrícia). Juros dedutíveis NA PJ (lucro real), nunca na PF." },

  // Estruturas
  { id: "offshore-pj", ptype: "estr", product: "Offshore PJ (controlada no exterior)", mandate: "Internacional", cls: "Estrutura internacional", dur: "Vitalício", yrs: [0, 40], liq: "Estrutural", tax: "offshore", rate: "15%/a sobre lucros (31/dez) · opção transparência", floor: 15, ev: "Anual (31/dez)", iof: false, obj: OBJ.LEG, role: "Veículo internacional c/ substância", risk: "Moderado", rl: 2, dims: null, seg: ["Private"], status: "review", basis: "Lei 14.754/2023", note: "Lucros tributados anualmente a 15% em 31/dez, repatriados ou não, com opção de transparência fiscal (declarar os ativos como se PF). Custos de manutenção + substância obrigatória. Sucessão internacional exige planejamento próprio (will/probate local). Para Private com diversificação genuína." },
  { id: "doacao", ptype: "estr", product: "Doação em dinheiro/bens (simples)", mandate: "—", cls: "Estrutura sucessória", dur: "Vitalício", yrs: [0, 40], liq: "Ato único", tax: "itcmd", rate: "ITCMD estadual · isenção anual por estado", floor: 8, ev: "Na doação", iof: false, obj: OBJ.LEG, role: "Antecipação de herança", risk: "Conservador", rl: 1, dims: null, seg: ["Principal", "Private"], status: "review", basis: "ITCMD estadual · LC 227/2026", note: "A ferramenta de transferência mais simples: ITCMD estadual com isenções anuais por estado (SP ~R$96k/ano, A CONFIRMAR). Atenção à futura regra de consolidação de doações seriadas (LC 227 — prazo estadual a definir). Antecipa herança em vida com controle do timing." },

  // Classes modeladas (não vendidas — fecham o balanço do cliente)
  { id: "imovel-renda", ptype: "mod", product: "Imóvel para renda (aluguel)", mandate: "Imobiliário / renda", cls: "Imóveis", dur: "Vitalício", yrs: [5, 40], liq: "Meses para vender · vacância", tax: "irpf", rate: "Aluguel: até 27,5% · Venda: GCAP 15→22,5%", floor: 27.5, ev: "Mensal (carnê-leão) + venda", iof: false, obj: OBJ.LON, role: "Renda imobiliária direta", risk: "Moderado", rl: 2, dims: { m: 2, c: 0, l: 3, x: 0 }, seg: ["Prime", "Principal", "Private"], status: "base", basis: "Carnê-leão · GCAP progressivo · redutores Lei 11.196/7.713", note: "Classe do engine ausente até a v0.2. Aluguel = carnê-leão progressivo até 27,5% (a renda recorrente mais tributada da matriz); venda = GCAP 15→22,5% com redutores por antiguidade. Estratégia PJ imobiliária (Lucro Presumido ~11–14% sobre a receita) pode reduzir o atrito — avaliar caso a caso. Iliquidez alta + vacância. Comparar sempre com FII no líquido." },
  { id: "imovel-proprio", ptype: "mod", product: "Imóvel residencial próprio", mandate: "—", cls: "Imóveis", dur: "Vitalício", yrs: [5, 40], liq: "Meses para vender", tax: "gcprog", rate: "GCAP 15→22,5% · isenções 180d / único ≤R$440k", floor: 15, ev: "Na venda", iof: false, obj: OBJ.LON, role: "Moradia (uso)", risk: "Conservador", rl: 1, dims: { m: 1, c: 0, l: 3, x: 0 }, seg: ["Retail", "Prime", "Principal", "Private"], status: "base", basis: "Lei 11.196 art. 39 · Lei 9.250 art. 23", note: "Duas isenções clássicas de GCAP: (a) venda de residencial + compra de outro em 180 dias (1×/5 anos); (b) imóvel único ≤R$440k (1×/5 anos). Regras sistêmicas do objetivo trocar de casa. Não gera renda; gera custo (condomínio/IPTU) — modelar como uso, não investimento." },
  { id: "participacao", ptype: "mod", product: "Participação societária (empresa própria)", mandate: "Empresa própria", cls: "Participação societária", dur: "Vitalício", yrs: [0, 40], liq: "Ilíquida (evento societário)", tax: "pjdiv", rate: "Dividendos 10% >R$50k/mês · IRPFM · GCAP quotas", floor: 10, ev: "Distribuição + venda + sucessão", iof: false, obj: OBJ.LEG, role: "O negócio do cliente", risk: "Agressivo", rl: 3, dims: { m: 3, c: 2, l: 3, x: 0 }, seg: ["Principal", "Private"], status: "review", basis: "Lei 15.270/2025 · LC 227/2026 (valor de mercado)", note: "O maior ativo do cliente PJ (Patrícia, Antônio): dividendos isentos até R$50k/mês/empresa (10% de retenção acima), IRPFM no agregado, ganho na venda de quotas progressivo 15→22,5%. Sucessão: ITCMD sobre VALOR DE MERCADO das quotas (LC 227 — encerra a avaliação contábil), via holding/doação com usufruto. Concentração é o risco dominante." },
  { id: "cripto", ptype: "mod", product: "Cripto (ativos virtuais)", mandate: "Cripto / satélite", cls: "Ativos virtuais", dur: "Longo", yrs: [3, 10], liq: "24/7 · alta volatilidade", tax: "gcprog", rate: "15→22,5% · isenção R$35k/mês (BR)", floor: 15, ev: "Na alienação (mensal)", iof: false, obj: OBJ.LON, role: "Satélite especulativo", risk: "Agressivo", rl: 3, dims: { m: 3, c: 0, l: 1, x: 2 }, seg: ["Prime", "Principal", "Private"], status: "review", basis: "GCAP + IN RFB 1888 · Lei 14.754 (exterior)", note: "Classe detida pelo cliente (não vendida): exchange nacional = GCAP progressivo 15→22,5% com isenção de R$35k/mês em alienações (regra mantida com a caducidade da MP 1.303); exterior/self-custody = regime da Lei 14.754 — mecânica A CONFIRMAR por caso. Goal-based trata como satélite de risco, nunca core." },
  { id: "inss", ptype: "mod", product: "INSS (previdência social)", mandate: "—", cls: "Previdência social", dur: "Vitalício", yrs: [10, 40], liq: "Benefício mensal vitalício", tax: "irpf", rate: "Benefício: IRPF progressivo (isenção extra 65+)", floor: 27.5, ev: "No benefício (mensal)", iof: false, obj: OBJ.LON, role: "Piso vitalício de aposentadoria", risk: "Conservador", rl: 1, dims: null, seg: ["Retail", "Prime", "Principal", "Private"], status: "base", basis: "Teto em assumptions.ts · IRPF", note: "Não vendido, mas é o piso vitalício do objetivo aposentadoria (teto do benefício em assumptions.ts, com fonte e data). Contribuição dedutível na completa; benefício tributado como renda ordinária (isenção extra a partir de 65 anos). Regra sistêmica: gap = despesa desejada − INSS projetado é o que a carteira precisa financiar (Thiago: previdência privada como substituto)." },
  { id: "veiculo", ptype: "mod", product: "Veículo (bem de uso)", mandate: "—", cls: "Veículos", dur: "Médio", yrs: [0, 10], liq: "Dias/semanas (usado)", tax: "semir", rate: "Sem IR · IPVA à parte", floor: 0, ev: "—", iof: false, obj: OBJ.LON, role: "Bem de uso depreciante", risk: "Conservador", rl: 1, dims: null, seg: ["Retail", "Prime", "Principal", "Private"], status: "base", basis: "Engine params (−12% real a.a.)", note: "Bem de uso que deprecia ~−12% real a.a. (engine) — modelar a perda, não o ativo. Sem IR (IPVA é imposto de propriedade, à parte). Regra sistêmica: objetivo trocar de carro financia-se com consórcio/poupança programada; CDC sobre bem depreciante é a pior combinação da matriz." },
];

// ---- Pinpoint scoring -----------------------------------------------------
const RLV = { Conservador: 1, Moderado: 2, Agressivo: 3 };
function overlap(a, b) { return Math.max(0, Math.min(a[1], b[1]) - Math.max(a[0], b[0])); }
function scoreRow(r, { obj, seg, profile, horizon }) {
  let s = 0;
  s += r.obj === obj ? 35 : 8;                         // objetivo 3L (eixo principal)
  const ov = overlap(r.yrs, horizon.range);
  s += ov > 0 ? 30 : Math.max(0, 30 - 8 * (Math.max(horizon.range[0] - r.yrs[1], r.yrs[0] - horizon.range[1]))); // horizonte
  const d = Math.abs(r.rl - RLV[profile]);
  s += d === 0 ? 20 : d === 1 ? 10 : 3;                // piso de suitability
  s += r.seg.includes(seg) ? 15 : 0;                   // segmento
  return Math.max(0, Math.min(100, Math.round(s)));
}
function fitLabel(s) { return s >= 80 ? "Ótima" : s >= 60 ? "Boa" : s >= 40 ? "Parcial" : "Fraca"; }
function dimsStr(d) { return `M${d.m}·C${d.c}·L${d.l}·X${d.x}`; }

// ---- Small UI atoms -------------------------------------------------------
function Badge({ label, fg, bg }) {
  return <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: fg, background: bg, padding: "2px 7px", borderRadius: 4, whiteSpace: "nowrap", letterSpacing: 0.1 }}>{label}</span>;
}
function Chip({ label }) {
  return <span style={{ fontFamily: SANS, fontSize: 10, fontWeight: 600, color: "#6B5B4E", background: "#F3ECE3", padding: "1px 6px", borderRadius: 999, border: `1px solid ${C.line}` }}>{label}</span>;
}

export default function App() {
  const [pin, setPin] = useState(false);
  const [q, setQ] = useState("");
  const [fObj, setFObj] = useState("Todos");
  const [fSeg, setFSeg] = useState("Todos");
  const [fPro, setFPro] = useState("Todos");
  const [fTax, setFTax] = useState("Todos");
  const [fType, setFType] = useState("Todos");
  const [horizon, setHorizon] = useState(HORIZONS[3]);
  const [expand, setExpand] = useState(null);
  const [sortKey, setSortKey] = useState(null);
  const [sortDir, setSortDir] = useState(1);

  function enablePinpoint() {
    setFObj((v) => (v === "Todos" ? OBJ.LON : v));
    setFSeg((v) => (v === "Todos" ? "Principal" : v));
    setFPro((v) => (v === "Todos" ? "Moderado" : v));
    setPin(true);
  }

  const rows = useMemo(() => {
    let data = MATRIX.filter((r) => {
      if (q && !(`${r.product} ${r.cls} ${r.mandate} ${r.role} ${r.note}`.toLowerCase().includes(q.toLowerCase()))) return false;
      if (fType !== "Todos" && r.ptype !== fType) return false; // vale nos dois modos
      if (!pin) {
        if (fObj !== "Todos" && r.obj !== fObj) return false;
        if (fSeg !== "Todos" && !r.seg.includes(fSeg)) return false;
        if (fPro !== "Todos" && r.risk !== fPro) return false;
        if (fTax !== "Todos" && r.tax !== fTax) return false;
      }
      return true;
    });
    if (pin) {
      const crit = { obj: fObj, seg: fSeg, profile: fPro, horizon };
      data = data.map((r) => ({ ...r, _score: scoreRow(r, crit) })).sort((a, b) => b._score - a._score || a.floor - b.floor);
    } else if (sortKey) {
      const get = (r) => sortKey === "dur" ? r.yrs[0] : sortKey === "floor" ? r.floor : sortKey === "obj" ? r.obj : sortKey === "ptype" ? r.ptype : (r[sortKey] || "");
      data = [...data].sort((a, b) => (get(a) > get(b) ? 1 : get(a) < get(b) ? -1 : 0) * sortDir);
    }
    return data;
  }, [q, pin, fObj, fSeg, fPro, fTax, fType, horizon, sortKey, sortDir]);

  function toggleSort(k) {
    if (pin) return;
    if (sortKey === k) setSortDir((d) => -d); else { setSortKey(k); setSortDir(1); }
  }

  const counts = useMemo(() => ({
    total: MATRIX.length,
    [OBJ.LIQ]: MATRIX.filter((r) => r.obj === OBJ.LIQ).length,
    [OBJ.LON]: MATRIX.filter((r) => r.obj === OBJ.LON).length,
    [OBJ.LEG]: MATRIX.filter((r) => r.obj === OBJ.LEG).length,
  }), []);

  const th = { fontFamily: SANS, fontSize: 10.5, fontWeight: 800, letterSpacing: 0.6, textTransform: "uppercase", color: "#8A7A6B", textAlign: "left", padding: "9px 10px", borderBottom: `2px solid ${C.line}`, whiteSpace: "nowrap", position: "sticky", top: 0, background: C.ivory, zIndex: 2 };
  const td = { fontFamily: SANS, fontSize: 12.5, color: C.ink, padding: "10px", borderBottom: `1px solid ${C.line}`, verticalAlign: "top" };

  return (
    <div style={{ background: C.ivory, minHeight: "100vh", padding: "22px 20px 60px", color: C.ink }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,600;1,6..72,400&family=Nunito+Sans:wght@400;600;700;800&display=swap');
        *{box-sizing:border-box} ::selection{background:${C.gold}44}
        .vrow:hover{background:#FCF9F4}
        .vsort{cursor:pointer;user-select:none} .vsort:hover{color:${C.oxblood}}
        input:focus,select:focus{outline:2px solid ${C.gold}66;outline-offset:1px}
      `}</style>

      <div style={{ maxWidth: 1360, margin: "0 auto" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: 16, borderBottom: `2px solid ${C.oxblood}`, paddingBottom: 14, marginBottom: 16 }}>
          <div>
            <div style={{ fontFamily: SANS, fontSize: 11, fontWeight: 800, letterSpacing: 2, textTransform: "uppercase", color: C.gold }}>Projeto Vision · Consultoria fee-based</div>
            <h1 style={{ fontFamily: SERIF, fontSize: 30, fontWeight: 600, margin: "4px 0 3px", color: C.oxblood, lineHeight: 1.1 }}>Matriz Produto × Duração × Tributação</h1>
            <div style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 15, color: "#6B5B4E" }}>Prateleira completa da consultoria + balanço do cliente — pinpoint por objetivo (3L).</div>
          </div>
          <div style={{ display: "flex", gap: 18, alignItems: "flex-end" }}>
            {[[OBJ.LIQ], [OBJ.LON], [OBJ.LEG]].map(([o]) => (
              <div key={o} style={{ textAlign: "right" }}>
                <div style={{ fontFamily: SERIF, fontSize: 24, color: OBJ_STYLE[o].dot, fontWeight: 600 }}>{counts[o]}</div>
                <div style={{ fontFamily: SANS, fontSize: 10, fontWeight: 700, letterSpacing: 0.4, textTransform: "uppercase", color: "#8A7A6B" }}>{o}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, padding: 14, marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
              <button onClick={() => (pin ? setPin(false) : enablePinpoint())}
                style={{ fontFamily: SANS, fontSize: 13, fontWeight: 800, letterSpacing: 0.3, color: pin ? C.ivory : C.oxblood, background: pin ? C.oxblood : "transparent", border: `1.5px solid ${C.oxblood}`, borderRadius: 999, padding: "7px 16px", cursor: "pointer", display: "flex", alignItems: "center", gap: 7 }}>
                <span style={{ width: 8, height: 8, borderRadius: 999, background: pin ? C.gold : C.oxblood, display: "inline-block" }} />
                Modo Pinpoint {pin ? "· ativo" : ""}
              </button>
              <span style={{ fontFamily: SERIF, fontStyle: "italic", fontSize: 13, color: "#8A7A6B" }}>
                {pin ? "ranqueando por aderência ao objetivo, horizonte, perfil e segmento" : "explore e filtre a prateleira completa"}
              </span>
            </div>
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar produto, classe, papel…"
              style={{ fontFamily: SANS, fontSize: 13, padding: "7px 12px", border: `1px solid ${C.line}`, borderRadius: 8, minWidth: 240, background: C.ivory }} />
          </div>

          {/* Filter/criteria row */}
          <div style={{ display: "flex", gap: 18, flexWrap: "wrap", alignItems: "flex-end" }}>
            <FilterGroup label={pin ? "Objetivo (3L)" : "Objetivo"} value={fObj} onChange={setFObj} options={pin ? [OBJ.LIQ, OBJ.LON, OBJ.LEG] : ["Todos", OBJ.LIQ, OBJ.LON, OBJ.LEG]} />
            {pin && (
              <div>
                <div style={lblStyle}>Horizonte</div>
                <select value={horizon.key} onChange={(e) => setHorizon(HORIZONS.find((h) => h.key === e.target.value))} style={selStyle}>
                  {HORIZONS.map((h) => <option key={h.key} value={h.key}>{h.label}</option>)}
                </select>
              </div>
            )}
            <FilterGroup label={pin ? "Perfil (piso)" : "Piso suitability"} value={fPro} onChange={setFPro} options={pin ? PROFILES : ["Todos", ...PROFILES]} />
            <div>
              <div style={lblStyle}>Tipo</div>
              <select value={fType} onChange={(e) => setFType(e.target.value)} style={selStyle}>
                <option value="Todos">Todos</option>
                {Object.entries(PTYPE).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
            <div>
              <div style={lblStyle}>Segmento</div>
              <select value={fSeg} onChange={(e) => setFSeg(e.target.value)} style={selStyle}>
                {(pin ? SEGMENTS : ["Todos", ...SEGMENTS]).map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            {!pin && (
              <div>
                <div style={lblStyle}>Regime tributário</div>
                <select value={fTax} onChange={(e) => setFTax(e.target.value)} style={selStyle}>
                  <option value="Todos">Todos</option>
                  {Object.entries(TAX).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                </select>
              </div>
            )}
            <div style={{ marginLeft: "auto", fontFamily: SANS, fontSize: 12, color: "#8A7A6B", paddingBottom: 4 }}>
              {rows.length} de {counts.total} linhas
            </div>
          </div>
        </div>

        {/* Table */}
        <div style={{ background: C.paper, border: `1px solid ${C.line}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ overflowX: "auto" }}>
            <table style={{ borderCollapse: "collapse", width: "100%", minWidth: pin ? 1240 : 1140 }}>
              <thead>
                <tr>
                  {pin && <th style={{ ...th, width: 128 }}>Aderência</th>}
                  <th style={{ ...th, position: "sticky", left: 0, zIndex: 3, minWidth: 230 }}>Produto / veículo</th>
                  <th style={{ ...th }} className="vsort" onClick={() => toggleSort("cls")}>Classe</th>
                  <th style={{ ...th }} className="vsort" onClick={() => toggleSort("dur")}>Duração</th>
                  <th style={{ ...th }}>Liquidez</th>
                  <th style={{ ...th }}>Regime tributário</th>
                  <th style={{ ...th }} className="vsort" onClick={() => toggleSort("floor")}>Alíquota (LP)</th>
                  <th style={{ ...th }} className="vsort" onClick={() => toggleSort("obj")}>Objetivo 3L</th>
                  <th style={{ ...th }} className="vsort" onClick={() => toggleSort("risk")}>Risco · Piso</th>
                  <th style={{ ...th }}>Segmentos</th>
                  <th style={{ ...th }}>Status</th>
                  <th style={{ ...th, width: 30 }} />
                </tr>
              </thead>
              <tbody>
                {rows.map((r, i) => {
                  const open = expand === r.id;
                  const medal = pin && i < 3;
                  return (
                    <React.Fragment key={r.id}>
                      <tr className="vrow" style={{ cursor: "pointer", background: medal ? (i === 0 ? "#FBF4E6" : "#FCF9F2") : undefined }} onClick={() => setExpand(open ? null : r.id)}>
                        {pin && (
                          <td style={{ ...td }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                              <div style={{ fontFamily: SERIF, fontSize: 17, fontWeight: 600, color: r._score >= 60 ? C.oxblood : "#8A7A6B", minWidth: 28 }}>{r._score}</div>
                              <div style={{ flex: 1 }}>
                                <div style={{ height: 6, background: "#EFE7DC", borderRadius: 999, overflow: "hidden" }}>
                                  <div style={{ width: `${r._score}%`, height: "100%", background: r._score >= 80 ? C.gold : r._score >= 60 ? C.navy : "#C9BBA9" }} />
                                </div>
                                <div style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 700, color: "#8A7A6B", marginTop: 2 }}>{medal ? `${i + 1}ª · ` : ""}{fitLabel(r._score)}</div>
                              </div>
                            </div>
                          </td>
                        )}
                        <td style={{ ...td, position: "sticky", left: 0, background: open ? "#FCF9F4" : (medal ? (i === 0 ? "#FBF4E6" : "#FCF9F2") : C.paper), zIndex: 1, borderRight: `1px solid ${C.line}` }}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
                            <span title={PTYPE[r.ptype].label} style={{ width: 7, height: 7, borderRadius: 999, background: PTYPE[r.ptype].dot, display: "inline-block", flexShrink: 0, position: "relative", top: -1 }} />
                            <div>
                              <div style={{ fontFamily: SANS, fontSize: 13.5, fontWeight: 800, color: C.oxblood, lineHeight: 1.2 }}>{r.product}</div>
                              <div style={{ fontFamily: SANS, fontSize: 11, color: "#9A8A7B", marginTop: 1 }}>{r.mandate}</div>
                            </div>
                          </div>
                        </td>
                        <td style={td}><span style={{ fontSize: 11.5, color: "#6B5B4E" }}>{r.cls}</span></td>
                        <td style={td}>
                          <div style={{ fontWeight: 700, fontSize: 12 }}>{r.dur}</div>
                          <div style={{ fontSize: 10.5, color: "#9A8A7B" }}>{r.yrs[1] >= 40 ? `${r.yrs[0]}a+` : `${r.yrs[0]}–${r.yrs[1]}a`}</div>
                        </td>
                        <td style={{ ...td, fontSize: 11.5, color: "#6B5B4E", maxWidth: 150 }}>{r.liq}</td>
                        <td style={td}><Badge label={TAX[r.tax].label} fg={TAX[r.tax].fg} bg={TAX[r.tax].bg} /></td>
                        <td style={td}>
                          <div style={{ display: "flex", alignItems: "baseline", gap: 5 }}>
                            <span style={{ fontFamily: SERIF, fontSize: 16, fontWeight: 600, color: r.floor === 0 ? "#0E6B43" : C.ink }}>{String(r.floor).replace(".", ",")}%</span>
                          </div>
                          <div style={{ fontSize: 10, color: "#9A8A7B", maxWidth: 150 }}>{r.rate}</div>
                        </td>
                        <td style={td}><Badge label={r.obj} fg={OBJ_STYLE[r.obj].fg} bg={OBJ_STYLE[r.obj].bg} /></td>
                        <td style={{ ...td, whiteSpace: "nowrap" }}>
                          <div style={{ fontWeight: 700, fontSize: 12 }}>{r.risk}</div>
                          <div style={{ fontFamily: MONO, fontSize: 9.5, color: "#9A8A7B", marginTop: 1 }}>
                            {r.dims ? dimsStr(r.dims) : (r.ptype === "inv" ? "por composição" : PTYPE[r.ptype].label.toLowerCase())}
                          </div>
                        </td>
                        <td style={td}><div style={{ display: "flex", gap: 3, flexWrap: "wrap", maxWidth: 130 }}>{r.seg.map((s) => <Chip key={s} label={s} />)}</div></td>
                        <td style={td}>
                          <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontFamily: SANS, fontSize: 10.5, fontWeight: 700, color: r.status === "review" ? "#9A4A06" : "#0E6B43" }}>
                            <span style={{ width: 7, height: 7, borderRadius: 999, background: r.status === "review" ? "#D9822B" : "#2FA36B" }} />
                            {r.status === "review" ? "A validar" : "Base regra"}
                          </span>
                        </td>
                        <td style={{ ...td, color: "#B8A794", fontSize: 13 }}>{open ? "▾" : "▸"}</td>
                      </tr>
                      {open && (
                        <tr>
                          <td colSpan={pin ? 13 : 12} style={{ background: "#FBF7F0", borderBottom: `1px solid ${C.line}`, padding: "14px 18px" }}>
                            <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr 1fr", gap: 20 }}>
                              <div>
                                <DetailLabel>Leitura de wealth planning</DetailLabel>
                                <div style={{ fontFamily: SERIF, fontSize: 14, lineHeight: 1.5, color: C.ink }}>{r.note}</div>
                              </div>
                              <div>
                                <DetailLabel>Mecânica tributária</DetailLabel>
                                <DetailRow k="Tipo" v={PTYPE[r.ptype].label} />
                                <DetailRow k="Papel" v={r.role} />
                                <DetailRow k="Evento" v={r.ev} />
                                <DetailRow k="Alíquota" v={r.rate} />
                                <DetailRow k="IOF <30d" v={r.iof ? "Aplicável" : "Não aplicável"} />
                              </div>
                              <div>
                                <DetailLabel>Risco do produto</DetailLabel>
                                {r.dims ? (
                                  <div style={{ marginBottom: 8 }}>
                                    {[["Mercado", r.dims.m], ["Crédito", r.dims.c], ["Liquidez", r.dims.l], ["Câmbio", r.dims.x]].map(([k, v]) => (
                                      <div key={k} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 3 }}>
                                        <span style={{ fontFamily: SANS, fontSize: 11, fontWeight: 700, color: "#9A8A7B", minWidth: 58 }}>{k}</span>
                                        <div style={{ display: "flex", gap: 2 }}>
                                          {[1, 2, 3].map((n) => <span key={n} style={{ width: 14, height: 6, borderRadius: 3, background: n <= v ? (v >= 3 ? C.red : v === 2 ? C.gold : C.navy) : "#EFE7DC" }} />)}
                                        </div>
                                        <span style={{ fontFamily: MONO, fontSize: 10, color: "#9A8A7B" }}>{v}/3</span>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <div style={{ fontFamily: SANS, fontSize: 12, color: "#6B5B4E", marginBottom: 8 }}>
                                    {r.ptype === "inv" ? "Por composição — herda o risco dos ativos contratados." : `${PTYPE[r.ptype].label}: sem risco de investimento — regras próprias (custo/cobertura/estrutura).`}
                                  </div>
                                )}
                                <DetailLabel>Base regulatória</DetailLabel>
                                <div style={{ fontFamily: SANS, fontSize: 12, color: "#6B5B4E", lineHeight: 1.5 }}>{r.basis}</div>
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

        {/* Legend + disclaimer */}
        <div style={{ display: "flex", justifyContent: "space-between", gap: 20, flexWrap: "wrap", marginTop: 14 }}>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase", color: "#8A7A6B", marginRight: 4 }}>Tipos:</span>
            {Object.entries(PTYPE).map(([k, v]) => (
              <span key={k} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontFamily: SANS, fontSize: 10.5, fontWeight: 700, color: "#6B5B4E" }}>
                <span style={{ width: 7, height: 7, borderRadius: 999, background: v.dot, display: "inline-block" }} />{v.label}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontFamily: SANS, fontSize: 10.5, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase", color: "#8A7A6B", marginRight: 4 }}>Regimes:</span>
            {Object.entries(TAX).map(([k, v]) => <Badge key={k} label={v.label} fg={v.fg} bg={v.bg} />)}
          </div>
        </div>
        <div style={{ marginTop: 16, borderTop: `1px solid ${C.line}`, paddingTop: 12, fontFamily: SANS, fontSize: 11, color: "#9A8A7B", lineHeight: 1.6 }}>
          <strong style={{ color: "#8A7A6B" }}>v0.3 ilustrativa — não é aconselhamento.</strong> Alíquotas efetivas de longo prazo (coluna LP) e regimes refletem as regras vigentes em meados de 2026 — Lei 15.270/2025 (IRPF/dividendos/IRPFM), Lei 14.754/2023 (offshore/fundos/trusts), EC 132/2023 + LC 227/2026 (ITCMD), STF Tema 1.214 (previdência) e Lei 14.803/2024 (opção do regime de previdência no resgate). Dois overlays de alto patrimônio (IRPFM até 10% acima de R$600k/ano; dividendos 10% acima de R$50k/mês) atuam no nível do domicílio, não da linha. Dois IOFs de entrada de 2025–26 atuam fora da coluna IOF&lt;30d: 5% sobre aportes anuais de VGBL acima de R$600k/CPF (Decreto 12.499/2025, revalidado pelo STF em 16/jul/2025) e 0,38% na subscrição de FIDC. Modelo de risco: o piso de suitability segue as 3 bandas do questionário Vision (VIS-806 — Conservador/Moderado/Agressivo; ilustrativo até o alinhamento com a API oficial de perfil do banco); as dimensões M/C/L/X (mercado, crédito, liquidez, câmbio, 0–3) descrevem o produto; o risco do objetivo — probabilidade de shortfall vs. horizonte — é papel do motor determinístico, não desta tabela. Linhas de crédito e proteção não têm risco de investimento: carregam CET e cobertura, comparados sempre contra o retorno líquido de IR. Status "A validar" marca pontos sensíveis/judicializados a confirmar com Tributário; a MP 1.303/2025 (unificação da tributação de aplicações, versão final a 18%) perdeu vigência em 8/out/2025 — retirada de pauta e não votada; as regras anteriores seguem válidas e o tema pode voltar como projeto de lei em 2026. Ratificar toda cifra contra a legislação e o catálogo antes de uso com cliente.
        </div>
      </div>
    </div>
  );
}

// ---- Helper components -----------------------------------------------------
const lblStyle = { fontFamily: SANS, fontSize: 10, fontWeight: 800, letterSpacing: 0.5, textTransform: "uppercase", color: "#8A7A6B", marginBottom: 5 };
const selStyle = { fontFamily: SANS, fontSize: 12.5, padding: "6px 10px", border: `1px solid ${C.line}`, borderRadius: 8, background: C.ivory, color: C.ink, cursor: "pointer" };

function FilterGroup({ label, value, onChange, options }) {
  return (
    <div>
      <div style={lblStyle}>{label}</div>
      <div style={{ display: "flex", gap: 4 }}>
        {options.map((o) => {
          const active = value === o;
          return (
            <button key={o} onClick={() => onChange(o)}
              style={{ fontFamily: SANS, fontSize: 12, fontWeight: active ? 800 : 600, color: active ? C.ivory : "#6B5B4E", background: active ? C.navy : C.ivory, border: `1px solid ${active ? C.navy : C.line}`, borderRadius: 7, padding: "6px 11px", cursor: "pointer", whiteSpace: "nowrap" }}>
              {o}
            </button>
          );
        })}
      </div>
    </div>
  );
}
function DetailLabel({ children }) {
  return <div style={{ fontFamily: SANS, fontSize: 9.5, fontWeight: 800, letterSpacing: 0.7, textTransform: "uppercase", color: C.gold, marginBottom: 6 }}>{children}</div>;
}
function DetailRow({ k, v }) {
  return (
    <div style={{ display: "flex", gap: 8, marginBottom: 4 }}>
      <span style={{ fontFamily: SANS, fontSize: 11.5, fontWeight: 700, color: "#9A8A7B", minWidth: 62 }}>{k}</span>
      <span style={{ fontFamily: SANS, fontSize: 11.5, color: C.ink }}>{v}</span>
    </div>
  );
}
