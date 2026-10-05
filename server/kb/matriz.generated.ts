// GERADO por scripts/kb/build-kb.mjs a partir de conhecimento/ — NÃO EDITAR À MÃO.
// Edite o conhecimento e rode: npm run kb:build
import type { MatrizData } from '../lib/kb-types.js';

export const MATRIZ: MatrizData = {
 "meta": {
  "fonte": "vision_goal_matrix_v1.jsx v1.0 (jul/2026) — a matriz vigente do projeto Vision (decisão do dono de 22/07/2026); texto descritivo dos 66 de base herdado da vision_tax_duration_matrix.jsx v0.3",
  "registro_fonte": "F1.5 (conjunto, motor, estratégias, objetivos) · F1.1 (texto descritivo)",
  "aviso": "DADOS ILUSTRATIVOS — ratificar com o Tributário antes de qualquer uso com cliente; as 5 linhas novas da v1.0 estão em status review (Tributário, Risco e Compliance). Uso na Bia: SOMENTE lente interna, e só DEPOIS que o número do plano da pessoa existe na conversa (plano antes do produto). NUNCA citar ao cliente produtos, alíquotas ou regimes.",
  "fundamentos": "Lei 15.270/2025, Lei 14.754/2023, LC 227/2026, STF Tema 1.214, Lei 14.803/2024, Decreto 12.499/2025; MP 1.303/2025 caducou em 08/10/2025.",
  "tax_label": {
   "isento": "Isento PF",
   "rf": "RF regressivo",
   "comecotas": "Come-cotas",
   "gcrv": "Ganho cap. RV",
   "etf": "ETF (fonte)",
   "etfrf": "ETF-RF regressivo",
   "prev": "Previdência regr.",
   "offshore": "Offshore 15%/a",
   "gcprog": "Ganho cap. progr.",
   "itcmd": "ITCMD sucessão",
   "semir": "Sem IR",
   "porativo": "Ativo a ativo",
   "deducao": "Dedução IRPF",
   "irpf": "IRPF progressivo",
   "pjdiv": "Dividendos + IRPFM"
  },
  "ptype_label": {
   "inv": "Investimento",
   "prot": "Proteção",
   "cred": "Crédito",
   "estr": "Estrutura",
   "mod": "Modelado"
  }
 },
 "produtos": [
  {
   "id": "selic",
   "ptype": "inv",
   "product": "Tesouro Selic",
   "mandate": "Caixa / Selic",
   "cls": "Liquidez / caixa",
   "dur": "Curtíssimo",
   "yrs": [
    0,
    1
   ],
   "liq": "D+1 · sem marcação",
   "tax": "rf",
   "rate": "22,5%→15%",
   "floor": 15,
   "ev": "No resgate",
   "iof": true,
   "obj": "Liquidez",
   "role": "Reserva de emergência",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 0,
    "c": 0,
    "l": 0,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Tabela regressiva RF",
   "note": "Único título sem marcação a mercado; capital sempre preservado — o veículo de reserva mais limpo.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "cdb-liq",
   "ptype": "inv",
   "product": "CDB liquidez diária",
   "mandate": "Caixa / Selic",
   "cls": "Renda fixa bancária",
   "dur": "Curtíssimo",
   "yrs": [
    0,
    1
   ],
   "liq": "D+0 · FGC R$250k",
   "tax": "rf",
   "rate": "22,5%→15%",
   "floor": 15,
   "ev": "No resgate",
   "iof": true,
   "obj": "Liquidez",
   "role": "Reserva / caixa",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 0,
    "c": 1,
    "l": 0,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Tabela regressiva RF · FGC",
   "note": "Core de reserva, familiar; sem come-cotas. Versões a prazo penalizam saída antecipada.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "fundo-di",
   "ptype": "inv",
   "product": "Fundo DI / Referenciado DI",
   "mandate": "Caixa / Selic",
   "cls": "Fundos (aberto)",
   "dur": "Curtíssimo",
   "yrs": [
    0,
    1
   ],
   "liq": "D+0 / D+1",
   "tax": "comecotas",
   "rate": "22,5%→15% + come-cotas",
   "floor": 15,
   "ev": "Semestral (mai/nov) + resgate",
   "iof": true,
   "obj": "Liquidez",
   "role": "Caixa conveniente",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 0,
    "c": 1,
    "l": 0,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Come-cotas + regressiva",
   "note": "Come-cotas quebra a composição silenciosamente; atenção à taxa de administração.",
   "nota_v1": "",
   "marcas_motor": [
    "drag"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "poupanca",
   "ptype": "inv",
   "product": "Poupança",
   "mandate": "Caixa / Selic",
   "cls": "Liquidez / caixa",
   "dur": "Curtíssimo",
   "yrs": [
    0,
    1
   ],
   "liq": "Saque livre · rende no aniversário",
   "tax": "isento",
   "rate": "0%",
   "floor": 0,
   "ev": "—",
   "iof": false,
   "obj": "Liquidez",
   "role": "Default por inércia",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 0,
    "c": 0,
    "l": 0,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime"
   ],
   "status": "base",
   "basis": "Isenção legal",
   "note": "TR + 0,5%/mês — perde para inflação. O hábito mais corrigível; o que o Vision substitui.",
   "nota_v1": "",
   "marcas_motor": [
    "weak"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "lci-lca",
   "ptype": "inv",
   "product": "LCI / LCA (pós-fixada)",
   "mandate": "Inflação / crédito",
   "cls": "Renda fixa bancária",
   "dur": "Curto",
   "yrs": [
    1,
    3
   ],
   "liq": "Carência, depois líquida/venc.",
   "tax": "isento",
   "rate": "0%",
   "floor": 0,
   "ev": "No resgate/venc.",
   "iof": false,
   "obj": "Liquidez",
   "role": "Renda fixa tax-free",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 0,
    "c": 1,
    "l": 2,
    "x": 0
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Isenção PF · FGC",
   "note": "Isenta de IR; sticky por design. Risco de crédito no emissor (FGC até R$250k). Vencedor silencioso da RF. Carência mínima vigente a confirmar (mudou 2022–24).",
   "nota_v1": "",
   "marcas_motor": [
    "matchableL"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "ipca",
   "ptype": "inv",
   "product": "Tesouro IPCA+",
   "mandate": "Inflação (IPCA+)",
   "cls": "Títulos em custódia",
   "dur": "Longo",
   "yrs": [
    5,
    15
   ],
   "liq": "D+1 · marcação a mercado",
   "tax": "rf",
   "rate": "15% (2a+)",
   "floor": 15,
   "ev": "No resgate",
   "iof": true,
   "obj": "Longevidade",
   "role": "Proteção poder de compra",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 2,
    "c": 0,
    "l": 0,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Tabela regressiva RF",
   "note": "Principal protegido da inflação se levado ao vencimento; oscila (MtM) se vendido antes — o risco de mercado colapsa quando duration ≤ horizonte do objetivo.",
   "nota_v1": "",
   "marcas_motor": [
    "dm"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "ipca-cupom",
   "ptype": "inv",
   "product": "Tesouro IPCA+ Juros Semestrais",
   "mandate": "Inflação (IPCA+)",
   "cls": "Títulos em custódia",
   "dur": "Longo",
   "yrs": [
    5,
    15
   ],
   "liq": "Cupom semestral · MtM",
   "tax": "rf",
   "rate": "15% (2a+)",
   "floor": 15,
   "ev": "Semestral (cupom) + resgate",
   "iof": true,
   "obj": "Longevidade",
   "role": "Renda protegida da inflação",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 2,
    "c": 0,
    "l": 0,
    "x": 0
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Tabela regressiva RF",
   "note": "Core da decumulação (Helena): renda protegida da inflação na aposentadoria.",
   "nota_v1": "",
   "marcas_motor": [
    "dm",
    "income"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "rendamais",
   "ptype": "inv",
   "product": "Tesouro Renda+ (NTN-B1)",
   "mandate": "Inflação (IPCA+)",
   "cls": "Títulos em custódia",
   "dur": "Vitalício",
   "yrs": [
    10,
    40
   ],
   "liq": "Carência 60d · 240 pgtos mensais",
   "tax": "rf",
   "rate": "15% (2a+)",
   "floor": 15,
   "ev": "Fase de pagamento",
   "iof": false,
   "obj": "Longevidade",
   "role": "Renda de aposentadoria",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 2,
    "c": 0,
    "l": 1,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Regressiva RF · isenção custódia até 4 SM",
   "note": "Cadência de pagamento (não lump); desenhado com R. Merton. Disciplina comportamental brasileira.",
   "nota_v1": "",
   "marcas_motor": [
    "dm",
    "income"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "educamais",
   "ptype": "inv",
   "product": "Tesouro Educa+",
   "mandate": "Inflação (IPCA+)",
   "cls": "Títulos em custódia",
   "dur": "Longo",
   "yrs": [
    5,
    18
   ],
   "liq": "Carência 60d · 60 pgtos mensais",
   "tax": "rf",
   "rate": "15% (2a+)",
   "floor": 15,
   "ev": "Fase de pagamento",
   "iof": false,
   "obj": "Longevidade",
   "role": "Objetivo educação",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 2,
    "c": 0,
    "l": 1,
    "x": 0
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Tabela regressiva RF",
   "note": "Financiamento programado de faculdade — encaixe natural para famílias com filhos (Fernanda).",
   "nota_v1": "",
   "marcas_motor": [
    "dm"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "cri-cra",
   "ptype": "inv",
   "product": "CRI / CRA",
   "mandate": "Crédito privado",
   "cls": "Renda fixa bancária",
   "dur": "Longo",
   "yrs": [
    4,
    10
   ],
   "liq": "Venc. (secundário fino)",
   "tax": "isento",
   "rate": "0%",
   "floor": 0,
   "ev": "No vencimento",
   "iof": false,
   "obj": "Longevidade",
   "role": "RF isenta longa",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 1,
    "c": 2,
    "l": 3,
    "x": 0
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Isenção PF (imob./agro)",
   "note": "Uma LCI/LCA mais longa, tax-free; risco de crédito no emissor e iliquidez. Tickets maiores.",
   "nota_v1": "",
   "marcas_motor": [
    "income"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "deb-inc",
   "ptype": "inv",
   "product": "Debêntures incentivadas",
   "mandate": "Crédito privado",
   "cls": "Renda fixa bancária",
   "dur": "Longo",
   "yrs": [
    4,
    10
   ],
   "liq": "Venc. (secundário)",
   "tax": "isento",
   "rate": "0%",
   "floor": 0,
   "ev": "No vencimento",
   "iof": false,
   "obj": "Longevidade",
   "role": "Crédito corporativo isento",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 1,
    "c": 2,
    "l": 2,
    "x": 0
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Lei 12.431/2011 (infraestrutura)",
   "note": "Renda fixa corporativa com bônus tributário em infra. Isenta de IR para PF. Não confundir com a debênture de infraestrutura da Lei 14.801/2024 — nela o benefício é do EMISSOR e a PF é tributada normalmente.",
   "nota_v1": "",
   "marcas_motor": [
    "income"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "deb-reg",
   "ptype": "inv",
   "product": "Debêntures regulares",
   "mandate": "Crédito privado",
   "cls": "Renda fixa bancária",
   "dur": "Médio",
   "yrs": [
    3,
    7
   ],
   "liq": "Venc. (secundário)",
   "tax": "rf",
   "rate": "22,5%→15%",
   "floor": 15,
   "ev": "No resgate/venc.",
   "iof": false,
   "obj": "Longevidade",
   "role": "Crédito privado",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 1,
    "c": 2,
    "l": 2,
    "x": 0
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Tabela regressiva RF",
   "note": "Pagam IR (vs. incentivadas isentas). Yield sobre o DI com risco de crédito.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "fundo-cp",
   "ptype": "inv",
   "product": "Fundo RF Crédito Privado",
   "mandate": "Crédito privado",
   "cls": "Fundos (aberto)",
   "dur": "Médio",
   "yrs": [
    1,
    3
   ],
   "liq": "D+30 (alguns D+90)",
   "tax": "comecotas",
   "rate": "22,5%→15% + come-cotas",
   "floor": 15,
   "ev": "Semestral + resgate",
   "iof": true,
   "obj": "Longevidade",
   "role": "Yield pickup sobre DI",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 1,
    "c": 2,
    "l": 2,
    "x": 0
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Come-cotas + regressiva",
   "note": "Yield sobre o DI via crédito; come-cotas arrasta. Atenção ao risco de crédito do pool.",
   "nota_v1": "",
   "marcas_motor": [
    "drag"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "fundo-imab",
   "ptype": "inv",
   "product": "Fundo Inflação (IMA-B)",
   "mandate": "Inflação (IPCA+)",
   "cls": "Fundos (aberto)",
   "dur": "Longo",
   "yrs": [
    3,
    10
   ],
   "liq": "D+1 a D+30",
   "tax": "comecotas",
   "rate": "22,5%→15% + come-cotas",
   "floor": 15,
   "ev": "Semestral + resgate",
   "iof": true,
   "obj": "Longevidade",
   "role": "Sleeve longa anti-inflação",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 2,
    "c": 1,
    "l": 1,
    "x": 0
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Come-cotas + regressiva",
   "note": "Substitui Tesouro IPCA+ com diversificação; come-cotas reduz a eficiência vs. o título direto.",
   "nota_v1": "",
   "marcas_motor": [
    "drag"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "pgbl",
   "ptype": "inv",
   "product": "PGBL",
   "mandate": "Por mandato − taxa",
   "cls": "Previdência",
   "dur": "Vitalício",
   "yrs": [
    10,
    40
   ],
   "liq": "Resgate / renda",
   "tax": "prev",
   "rate": "35%→10% (10a+)",
   "floor": 10,
   "ev": "Na saída / renda",
   "iof": false,
   "obj": "Longevidade",
   "role": "Dedução 12% + regressiva",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 1,
    "c": 1,
    "l": 2,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Regressiva previdência · dedução 12% · Lei 14.803/2024",
   "note": "Três benefícios: dedução (12% da renda, só declarante completa) + regressiva + sucessão fora do inventário. Lei 14.803/2024: a opção pelo regime (regressivo/progressivo) passou a ser feita no momento do resgate/benefício — decisão flexibilizada. Risco: conforme o FIE contratado.",
   "nota_v1": "[A-02] +Retail",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "vgbl",
   "ptype": "inv",
   "product": "VGBL",
   "mandate": "Por mandato − taxa",
   "cls": "Previdência",
   "dur": "Vitalício",
   "yrs": [
    10,
    40
   ],
   "liq": "Resgate / renda",
   "tax": "prev",
   "rate": "35%→10% (só ganho)",
   "floor": 10,
   "ev": "Na saída / renda",
   "iof": false,
   "obj": "Longevidade",
   "role": "Regressiva + sucessão",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 1,
    "c": 1,
    "l": 2,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Regressiva previdência (só ganho) · Lei 14.803/2024",
   "note": "Sem dedução; tributa só o ganho. Ideal para declarante pela simplificada e alocação sucessória. IOF de entrada: 5% sobre aportes anuais acima de R$600k/CPF (Decreto 12.499/2025) — PGBL não é afetado; fracionar entre anos evita. Lei 14.803/2024: opção de regime no resgate. Risco: conforme o FIE.",
   "nota_v1": "[A-02] +Retail",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "acoes",
   "ptype": "inv",
   "product": "Ações BR (buy & hold)",
   "mandate": "Ações BR",
   "cls": "Títulos em custódia",
   "dur": "Longo",
   "yrs": [
    5,
    15
   ],
   "liq": "B3 · D+2",
   "tax": "gcrv",
   "rate": "15% + isenção R$20k/mês",
   "floor": 15,
   "ev": "Na venda",
   "iof": false,
   "obj": "Longevidade",
   "role": "Crescimento",
   "risk": "Agressivo",
   "rl": 3,
   "dims": {
    "m": 3,
    "c": 0,
    "l": 0,
    "x": 0
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Ganho de capital RV · isenção spot",
   "note": "Isenção de R$20k/mês em vendas spot (que ETF não tem); dividendos isentos até o teto de 2026.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "etf-acoes",
   "ptype": "inv",
   "product": "ETF de ações (BOVA11)",
   "mandate": "Ações BR",
   "cls": "Títulos em custódia",
   "dur": "Longo",
   "yrs": [
    5,
    15
   ],
   "liq": "B3 · a qualquer hora",
   "tax": "etf",
   "rate": "15% · sem isenção 20k",
   "floor": 15,
   "ev": "Na venda",
   "iof": false,
   "obj": "Longevidade",
   "role": "Mercado inteiro num ticker",
   "risk": "Agressivo",
   "rl": 3,
   "dims": {
    "m": 3,
    "c": 0,
    "l": 0,
    "x": 0
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Ganho de capital · dividendos tributados",
   "note": "Simples e barato para ter o índice; tributação menos amigável que ações diretas (sem isenção de R$20k).",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "fundo-acoes",
   "ptype": "inv",
   "product": "Fundo de ações",
   "mandate": "Ações BR",
   "cls": "Fundos (aberto)",
   "dur": "Longo",
   "yrs": [
    5,
    15
   ],
   "liq": "D+30",
   "tax": "gcrv",
   "rate": "15% · sem come-cotas",
   "floor": 15,
   "ev": "No resgate",
   "iof": false,
   "obj": "Longevidade",
   "role": "Gestão delegada",
   "risk": "Agressivo",
   "rl": 3,
   "dims": {
    "m": 3,
    "c": 0,
    "l": 2,
    "x": 0
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "15% s/ ganho · sem come-cotas",
   "note": "Fundos de ação não sofrem come-cotas; razoavelmente eficiente para dinheiro longo em ações.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "fii",
   "ptype": "inv",
   "product": "FII (Fundo Imobiliário)",
   "mandate": "Imobiliário / renda",
   "cls": "Títulos em custódia",
   "dur": "Longo",
   "yrs": [
    5,
    15
   ],
   "liq": "B3 · líquida",
   "tax": "isento",
   "rate": "Distrib. isenta · 20% no ganho",
   "floor": 0,
   "ev": "Distrib. mensal + venda",
   "iof": false,
   "obj": "Longevidade",
   "role": "Renda isenta mensal",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 2,
    "c": 1,
    "l": 1,
    "x": 0
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Distribuição isenta PF · ganho 20%",
   "note": "Motor de renda isenta (Helena). O ganho de capital na venda de cotas é tributado a 20%. Isenção exige 50+ cotistas, negociação em bolsa e cotista PF <10%.",
   "nota_v1": "",
   "marcas_motor": [
    "income"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "multi",
   "ptype": "inv",
   "product": "Fundo Multimercado",
   "mandate": "Multimercado",
   "cls": "Fundos (aberto)",
   "dur": "Médio",
   "yrs": [
    3,
    7
   ],
   "liq": "D+30 cotização + D+1",
   "tax": "comecotas",
   "rate": "22,5%→15% + come-cotas",
   "floor": 15,
   "ev": "Semestral + resgate",
   "iof": true,
   "obj": "Longevidade",
   "role": "Gestão ativa",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 2,
    "c": 1,
    "l": 2,
    "x": 0
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Come-cotas + regressiva",
   "note": "Sleeve de gestão ativa (juros/FX/ações); come-cotas arrasta a composição. Confirmar classificação curto vs. longo prazo do fundo — muda o piso (20% vs. 15%).",
   "nota_v1": "[B-04] +Prime",
   "marcas_motor": [
    "drag"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "intl",
   "ptype": "inv",
   "product": "Internacional / Offshore",
   "mandate": "Internacional",
   "cls": "Internacional",
   "dur": "Longo",
   "yrs": [
    5,
    15
   ],
   "liq": "Varia (conta/fundo)",
   "tax": "offshore",
   "rate": "15% flat anual",
   "floor": 15,
   "ev": "Anual (31/dez) ou realização",
   "iof": false,
   "obj": "Longevidade",
   "role": "Diversificação + moeda",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 2,
    "c": 1,
    "l": 2,
    "x": 3
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Lei 14.754/2023",
   "note": "Fim do diferimento; substância importa. FX é a maior incerteza. Escala ~11% Principal → ~34% Private.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "bdr",
   "ptype": "inv",
   "product": "BDRs",
   "mandate": "Internacional",
   "cls": "Títulos em custódia",
   "dur": "Longo",
   "yrs": [
    5,
    15
   ],
   "liq": "B3",
   "tax": "gcrv",
   "rate": "15% · dividendos tributados",
   "floor": 15,
   "ev": "Na venda",
   "iof": false,
   "obj": "Longevidade",
   "role": "Ações globais em BRL",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 3,
    "c": 0,
    "l": 1,
    "x": 3
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Ganho de capital RV",
   "note": "Acesso a ações estrangeiras em BRL sem conta offshore; dividendos estrangeiros passam por tributação. Se BDR tem a isenção de R$20k/mês: a confirmar.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "fidc",
   "ptype": "inv",
   "product": "FIDC",
   "mandate": "Crédito privado",
   "cls": "Fundos (aberto)",
   "dur": "Médio",
   "yrs": [
    2,
    5
   ],
   "liq": "Fechado / semi-líquido",
   "tax": "gcrv",
   "rate": "15% (qualificado, sem come-cotas)",
   "floor": 15,
   "ev": "Na realização",
   "iof": false,
   "obj": "Longevidade",
   "role": "Aumentador de retorno",
   "risk": "Agressivo",
   "rl": 3,
   "dims": {
    "m": 1,
    "c": 3,
    "l": 3,
    "x": 0
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Lei 14.754 (exceção FIDC)",
   "note": "Spread alto, risco de crédito no pool; para perfis sofisticados. Qualificado escapa do come-cotas — confirmar classificação Entidade de Investimento do fundo específico. Subscrição sofre IOF de 0,38% (desde jul/2025).",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "alts",
   "ptype": "inv",
   "product": "Alternativos (PE / FIP)",
   "mandate": "Alternativos",
   "cls": "Títulos em custódia",
   "dur": "Vitalício",
   "yrs": [
    7,
    15
   ],
   "liq": "Fechado / ilíquido",
   "tax": "gcrv",
   "rate": "15% (FIP qualificado)",
   "floor": 15,
   "ev": "Na realização / desinv.",
   "iof": false,
   "obj": "Longevidade",
   "role": "Prêmio de iliquidez",
   "risk": "Agressivo",
   "rl": 3,
   "dims": {
    "m": 3,
    "c": 2,
    "l": 3,
    "x": 0
   },
   "seg": [
    "Private"
   ],
   "status": "review",
   "basis": "Lei 14.754 (exceção FIP)",
   "note": "Prêmio de iliquidez (~+10% real, ilustrativo); só Private. FIP qualificado escapa do come-cotas.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "seguro",
   "ptype": "prot",
   "product": "Seguro de vida (termo)",
   "mandate": "—",
   "cls": "Proteção / seguro",
   "dur": "Vitalício",
   "yrs": [
    0,
    40
   ],
   "liq": "Pagamento no evento coberto",
   "tax": "isento",
   "rate": "Isento · fora do ITCMD",
   "floor": 0,
   "ev": "Na morte (evento)",
   "iof": false,
   "obj": "Legado",
   "role": "Liquidez de espólio",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Código Civil (não é herança)",
   "note": "A ferramenta de liquidez sucessória mais pura: paga rápido, contorna o inventário, isento aos beneficiários. Dimensionar para pagar o ITCMD do espólio.",
   "nota_v1": "[A-01] +Retail",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "prev-suc",
   "ptype": "estr",
   "product": "Previdência como sucessão",
   "mandate": "Por mandato − taxa",
   "cls": "Previdência",
   "dur": "Vitalício",
   "yrs": [
    0,
    40
   ],
   "liq": "Beneficiários · acesso rápido",
   "tax": "itcmd",
   "rate": "Fora do inventário · sem ITCMD",
   "floor": 0,
   "ev": "Na morte (beneficiários)",
   "iof": false,
   "obj": "Legado",
   "role": "Bypass de inventário",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "STF Tema 1.214 (RE 1.363.013) — definitivo",
   "note": "Tese do STF é definitiva (mérito 12/2024, modulação recusada): passa fora do inventário aos beneficiários designados, sem ITCMD. Ressalvas reais — resistência administrativa de alguns fiscos estaduais; exceção do próprio STF para simulação/abuso (aporte desproporcional, perto da morte, que preterie herdeiro ou prejudique meação/credores). Confirmar com Tributário se há dispositivo da LC 227/2026 que reforce a tese para PGBL/VGBL.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "holding",
   "ptype": "estr",
   "product": "Holding patrimonial (familiar)",
   "mandate": "—",
   "cls": "Estrutura societária",
   "dur": "Vitalício",
   "yrs": [
    0,
    40
   ],
   "liq": "Estrutural (quotas)",
   "tax": "itcmd",
   "rate": "ITCMD na sucessão societária",
   "floor": 8,
   "ev": "Na transferência de quotas",
   "iof": false,
   "obj": "Legado",
   "role": "Governança + sucessão",
   "risk": "Moderado",
   "rl": 2,
   "dims": null,
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Direito societário · ITCMD estadual · STF Tema 796",
   "note": "Sucessão corre no quadro societário (não em inventário lento). Válida com substância e documentação; estruturas de fachada são o que evitar. Integralizar imóveis: imunidade de ITBI limitada ao valor do capital (STF Tema 796) — o excedente paga.",
   "nota_v1": "[A-12] +Principal · [D-02] piso não se aplica a estr",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "usufruto",
   "ptype": "estr",
   "product": "Doação com reserva de usufruto",
   "mandate": "—",
   "cls": "Estrutura sucessória",
   "dur": "Vitalício",
   "yrs": [
    0,
    40
   ],
   "liq": "Estrutural",
   "tax": "itcmd",
   "rate": "ITCMD na doação (trava a base)",
   "floor": 8,
   "ev": "Na doação",
   "iof": false,
   "obj": "Legado",
   "role": "Antecipa e trava a base",
   "risk": "Moderado",
   "rl": 2,
   "dims": null,
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "EC 132/2023 · LC 227/2026 · isenção estadual",
   "note": "Trava as regras e a base de hoje e move a valorização para fora de um inventário futuro; doador mantém renda/controle. Cronologia: a LC 227/2026 tornou a progressividade obrigatória, mas não é autoaplicável — cada estado precisa de lei própria e, por anterioridade, ela só vale a partir de 2027 (SP segue a 4% fixo em 2026). A janela está fechando, não fechada.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "cgi",
   "ptype": "cred",
   "product": "CGI (crédito c/ garantia de investimentos)",
   "mandate": "—",
   "cls": "Liquidez / crédito",
   "dur": "Médio",
   "yrs": [
    0,
    5
   ],
   "liq": "Sob demanda · carteira penhorada",
   "tax": "semir",
   "rate": "Sem IR (não vende)",
   "floor": 0,
   "ev": "— (sem evento tributável)",
   "iof": false,
   "obj": "Liquidez",
   "role": "Liquidez sem realizar ganho",
   "risk": "Moderado",
   "rl": 2,
   "dims": null,
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Crédito garantido",
   "note": "Levanta liquidez contra a carteira sem vender e disparar IR — a carteira continua compondo. Atenção à chamada de margem se a carteira cair. Ferramenta consciente de tributação.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "fgts",
   "ptype": "mod",
   "product": "FGTS",
   "mandate": "—",
   "cls": "FGTS",
   "dur": "Longo",
   "yrs": [
    1,
    20
   ],
   "liq": "Vinculado (saque em hipóteses legais)",
   "tax": "isento",
   "rate": "0%",
   "floor": 0,
   "ev": "—",
   "iof": false,
   "obj": "Liquidez",
   "role": "Saldo vinculado",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 0,
    "c": 0,
    "l": 3,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime"
   ],
   "status": "base",
   "basis": "Remuneração legal TR+3%",
   "note": "TR + 3% — negativo em termos reais. Modelar como arrasto; usar/sacar quando a hipótese legal permite. Ponte principal: amortizar/quitar financiamento imobiliário a cada 2 anos.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "consorcio",
   "ptype": "cred",
   "product": "Consórcio",
   "mandate": "—",
   "cls": "Aquisição programada",
   "dur": "Médio",
   "yrs": [
    2,
    7
   ],
   "liq": "Travado até contemplação",
   "tax": "semir",
   "rate": "Sem IR",
   "floor": 0,
   "ev": "—",
   "iof": false,
   "obj": "Longevidade",
   "role": "Aquisição programada",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "—",
   "note": "Poupança forçada + aquisição adiada; sem juros mas com taxa de administração. Acesso só por sorteio ou lance (FGTS pode dar lance em imobiliário). Stickiness de dupla face: ótimo quando força bom comportamento, ruim quando trava no produto errado.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "prefixado",
   "ptype": "inv",
   "product": "Tesouro Prefixado (LTN/NTN-F)",
   "mandate": "Taxa fixa",
   "cls": "Títulos em custódia",
   "dur": "Médio",
   "yrs": [
    2,
    10
   ],
   "liq": "D+1 · marcação a mercado",
   "tax": "rf",
   "rate": "22,5%→15%",
   "floor": 15,
   "ev": "No resgate",
   "iof": true,
   "obj": "Longevidade",
   "role": "Trava taxa nominal hoje",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 3,
    "c": 0,
    "l": 0,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Tabela regressiva RF",
   "note": "Útil quando a visão é de queda de juro nominal — sofre marcação a mercado CHEIA se vendido antes do vencimento (M3), mais que o IPCA+. Casado com o vencimento, o risco de mercado colapsa. Não protege da inflação.",
   "nota_v1": "",
   "marcas_motor": [
    "dm"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "lig",
   "ptype": "inv",
   "product": "LIG (Letra Imobiliária Garantida)",
   "mandate": "Inflação / crédito",
   "cls": "Renda fixa bancária",
   "dur": "Longo",
   "yrs": [
    3,
    10
   ],
   "liq": "Carência, depois líquida/venc.",
   "tax": "isento",
   "rate": "0%",
   "floor": 0,
   "ev": "No resgate/venc.",
   "iof": false,
   "obj": "Longevidade",
   "role": "RF isenta com garantia dupla",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 0,
    "c": 1,
    "l": 2,
    "x": 0
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Lei 14.421/2022 — isenção PF",
   "note": "Como LCI/LCA, mas com patrimônio de afetação + garantia direta do emissor (dupla proteção); tickets e prazos maiores, encaixa em Principal/Private.",
   "nota_v1": "basis correta: Lei 13.097/2015 [B-06]",
   "marcas_motor": [
    "matchableL"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "coe",
   "ptype": "inv",
   "product": "COE (Operações Estruturadas)",
   "mandate": "Tático / estruturado",
   "cls": "Renda fixa bancária",
   "dur": "Médio",
   "yrs": [
    1,
    5
   ],
   "liq": "Só no vencimento (regra geral)",
   "tax": "rf",
   "rate": "22,5%→15%",
   "floor": 15,
   "ev": "No vencimento",
   "iof": true,
   "obj": "Longevidade",
   "role": "Visão tática, capital protegido (opcional)",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 2,
    "c": 2,
    "l": 3,
    "x": 0
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Tabela regressiva RF",
   "note": "Um único evento tributário no vencimento; o risco real está na estrutura (capital protegido vs. não) e no emissor, não no IR — exige nota de risco própria por série, não genérica.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "etf-rf",
   "ptype": "inv",
   "product": "ETF de renda fixa",
   "mandate": "Caixa ou Inflação, conforme índice",
   "cls": "Fundos (aberto)",
   "dur": "Médio",
   "yrs": [
    1,
    7
   ],
   "liq": "B3 · a qualquer hora",
   "tax": "etfrf",
   "rate": "25%→15% (prazo médio da carteira)",
   "floor": 15,
   "ev": "Na venda/resgate",
   "iof": false,
   "obj": "Liquidez",
   "role": "Cesta de RF num ticker, sem come-cotas",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 1,
    "c": 1,
    "l": 0,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Regressiva por PMRC — Portaria MF 163/2016",
   "note": "Alíquota corre pelo prazo médio de repactuação da carteira (PMRC), não pelo tempo que o investidor segurou a cota — pode nascer perto do piso de 15%. Sem come-cotas e sem IOF mesmo <30 dias.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "fundo-cambial",
   "ptype": "inv",
   "product": "Fundo Cambial",
   "mandate": "Câmbio / dólar",
   "cls": "Fundos (aberto)",
   "dur": "Curto",
   "yrs": [
    0,
    2
   ],
   "liq": "D+1 a D+30",
   "tax": "comecotas",
   "rate": "22,5%→20% (curto prazo típico)",
   "floor": 20,
   "ev": "Semestral + resgate",
   "iof": true,
   "obj": "Liquidez",
   "role": "Hedge cambial / dólar onshore",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 2,
    "c": 0,
    "l": 1,
    "x": 3
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Regra geral de fundos curto prazo",
   "note": "A maioria é curto prazo (carteira média <365 dias) — teto de come-cotas de 20%, não 15%; confirmar a classificação do fundo específico antes de assumir o piso de 15% usado em outras linhas.",
   "nota_v1": "",
   "marcas_motor": [
    "drag"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "fiagro",
   "ptype": "inv",
   "product": "FIAgro",
   "mandate": "Agro / crédito",
   "cls": "Títulos em custódia",
   "dur": "Longo",
   "yrs": [
    4,
    10
   ],
   "liq": "B3 · líquida",
   "tax": "isento",
   "rate": "Distrib. isenta (c/ requisitos) · 20% ganho",
   "floor": 0,
   "ev": "Distrib. + venda",
   "iof": false,
   "obj": "Longevidade",
   "role": "Renda isenta ligada ao agro",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 2,
    "c": 2,
    "l": 1,
    "x": 0
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Lei 14.130/2021; Lei 11.033/2004 art. 3º",
   "note": "Isenção da distribuição só vale com 50+ cotistas, cotas negociadas em bolsa/balcão e nenhum cotista PF com >=10% — fora disso, 20% na distribuição. Ganho na venda é sempre 20% (o FI-Infra também isenta o ganho; o FIAgro não).",
   "nota_v1": "",
   "marcas_motor": [
    "income"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "fi-infra",
   "ptype": "inv",
   "product": "FI-Infra / FIP-IE",
   "mandate": "Infraestrutura / crédito",
   "cls": "Títulos em custódia",
   "dur": "Longo",
   "yrs": [
    5,
    15
   ],
   "liq": "B3 · líquida (ou fechado)",
   "tax": "isento",
   "rate": "Distrib. isenta · ganho isento",
   "floor": 0,
   "ev": "Distrib. + venda",
   "iof": false,
   "obj": "Longevidade",
   "role": "Renda + ganho isentos — mais amplo que FII",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 2,
    "c": 2,
    "l": 1,
    "x": 0
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Lei 12.431/2011; Resolução CVM 175",
   "note": "Isenção cobre distribuição E ganho de capital na venda das cotas — mais ampla que a do FII (que tributa o ganho a 20%). Exige >=85% do PL em ativos de infraestrutura elegíveis, majoritariamente debêntures incentivadas.",
   "nota_v1": "",
   "marcas_motor": [
    "income"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "acoes-exterior",
   "ptype": "inv",
   "product": "Ações no exterior (custódia direta)",
   "mandate": "Internacional",
   "cls": "Internacional",
   "dur": "Longo",
   "yrs": [
    5,
    15
   ],
   "liq": "Mercado de origem",
   "tax": "offshore",
   "rate": "A CONFIRMAR — 15%/a (Lei 14.754) ou ganho de capital",
   "floor": 15,
   "ev": "Anual e/ou na venda — a confirmar",
   "iof": false,
   "obj": "Longevidade",
   "role": "Exposição direta sem wrapper BR",
   "risk": "Agressivo",
   "rl": 3,
   "dims": {
    "m": 3,
    "c": 0,
    "l": 1,
    "x": 3
   },
   "seg": [
    "Private"
   ],
   "status": "review",
   "basis": "Lei 14.754/2023 — mecânica a confirmar",
   "note": "ZONA CINZENTA: não confirmado se ações estrangeiras em custódia direta caem em aplicações financeiras no exterior (15%/ano) ou no regime tradicional de ganho de capital sobre bens no exterior. CONFIANÇA BAIXA — não usar com cliente sem confirmação do Tributário.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "trust",
   "ptype": "estr",
   "product": "Trust (sucessão internacional)",
   "mandate": "—",
   "cls": "Estrutura sucessória",
   "dur": "Vitalício",
   "yrs": [
    0,
    40
   ],
   "liq": "Estrutural",
   "tax": "itcmd",
   "rate": "ITCMD no repasse ou na morte do settlor (o 1º)",
   "floor": 8,
   "ev": "Repasse ao beneficiário / morte do settlor",
   "iof": false,
   "obj": "Legado",
   "role": "Sucessão internacional com substância",
   "risk": "Moderado",
   "rl": 2,
   "dims": null,
   "seg": [
    "Private"
   ],
   "status": "review",
   "basis": "Lei 14.754/2023; LC 227/2026",
   "note": "A LC 227/2026 fixou o ITCMD no repasse ao beneficiário ou na morte do instituidor, o que ocorrer primeiro — encerrando a cobrança na constituição de trusts revogáveis. A Lei 14.754 trata bens em trust como do instituidor em vida (transparência): sem substância, não há blindagem.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "home-equity",
   "ptype": "cred",
   "product": "Home Equity (crédito c/ garantia de imóvel)",
   "mandate": "—",
   "cls": "Liquidez / crédito",
   "dur": "Longo",
   "yrs": [
    5,
    20
   ],
   "liq": "Sob demanda · imóvel em garantia",
   "tax": "semir",
   "rate": "Sem IR (é dívida)",
   "floor": 0,
   "ev": "— (sem fato gerador p/ o mutuário)",
   "iof": false,
   "obj": "Liquidez",
   "role": "Liquidez de menor custo sem vender",
   "risk": "Moderado",
   "rl": 2,
   "dims": null,
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Natureza de dívida",
   "note": "Paralelo ao CGI, com imóvel como colateral em vez da carteira; custo (juros) menor pelo colateral. iof=false porque a coluna mede o IOF<30d de resgate; o IOF/crédito próprio (~0,38% + diário até teto) incide na contratação, fora do escopo. Juros não dedutíveis no IRPF.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "consignado",
   "ptype": "cred",
   "product": "Crédito Consignado",
   "mandate": "—",
   "cls": "Liquidez / crédito",
   "dur": "Médio",
   "yrs": [
    1,
    6
   ],
   "liq": "Desconto em folha/benefício",
   "tax": "semir",
   "rate": "Sem IR (é dívida)",
   "floor": 0,
   "ev": "— (sem fato gerador)",
   "iof": false,
   "obj": "Liquidez",
   "role": "Crédito mais barato com margem consignável",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime"
   ],
   "status": "review",
   "basis": "Natureza de dívida",
   "note": "Mesma lógica de CGI/home equity: sem IR ao tomador; IOF/crédito próprio na contratação, fora do escopo IOF<30d. Mais relevante em Retail/Prime — contraponto direto ao financiar-vs-investir. Também instrumento de CONSOLIDAÇÃO de dívida rotativa cara.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "cdb-prazo",
   "ptype": "inv",
   "product": "CDB a prazo (2a+)",
   "mandate": "Crédito bancário (pós/pré/IPCA)",
   "cls": "Renda fixa bancária",
   "dur": "Médio",
   "yrs": [
    2,
    5
   ],
   "liq": "Vencimento (saída penalizada)",
   "tax": "rf",
   "rate": "22,5%→15%",
   "floor": 15,
   "ev": "No resgate/venc.",
   "iof": true,
   "obj": "Longevidade",
   "role": "RF datada núcleo",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 0,
    "c": 1,
    "l": 2,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Tabela regressiva RF · FGC",
   "note": "Versão a prazo do CDB: piso de 15% em 2a+, FGC até R$250k, sem liquidez até o vencimento. Casamento natural com objetivos datados de médio prazo; comparar sempre com o kit isento (LCI/LCA) no líquido.",
   "nota_v1": "",
   "marcas_motor": [
    "matchableL"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "lcd",
   "ptype": "inv",
   "product": "LCD (Letra de Crédito do Desenvolvimento)",
   "mandate": "Crédito / desenvolvimento",
   "cls": "Renda fixa bancária",
   "dur": "Longo",
   "yrs": [
    3,
    10
   ],
   "liq": "Carência/vencimento",
   "tax": "isento",
   "rate": "0%",
   "floor": 0,
   "ev": "No vencimento",
   "iof": false,
   "obj": "Longevidade",
   "role": "RF isenta (desenvolvimento)",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 0,
    "c": 1,
    "l": 2,
    "x": 0
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Lei 14.937/2024 — isenção PF",
   "note": "Emitida por bancos de desenvolvimento (BNDES e congêneres), isenta de IR para PF como LCI/LCA, com limite global anual de emissão. Prateleira ainda rasa; confirmar disponibilidade no catálogo.",
   "nota_v1": "",
   "marcas_motor": [
    "matchableL"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "carteira-adm",
   "ptype": "inv",
   "product": "Carteira administrada",
   "mandate": "Por composição − mandatos",
   "cls": "Títulos em custódia (gestão)",
   "dur": "Longo",
   "yrs": [
    3,
    40
   ],
   "liq": "Por ativo · mandato contratado",
   "tax": "porativo",
   "rate": "Cada ativo segue sua regra · sem come-cotas de wrapper",
   "floor": 15,
   "ev": "Por ativo (venda/cupom)",
   "iof": false,
   "obj": "Longevidade",
   "role": "Gestão sob medida sem come-cotas",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Tributação por ativo · doc 03",
   "note": "O wrapper estratégico do Principal/Private (UC04): ativos no nome do cliente, tributação ativo a ativo, SEM come-cotas de estrutura — vantagem estrutural sobre fundo exclusivo pós-Lei 14.754. Taxa de gestão sobre AuA não é dedutível na PF. O risco é o da composição contratada, limitada pelo perfil.",
   "nota_v1": "[D-07] mandato do perfil",
   "marcas_motor": [
    "wrapper"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "fundo-exclusivo",
   "ptype": "inv",
   "product": "Fundo exclusivo / fechado",
   "mandate": "Por composição",
   "cls": "Fundos (fechado)",
   "dur": "Vitalício",
   "yrs": [
    5,
    40
   ],
   "liq": "Fechado · amortizações/eventos",
   "tax": "comecotas",
   "rate": "22,5%→15% + come-cotas (salvo FIA/FIP/FIDC/FIAgro)",
   "floor": 15,
   "ev": "Semestral + resgate",
   "iof": false,
   "obj": "Legado",
   "role": "Governança + sucessão familiar",
   "risk": "Moderado",
   "rl": 2,
   "dims": null,
   "seg": [
    "Private"
   ],
   "status": "base",
   "basis": "Lei 14.754/2023",
   "note": "Pós-Lei 14.754 sofre come-cotas (salvo FIA/FIP/FIDC/FIAgro qualificados) — perdeu o diferimento que o justificava. Segue relevante por governança e sucessão (doação de cotas com usufruto), com custo de estrutura que só fecha em patrimônios grandes. Comparar sempre com carteira administrada.",
   "nota_v1": "[D-04/D-07]",
   "marcas_motor": [
    "drag",
    "wrapper"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "etf-intl",
   "ptype": "inv",
   "product": "ETF internacional na B3 (IVVB11)",
   "mandate": "Internacional",
   "cls": "Títulos em custódia",
   "dur": "Longo",
   "yrs": [
    5,
    15
   ],
   "liq": "B3 · a qualquer hora",
   "tax": "etf",
   "rate": "15% · sem isenção 20k",
   "floor": 15,
   "ev": "Na venda",
   "iof": false,
   "obj": "Longevidade",
   "role": "Dolarização simples via B3",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 3,
    "c": 0,
    "l": 0,
    "x": 3
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Regime de ETF de ações (B3)",
   "note": "IVVB11 e afins: 15% no ganho, sem isenção de R$20k/mês, sem come-cotas — com exposição cambial embutida. Dolarização simples sem conta offshore nem regime da Lei 14.754.",
   "nota_v1": "[B-05] piso Agressivo→Moderado (índice diversificado)",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "capitalizacao",
   "ptype": "inv",
   "product": "Capitalização",
   "mandate": "—",
   "cls": "Capitalização",
   "dur": "Médio",
   "yrs": [
    1,
    5
   ],
   "liq": "Resgate com penalidade/prazo",
   "tax": "rf",
   "rate": "A CONFIRMAR · sorteios 30% na fonte",
   "floor": 20,
   "ev": "No resgate/sorteio",
   "iof": false,
   "obj": "Longevidade",
   "role": "Disciplina comportamental (fraco)",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 0,
    "c": 1,
    "l": 2,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime"
   ],
   "status": "review",
   "basis": "Mecânica de IR do resgate a confirmar",
   "note": "Popular e financeiramente fraco (doc 02): rendimento real ~nulo (TR), sorteios tributados a 30% exclusivo na fonte. Papel honesto: disciplina comportamental — sinalizar upgrade para consórcio/Tesouro programado. Mecânica exata do IR no resgate: A CONFIRMAR.",
   "nota_v1": "",
   "marcas_motor": [
    "weak"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "vida-resgatavel",
   "ptype": "prot",
   "product": "Seguro de vida resgatável (vida inteira/dotal)",
   "mandate": "—",
   "cls": "Proteção / seguro",
   "dur": "Vitalício",
   "yrs": [
    0,
    40
   ],
   "liq": "Resgate após carência · morte paga rápido",
   "tax": "isento",
   "rate": "Morte: isenta/fora ITCMD · Resgate: IR a confirmar",
   "floor": 0,
   "ev": "Na morte / no resgate",
   "iof": false,
   "obj": "Legado",
   "role": "Proteção + acumulação sucessória",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Código Civil · mecânica de resgate por SKU (SUSEP)",
   "note": "Na morte: isento e fora do inventário/ITCMD como o vida a termo. O resgate EM VIDA é tributado sobre o rendimento — mecânica varia por produto SUSEP, A CONFIRMAR por SKU. Combina proteção + acumulação sucessória para Private.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "prestamista",
   "ptype": "prot",
   "product": "Seguro prestamista",
   "mandate": "—",
   "cls": "Proteção / seguro",
   "dur": "Médio",
   "yrs": [
    0,
    20
   ],
   "liq": "Contingente (evento)",
   "tax": "semir",
   "rate": "Indenização quita a dívida · sem IR",
   "floor": 0,
   "ev": "No evento (quita dívida)",
   "iof": false,
   "obj": "Legado",
   "role": "Protege a família da dívida",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Natureza securitária",
   "note": "Quita o saldo devedor no óbito/invalidez — o beneficiário é o credor; indenização sem IR. Protege a família de herdar dívida (embutido no CET do crédito). Regra sistêmica: todo financiamento relevante carrega prestamista ou vida equivalente.",
   "nota_v1": "[A-13] +Private",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "saude",
   "ptype": "prot",
   "product": "Plano de saúde",
   "mandate": "—",
   "cls": "Proteção / saúde",
   "dur": "Vitalício",
   "yrs": [
    0,
    40
   ],
   "liq": "Uso contínuo (mensalidade)",
   "tax": "deducao",
   "rate": "Despesa dedutível SEM TETO (completa)",
   "floor": 0,
   "ev": "Anual (dedução na DIRPF)",
   "iof": false,
   "obj": "Liquidez",
   "role": "Proteção de fluxo + dedução",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Dedução integral de despesas médicas (declaração completa)",
   "note": "Não é investimento — é proteção + a alavanca de dedução mais subestimada: despesas médicas (incluindo o plano) são dedutíveis SEM TETO na completa. Regra sistêmica: gasto de saúde alto → completa quase sempre vence → habilita a dedução de 12% do PGBL. Reajustes acima do IPCA: modelar inflação médica própria (Fernanda).",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "seg-patrimonial",
   "ptype": "prot",
   "product": "Seguros patrimoniais (residencial/auto)",
   "mandate": "—",
   "cls": "Proteção / seguro",
   "dur": "Vitalício",
   "yrs": [
    0,
    40
   ],
   "liq": "Contingente (sinistro)",
   "tax": "semir",
   "rate": "Indenização = recomposição · sem IR",
   "floor": 0,
   "ev": "No sinistro",
   "iof": false,
   "obj": "Liquidez",
   "role": "Protege o balanço",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Indenização não é renda",
   "note": "Indenização é recomposição patrimonial, não renda tributável. Sem dimensão de investimento — protege o balanço de choques que, sem seguro, drenariam a reserva ou forçariam venda de ativos (o elo com Liquidez).",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "financ-imob",
   "ptype": "cred",
   "product": "Financiamento imobiliário (SFH/SFI)",
   "mandate": "—",
   "cls": "Passivo / financiamento",
   "dur": "Longo",
   "yrs": [
    5,
    35
   ],
   "liq": "Amortizável (SAC/Price) · FGTS a cada 2a",
   "tax": "semir",
   "rate": "Sem IR · juros NÃO dedutíveis",
   "floor": 0,
   "ev": "—",
   "iof": false,
   "obj": "Longevidade",
   "role": "Aquisição alavancada de moradia",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Doc 03 · SFH/SFI",
   "note": "O maior passivo da PF. Juros NÃO são dedutíveis no IRPF (diferente dos EUA — doc 03); FGTS pode amortizar/quitar a cada 2 anos (a ponte FGTS→imóvel). Decisão viva do goal-based: amortizar vs. investir = taxa do contrato vs. retorno LÍQUIDO de IR esperado, com prestamista embutido no CET.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "cdc",
   "ptype": "cred",
   "product": "CDC / crédito pessoal (incl. veículo)",
   "mandate": "—",
   "cls": "Passivo / crédito",
   "dur": "Curto",
   "yrs": [
    0,
    4
   ],
   "liq": "Parcelas fixas",
   "tax": "semir",
   "rate": "Sem IR (é dívida)",
   "floor": 0,
   "ev": "—",
   "iof": false,
   "obj": "Liquidez",
   "role": "Consumo a prazo (evitar)",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime"
   ],
   "status": "base",
   "basis": "Natureza de dívida",
   "note": "CET alto, sem qualquer benefício fiscal. Regra sistêmica: quitar antes de qualquer alocação (exceto reserva mínima) — nenhum retorno líquido realista bate o custo. Financiar bem depreciante (veículo, −12% real) é a pior combinação da matriz.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "rotativo",
   "ptype": "cred",
   "product": "Cartão rotativo / cheque especial",
   "mandate": "—",
   "cls": "Passivo / crédito",
   "dur": "Curtíssimo",
   "yrs": [
    0,
    1
   ],
   "liq": "Revolvente (evitar)",
   "tax": "semir",
   "rate": "Sem IR (é dívida)",
   "floor": 0,
   "ev": "—",
   "iof": false,
   "obj": "Liquidez",
   "role": "Emergência cara (eliminar)",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime"
   ],
   "status": "base",
   "basis": "Natureza de dívida",
   "note": "CET de três dígitos — destruidor de patrimônio. Regra sistêmica dura: dívida rotativa detectada → plano de quitação/consolidação (consignado, CGI) ANTES de qualquer conversa de investimento (Marcos).",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "antecipacao",
   "ptype": "cred",
   "product": "Antecipação de 13º / restituição / recebíveis",
   "mandate": "—",
   "cls": "Passivo / crédito",
   "dur": "Curtíssimo",
   "yrs": [
    0,
    1
   ],
   "liq": "Quita no recebível",
   "tax": "semir",
   "rate": "Sem IR (é dívida)",
   "floor": 0,
   "ev": "—",
   "iof": false,
   "obj": "Liquidez",
   "role": "Suavização pontual",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime"
   ],
   "status": "base",
   "basis": "Natureza de dívida",
   "note": "Liquidez pontual com spread do banco. Uso excepcional de suavização — arriscado como hábito; se recorrente, o problema é orçamento, não crédito.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "capital-giro",
   "ptype": "cred",
   "product": "Capital de giro / conta garantida (PJ)",
   "mandate": "—",
   "cls": "Passivo / crédito PJ",
   "dur": "Curto",
   "yrs": [
    0,
    3
   ],
   "liq": "Rotativo PJ",
   "tax": "semir",
   "rate": "Sem IR ao tomador · juros dedutíveis na PJ",
   "floor": 0,
   "ev": "—",
   "iof": false,
   "obj": "Liquidez",
   "role": "Fôlego da empresa (PJ)",
   "risk": "Moderado",
   "rl": 2,
   "dims": null,
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Natureza de dívida (PJ)",
   "note": "Mantém a empresa respirando sem contaminar a PF. Regra de fronteira: pró-labore disciplinado + não misturar caixa PJ e patrimônio pessoal (Thiago, Patrícia). Juros dedutíveis NA PJ (lucro real), nunca na PF.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "offshore-pj",
   "ptype": "estr",
   "product": "Offshore PJ (controlada no exterior)",
   "mandate": "Internacional",
   "cls": "Estrutura internacional",
   "dur": "Vitalício",
   "yrs": [
    0,
    40
   ],
   "liq": "Estrutural",
   "tax": "offshore",
   "rate": "15%/a sobre lucros (31/dez) · opção transparência",
   "floor": 15,
   "ev": "Anual (31/dez)",
   "iof": false,
   "obj": "Legado",
   "role": "Veículo internacional c/ substância",
   "risk": "Moderado",
   "rl": 2,
   "dims": null,
   "seg": [
    "Private"
   ],
   "status": "review",
   "basis": "Lei 14.754/2023",
   "note": "Lucros tributados anualmente a 15% em 31/dez, repatriados ou não, com opção de transparência fiscal (declarar os ativos como se PF). Custos de manutenção + substância obrigatória. Sucessão internacional exige planejamento próprio (will/probate local). Para Private com diversificação genuína.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "doacao",
   "ptype": "estr",
   "product": "Doação em dinheiro/bens (simples)",
   "mandate": "—",
   "cls": "Estrutura sucessória",
   "dur": "Vitalício",
   "yrs": [
    0,
    40
   ],
   "liq": "Ato único",
   "tax": "itcmd",
   "rate": "ITCMD estadual · isenção anual por estado",
   "floor": 8,
   "ev": "Na doação",
   "iof": false,
   "obj": "Legado",
   "role": "Antecipação de herança",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "ITCMD estadual · LC 227/2026",
   "note": "A ferramenta de transferência mais simples: ITCMD estadual com isenções anuais por estado (SP ~R$96k/ano, A CONFIRMAR). Atenção à futura regra de consolidação de doações seriadas (LC 227 — prazo estadual a definir). Antecipa herança em vida com controle do timing.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "imovel-renda",
   "ptype": "mod",
   "product": "Imóvel para renda (aluguel)",
   "mandate": "Imobiliário / renda",
   "cls": "Imóveis",
   "dur": "Vitalício",
   "yrs": [
    5,
    40
   ],
   "liq": "Meses para vender · vacância",
   "tax": "irpf",
   "rate": "Aluguel: até 27,5% · Venda: GCAP 15→22,5%",
   "floor": 27.5,
   "ev": "Mensal (carnê-leão) + venda",
   "iof": false,
   "obj": "Longevidade",
   "role": "Renda imobiliária direta",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 2,
    "c": 0,
    "l": 3,
    "x": 0
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Carnê-leão · GCAP progressivo · redutores Lei 11.196/7.713",
   "note": "Classe do engine ausente até a v0.2. Aluguel = carnê-leão progressivo até 27,5% (a renda recorrente mais tributada da matriz); venda = GCAP 15→22,5% com redutores por antiguidade. Estratégia PJ imobiliária (Lucro Presumido ~11–14% sobre a receita) pode reduzir o atrito — avaliar caso a caso. Iliquidez alta + vacância. Comparar sempre com FII no líquido.",
   "nota_v1": "",
   "marcas_motor": [
    "income"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "imovel-proprio",
   "ptype": "mod",
   "product": "Imóvel residencial próprio",
   "mandate": "—",
   "cls": "Imóveis",
   "dur": "Vitalício",
   "yrs": [
    5,
    40
   ],
   "liq": "Meses para vender",
   "tax": "gcprog",
   "rate": "GCAP 15→22,5% · isenções 180d / único ≤R$440k",
   "floor": 15,
   "ev": "Na venda",
   "iof": false,
   "obj": "Longevidade",
   "role": "Moradia (uso)",
   "risk": "Conservador",
   "rl": 1,
   "dims": {
    "m": 1,
    "c": 0,
    "l": 3,
    "x": 0
   },
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Lei 11.196 art. 39 · Lei 9.250 art. 23",
   "note": "Duas isenções clássicas de GCAP: (a) venda de residencial + compra de outro em 180 dias (1×/5 anos); (b) imóvel único ≤R$440k (1×/5 anos). Regras sistêmicas do objetivo trocar de casa. Não gera renda; gera custo (condomínio/IPTU) — modelar como uso, não investimento.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "participacao",
   "ptype": "mod",
   "product": "Participação societária (empresa própria)",
   "mandate": "Empresa própria",
   "cls": "Participação societária",
   "dur": "Vitalício",
   "yrs": [
    0,
    40
   ],
   "liq": "Ilíquida (evento societário)",
   "tax": "pjdiv",
   "rate": "Dividendos 10% >R$50k/mês · IRPFM · GCAP quotas",
   "floor": 10,
   "ev": "Distribuição + venda + sucessão",
   "iof": false,
   "obj": "Legado",
   "role": "O negócio do cliente",
   "risk": "Agressivo",
   "rl": 3,
   "dims": {
    "m": 3,
    "c": 2,
    "l": 3,
    "x": 0
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "Lei 15.270/2025 · LC 227/2026 (valor de mercado)",
   "note": "O maior ativo do cliente PJ (Patrícia, Antônio): dividendos isentos até R$50k/mês/empresa (10% de retenção acima), IRPFM no agregado, ganho na venda de quotas progressivo 15→22,5%. Sucessão: ITCMD sobre VALOR DE MERCADO das quotas (LC 227 — encerra a avaliação contábil), via holding/doação com usufruto. Concentração é o risco dominante.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "cripto",
   "ptype": "mod",
   "product": "Cripto (ativos virtuais)",
   "mandate": "Cripto / satélite",
   "cls": "Ativos virtuais",
   "dur": "Longo",
   "yrs": [
    3,
    10
   ],
   "liq": "24/7 · alta volatilidade",
   "tax": "gcprog",
   "rate": "15→22,5% · isenção R$35k/mês (BR)",
   "floor": 15,
   "ev": "Na alienação (mensal)",
   "iof": false,
   "obj": "Longevidade",
   "role": "Satélite especulativo",
   "risk": "Agressivo",
   "rl": 3,
   "dims": {
    "m": 3,
    "c": 0,
    "l": 1,
    "x": 2
   },
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "GCAP + IN RFB 1888 · Lei 14.754 (exterior)",
   "note": "Classe detida pelo cliente (não vendida): exchange nacional = GCAP progressivo 15→22,5% com isenção de R$35k/mês em alienações (regra mantida com a caducidade da MP 1.303); exterior/self-custody = regime da Lei 14.754 — mecânica A CONFIRMAR por caso. Goal-based trata como satélite de risco, nunca core.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "inss",
   "ptype": "mod",
   "product": "INSS (previdência social)",
   "mandate": "—",
   "cls": "Previdência social",
   "dur": "Vitalício",
   "yrs": [
    10,
    40
   ],
   "liq": "Benefício mensal vitalício",
   "tax": "irpf",
   "rate": "Benefício: IRPF progressivo (isenção extra 65+)",
   "floor": 27.5,
   "ev": "No benefício (mensal)",
   "iof": false,
   "obj": "Longevidade",
   "role": "Piso vitalício de aposentadoria",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Teto em assumptions.ts · IRPF",
   "note": "Não vendido, mas é o piso vitalício do objetivo aposentadoria (teto do benefício em assumptions.ts, com fonte e data). Contribuição dedutível na completa; benefício tributado como renda ordinária (isenção extra a partir de 65 anos). Regra sistêmica: gap = despesa desejada − INSS projetado é o que a carteira precisa financiar (Thiago: previdência privada como substituto).",
   "nota_v1": "",
   "marcas_motor": [
    "income"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "veiculo",
   "ptype": "mod",
   "product": "Veículo (bem de uso)",
   "mandate": "—",
   "cls": "Veículos",
   "dur": "Médio",
   "yrs": [
    0,
    10
   ],
   "liq": "Dias/semanas (usado)",
   "tax": "semir",
   "rate": "Sem IR · IPVA à parte",
   "floor": 0,
   "ev": "—",
   "iof": false,
   "obj": "Longevidade",
   "role": "Bem de uso depreciante",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "base",
   "basis": "Engine params (−12% real a.a.)",
   "note": "Bem de uso que deprecia ~−12% real a.a. (engine) — modelar a perda, não o ativo. Sem IR (IPVA é imposto de propriedade, à parte). Regra sistêmica: objetivo trocar de carro financia-se com consórcio/poupança programada; CDC sobre bem depreciante é a pior combinação da matriz.",
   "nota_v1": "",
   "marcas_motor": [],
   "origem": {
    "motor": "v1.0",
    "descricao": "v0.3"
   }
  },
  {
   "id": "usd-cash",
   "ptype": "inv",
   "product": "Caixa em moeda forte (conta global)",
   "mandate": "",
   "cls": "",
   "dur": "",
   "yrs": [
    0,
    10
   ],
   "liq": "",
   "tax": "offshore",
   "rate": "",
   "floor": 15,
   "ev": "",
   "iof": false,
   "obj": "Longevidade",
   "role": "",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 0,
    "c": 0,
    "l": 1,
    "x": 3
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "",
   "note": "",
   "nota_v1": "[B-01] regime Lei 14.754 A CONFIRMAR (depósito não remunerado pode ser isento)",
   "marcas_motor": [
    "review"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "nenhuma (linha nova da v1.0)"
   }
  },
  {
   "id": "usd-bonds",
   "ptype": "inv",
   "product": "RF em moeda forte (Treasuries/bonds)",
   "mandate": "",
   "cls": "",
   "dur": "",
   "yrs": [
    1,
    10
   ],
   "liq": "",
   "tax": "offshore",
   "rate": "",
   "floor": 15,
   "ev": "",
   "iof": false,
   "obj": "Longevidade",
   "role": "",
   "risk": "Moderado",
   "rl": 2,
   "dims": {
    "m": 1,
    "c": 0,
    "l": 1,
    "x": 3
   },
   "seg": [
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "",
   "note": "",
   "nota_v1": "[B-01] escada casável na moeda do passivo",
   "marcas_motor": [
    "dm",
    "income",
    "review"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "nenhuma (linha nova da v1.0)"
   }
  },
  {
   "id": "seg-invalidez",
   "ptype": "prot",
   "product": "Seguro invalidez / doenças graves / DIT",
   "mandate": "",
   "cls": "",
   "dur": "",
   "yrs": [
    0,
    40
   ],
   "liq": "",
   "tax": "isento",
   "rate": "",
   "floor": 0,
   "ev": "",
   "iof": false,
   "obj": "Liquidez",
   "role": "",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "",
   "note": "",
   "nota_v1": "[B-02] mecânica SUSEP A CONFIRMAR",
   "marcas_motor": [
    "review"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "nenhuma (linha nova da v1.0)"
   }
  },
  {
   "id": "renda-vitalicia",
   "ptype": "prot",
   "product": "Renda vitalícia contratada (anuidade)",
   "mandate": "",
   "cls": "",
   "dur": "",
   "yrs": [
    0,
    40
   ],
   "liq": "",
   "tax": "prev",
   "rate": "",
   "floor": 10,
   "ev": "",
   "iof": false,
   "obj": "Longevidade",
   "role": "",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Prime",
    "Principal",
    "Private"
   ],
   "status": "review",
   "basis": "",
   "note": "",
   "nota_v1": "[B-03] tributação da fase de renda A CONFIRMAR",
   "marcas_motor": [
    "income",
    "review"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "nenhuma (linha nova da v1.0)"
   }
  },
  {
   "id": "parcelamento-fatura",
   "ptype": "cred",
   "product": "Parcelamento de fatura (rampa de saída)",
   "mandate": "",
   "cls": "",
   "dur": "",
   "yrs": [
    0,
    1
   ],
   "liq": "",
   "tax": "semir",
   "rate": "",
   "floor": 0,
   "ev": "",
   "iof": false,
   "obj": "Liquidez",
   "role": "",
   "risk": "Conservador",
   "rl": 1,
   "dims": null,
   "seg": [
    "Retail",
    "Prime"
   ],
   "status": "review",
   "basis": "",
   "note": "",
   "nota_v1": "[A-10/B-07]",
   "marcas_motor": [
    "review"
   ],
   "origem": {
    "motor": "v1.0",
    "descricao": "nenhuma (linha nova da v1.0)"
   }
  }
 ],
 "estrategias": [
  {
   "id": "reserva-first",
   "texto": "Reserva antes de qualquer objetivo de risco — 1º degrau da escada (doc 04)."
  },
  {
   "id": "dimensionar-reserva",
   "texto": "Meses de reserva por risco de renda: mais para renda variável e provedor único (flags VIS-806)."
  },
  {
   "id": "gate-rotativo",
   "texto": "Rotativo detectado → bloqueia alocação até plano de quitação (Marcos)."
  },
  {
   "id": "consolidacao-divida",
   "texto": "Trocar dívida cara por barata: rotativo → parcelamento de fatura / consignado / CGI / home equity."
  },
  {
   "id": "amortizar-vs-investir",
   "texto": "Taxa do contrato vs. retorno líquido de IR — juros não são dedutíveis no BR (Roberto)."
  },
  {
   "id": "fgts-imovel",
   "texto": "FGTS amortiza/quita financiamento a cada 2 anos; lance em consórcio imobiliário."
  },
  {
   "id": "isencao-180d",
   "texto": "Vender residencial + comprar outro em 180 dias: GCAP zero (1×/5 anos) na troca de casa."
  },
  {
   "id": "escada-vencimentos",
   "texto": "Títulos vencendo na data de cada objetivo (José Carlos: escada IPCA+)."
  },
  {
   "id": "duration-match",
   "texto": "Título marcado casado ao vencimento → risco de mercado colapsa (M→0)."
  },
  {
   "id": "glidepath-derisk",
   "texto": "De-risking programado conforme o objetivo se aproxima (caps de M por fase)."
  },
  {
   "id": "bucket-decumulacao",
   "texto": "3 baldes na aposentadoria: caixa (2a) · renda · crescimento (José Carlos/Helena)."
  },
  {
   "id": "renda-isenta-decumulacao",
   "texto": "Renda mensal isenta: FII + FI-Infra + incentivadas + IPCA+ cupom (Helena) — p/ Conservador via mandato diversificado [A-03]."
  },
  {
   "id": "asset-location",
   "texto": "Alocar por eficiência: tributados dentro de wrappers eficientes; isentos fora."
  },
  {
   "id": "evitar-come-cotas",
   "texto": "Dinheiro longo fora de fundos abertos: títulos diretos, ETF, previdência, carteira adm."
  },
  {
   "id": "harvest-isencoes",
   "texto": "Consumir as franquias anuais: R$20k/mês ações, R$35k/mês cripto, doação estadual."
  },
  {
   "id": "pgbl-12-completa",
   "texto": "Gasto de saúde alto → declaração completa vence → dedução de 12% no PGBL."
  },
  {
   "id": "vgbl-fracionado-600k",
   "texto": "Fracionar aportes de VGBL entre anos para não disparar o IOF de 5% (>R$600k/CPF/ano)."
  },
  {
   "id": "prev-substituto-inss",
   "texto": "PJ/autônomo: previdência privada como substituto do INSS fraco (Thiago)."
  },
  {
   "id": "consorcio-vs-cdc",
   "texto": "Bem depreciante: consórcio/poupança programada; nunca CDC sobre veículo."
  },
  {
   "id": "staging-soma-subita",
   "texto": "Herança/venda/bônus: estacionar em DI e posicionar em etapas com política (Patrícia)."
  },
  {
   "id": "trio-sucessorio",
   "texto": "Seguro (liquidez do espólio) + previdência (bypass) + estrutura (holding/doação)."
  },
  {
   "id": "seguro-dimensionado-itcmd",
   "texto": "Capital segurado = ITCMD + custas do inventário: herdeiros não vendem ativos (Antônio)."
  },
  {
   "id": "usufruto-trava-2027",
   "texto": "Doar com usufruto antes das leis estaduais de 2027: trava base e alíquota de hoje."
  },
  {
   "id": "doacao-seriada-isencao",
   "texto": "Doações anuais dentro da isenção estadual — atenção à regra de consolidação (LC 227)."
  },
  {
   "id": "holding-com-substancia",
   "texto": "Holding com substância e governança; ITBI limitado (Tema 796); quotas a valor de mercado (LC 227)."
  },
  {
   "id": "dolarizacao-em-camadas",
   "texto": "X por camadas: ETF B3 → BDR → offshore direto, conforme segmento e meta em moeda."
  },
  {
   "id": "rota-liquidez-fisica",
   "texto": "Por ativo físico: vender (staging), alugar (renda) ou dar em garantia (CGI/home equity) — custo de carregamento no motor. [A-07]"
  }
 ],
 "objetivos": [
  {
   "id": "reserva",
   "name": "Reserva de emergência",
   "need": 1,
   "l3": "Liquidez",
   "nature": "cont",
   "h": 1,
   "hRange": [
    0,
    2
   ],
   "flexY": 1,
   "flexV": "needs",
   "ptypes": [
    "inv"
   ],
   "caps": {
    "M": 0,
    "C": 1,
    "L": 0,
    "X": 0
   },
   "gp": false,
   "dmOn": false,
   "funding": "Aporte até 6–12× despesas",
   "hardRule": "1º degrau da escada: nenhum objetivo de risco antes da reserva mínima (doc 04).",
   "triggers": "Sobra parada → reserva (A12); flags: renda variável / provedor único ampliam o alvo",
   "strategies": [
    "reserva-first",
    "dimensionar-reserva"
   ],
   "personas": "Marcos, Júlia, Aline, Luana, Thiago — todos primeiro",
   "segs": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "kpi": "Meses de despesa cobertos",
   "status": "base"
  },
  {
   "id": "divida",
   "name": "Sair da dívida cara / consolidar",
   "need": 1,
   "l3": "Liquidez",
   "nature": "sane",
   "h": 1,
   "hRange": [
    0,
    3
   ],
   "flexY": 1,
   "flexV": "needs",
   "ptypes": [
    "cred"
   ],
   "credIds": [
    "consignado",
    "cgi",
    "home-equity",
    "parcelamento-fatura"
   ],
   "caps": {
    "M": 3,
    "C": 3,
    "L": 3,
    "X": 3
   },
   "gp": false,
   "dmOn": false,
   "funding": "Fluxo liberado da renegociação",
   "hardRule": "GATE sistêmico: rotativo/cheque especial detectado bloqueia qualquer alocação em investimento até existir plano de quitação (Marcos).",
   "triggers": "Dívida cara → consolidação (A12)",
   "strategies": [
    "gate-rotativo",
    "consolidacao-divida",
    "amortizar-vs-investir"
   ],
   "personas": "Marcos, Aline",
   "segs": [
    "Retail",
    "Prime"
   ],
   "kpi": "CET médio ↓ · data de quitação",
   "status": "base"
  },
  {
   "id": "protecao-familia",
   "name": "Proteção da família (se eu faltar)",
   "need": 2,
   "l3": "Legado",
   "nature": "cont",
   "h": 20,
   "hRange": [
    0,
    40
   ],
   "flexY": 40,
   "flexV": "needs",
   "ptypes": [
    "prot"
   ],
   "caps": {
    "M": 3,
    "C": 3,
    "L": 3,
    "X": 3
   },
   "gp": false,
   "dmOn": false,
   "funding": "Prêmio mensal (custo, não aporte)",
   "hardRule": "Capital segurado = passivos + n anos de renda; prestamista em todo financiamento relevante; invalidez/DIT na cobertura de provedor único [B-02].",
   "triggers": "Lacuna de proteção → vida (A12); dependentes 2+ (flag VIS-806)",
   "strategies": [
    "trio-sucessorio",
    "dimensionar-reserva"
   ],
   "personas": "Luana, Fernanda, Bruno, José Carlos",
   "segs": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "kpi": "Capital segurado / necessidade",
   "status": "base"
  },
  {
   "id": "protecao-fluxo",
   "name": "Proteção de fluxo e balanço (saúde/patrimônio)",
   "need": 2,
   "l3": "Liquidez",
   "nature": "cont",
   "h": 20,
   "hRange": [
    0,
    40
   ],
   "flexY": 40,
   "flexV": "needs",
   "ptypes": [
    "prot"
   ],
   "caps": {
    "M": 3,
    "C": 3,
    "L": 3,
    "X": 3
   },
   "gp": false,
   "dmOn": false,
   "funding": "Mensalidade/prêmio",
   "hardRule": "Proteção-primeiro: choque sem seguro drena a reserva ou força venda de ativos (doc 04) [C-02].",
   "triggers": "Saúde alta → declaração completa → habilita PGBL 12%",
   "strategies": [
    "pgbl-12-completa"
   ],
   "personas": "Fernanda, Luana, Roberto",
   "segs": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "kpi": "Coberturas ativas vs. lacunas",
   "status": "base"
  },
  {
   "id": "lar-adquirir",
   "name": "Adquirir / trocar o lar",
   "need": 3,
   "l3": "Longevidade",
   "nature": "data",
   "h": 5,
   "hRange": [
    2,
    10
   ],
   "flexY": 2,
   "flexV": "needs",
   "ptypes": [
    "inv",
    "cred"
   ],
   "credIds": [
    "financ-imob",
    "consorcio"
   ],
   "caps": {
    "M": 1,
    "C": 1,
    "L": 2,
    "X": 0
   },
   "gp": true,
   "dmOn": true,
   "gatedByDebt": true,
   "modIds": [
    "fgts"
   ],
   "funding": "Híbrido: aporte + FGTS + financiamento",
   "hardRule": null,
   "triggers": "Meta de entrada definida; na troca, janela de 180 dias da isenção",
   "strategies": [
    "fgts-imovel",
    "escada-vencimentos",
    "isencao-180d",
    "consorcio-vs-cdc"
   ],
   "personas": "Camila & Diego, Júlia, Roberto",
   "segs": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "kpi": "% da entrada acumulada",
   "status": "base"
  },
  {
   "id": "lar-quitar",
   "name": "Quitar o lar (amortizar vs. investir)",
   "need": 3,
   "l3": "Longevidade",
   "nature": "sane",
   "h": 3,
   "hRange": [
    1,
    10
   ],
   "flexY": 3,
   "flexV": "wants",
   "ptypes": [
    "inv",
    "cred"
   ],
   "credIds": [
    "financ-imob"
   ],
   "caps": {
    "M": 1,
    "C": 1,
    "L": 1,
    "X": 0
   },
   "gp": false,
   "dmOn": true,
   "gatedByDebt": true,
   "modIds": [
    "fgts",
    "imovel-proprio"
   ],
   "funding": "Sobra mensal direcionada",
   "hardRule": "Decisão viva: taxa do contrato vs. retorno LÍQUIDO de IR — juros não são dedutíveis no BR.",
   "triggers": "Sobra recorrente + financiamento ativo (Roberto)",
   "strategies": [
    "amortizar-vs-investir",
    "fgts-imovel"
   ],
   "personas": "Roberto",
   "segs": [
    "Retail",
    "Prime",
    "Principal"
   ],
   "kpi": "Δ líquido amortizar vs. investir (motor)",
   "status": "base"
  },
  {
   "id": "educacao",
   "name": "Educação dos filhos",
   "need": 4,
   "l3": "Longevidade",
   "nature": "data",
   "h": 10,
   "hRange": [
    3,
    18
   ],
   "flexY": 0,
   "flexV": "needs",
   "ptypes": [
    "inv"
   ],
   "caps": {
    "M": 2,
    "C": 1,
    "L": 2,
    "X": 1
   },
   "gp": true,
   "dmOn": true,
   "gatedByDebt": true,
   "funding": "Aporte mensal (sleeve dedicada)",
   "hardRule": "Data DURA (vestibular não espera): glidepath obrigatório; flexibilidade de prazo zero.",
   "triggers": "Nascimento/idade do filho define a data-âncora",
   "strategies": [
    "duration-match",
    "glidepath-derisk",
    "escada-vencimentos"
   ],
   "personas": "Luana, Fernanda, Ricardo, Camila & Diego",
   "segs": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "kpi": "% do custo-alvo financiado",
   "status": "base"
  },
  {
   "id": "cuidado-vitalicio",
   "name": "Cuidado vitalício (perpetuidade médica)",
   "need": 4,
   "l3": "Longevidade",
   "nature": "fluxo",
   "h": 30,
   "hRange": [
    10,
    40
   ],
   "flexY": 40,
   "flexV": "needs",
   "ptypes": [
    "inv",
    "prot",
    "estr"
   ],
   "caps": {
    "M": 2,
    "C": 1,
    "L": 1,
    "X": 0
   },
   "gp": false,
   "dmOn": true,
   "dmRolling": true,
   "gatedByDebt": true,
   "funding": "Fundo ring-fenced + seguro que o capitaliza + estrutura administrada em benefício do dependente",
   "hardRule": "Fluxo perpétuo que cresce acima do IPCA (inflação médica): dual-sleeve — núcleo IPCA+ em escada rolada (casada ao fluxo) + satélite de crescimento limitado a M2; ring-fence, não misturar com outras metas. [A-06]",
   "triggers": "Dependente com cuidado contínuo (Fernanda)",
   "strategies": [
    "renda-isenta-decumulacao",
    "duration-match",
    "trio-sucessorio",
    "escada-vencimentos"
   ],
   "personas": "Fernanda",
   "segs": [
    "Prime",
    "Principal",
    "Private"
   ],
   "kpi": "Fluxo perpétuo coberto vs. inflação médica (motor)",
   "status": "review"
  },
  {
   "id": "aposentadoria",
   "name": "Aposentadoria / independência",
   "need": 5,
   "l3": "Longevidade",
   "nature": "fluxo",
   "h": 25,
   "hRange": [
    10,
    40
   ],
   "flexY": 5,
   "flexV": "needs",
   "ptypes": [
    "inv"
   ],
   "caps": {
    "M": 3,
    "C": 2,
    "L": 3,
    "X": 3
   },
   "gp": true,
   "dmOn": true,
   "gatedByDebt": true,
   "modIds": [
    "inss"
   ],
   "funding": "Aporte % da renda (teto = sobra, VIS-801)",
   "hardRule": null,
   "triggers": "Horizonte longo + sucessão → previdência (A12); gap vs. INSS projetado",
   "strategies": [
    "pgbl-12-completa",
    "asset-location",
    "evitar-come-cotas",
    "glidepath-derisk",
    "prev-substituto-inss",
    "vgbl-fracionado-600k",
    "dolarizacao-em-camadas"
   ],
   "personas": "Ricardo, Thiago, José Carlos",
   "segs": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "kpi": "Gap = despesa desejada − INSS projetado (motor)",
   "status": "base"
  },
  {
   "id": "renda-decumulacao",
   "name": "Viver de renda (decumulação)",
   "need": 5,
   "l3": "Longevidade",
   "nature": "fluxo",
   "h": 2,
   "hRange": [
    0,
    40
   ],
   "flexY": 40,
   "flexV": "needs",
   "ptypes": [
    "inv"
   ],
   "extraIds": [
    "renda-vitalicia"
   ],
   "caps": {
    "M": 2,
    "C": 2,
    "L": 1,
    "X": 1
   },
   "gp": false,
   "dmOn": true,
   "decumul": true,
   "gatedByDebt": true,
   "pisoOverrideIds": [
    "fii",
    "fi-infra",
    "fiagro",
    "deb-inc",
    "cri-cra"
   ],
   "modIds": [
    "inss",
    "imovel-renda"
   ],
   "funding": "Estoque acumulado → renda",
   "hardRule": "2 anos de gastos sempre em liquidez (balde 1); renda antes de crescimento; kit isento p/ Conservador SÓ via mandato diversificado (concentração vetada) [A-03].",
   "triggers": "Transição saldo → renda (José Carlos); renda durável à prova de inflação (Helena)",
   "strategies": [
    "bucket-decumulacao",
    "renda-isenta-decumulacao",
    "escada-vencimentos",
    "harvest-isencoes"
   ],
   "personas": "Helena, José Carlos",
   "segs": [
    "Prime",
    "Principal",
    "Private"
   ],
   "kpi": "Renda real mensal sustentável (motor)",
   "status": "base"
  },
  {
   "id": "veiculo-troca",
   "name": "Trocar de veículo",
   "need": 6,
   "l3": "Longevidade",
   "nature": "data",
   "h": 3,
   "hRange": [
    1,
    6
   ],
   "flexY": 1,
   "flexV": "wants",
   "ptypes": [
    "inv",
    "cred"
   ],
   "credIds": [
    "consorcio"
   ],
   "caps": {
    "M": 0,
    "C": 1,
    "L": 2,
    "X": 0
   },
   "gp": false,
   "dmOn": true,
   "gatedByDebt": true,
   "funding": "Aporte programado ou consórcio",
   "hardRule": "CDC sobre bem depreciante (−12% real) é a pior combinação da matriz.",
   "triggers": "Idade/km do veículo atual",
   "strategies": [
    "consorcio-vs-cdc",
    "escada-vencimentos"
   ],
   "personas": "Camila & Diego, Ricardo",
   "segs": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "kpi": "% do valor-alvo",
   "status": "base"
  },
  {
   "id": "projeto-pessoal",
   "name": "Projeto pessoal (viagem, casamento, sabático)",
   "need": 6,
   "l3": "Liquidez",
   "nature": "data",
   "h": 2,
   "hRange": [
    1,
    4
   ],
   "flexY": 1,
   "flexV": "wishes",
   "ptypes": [
    "inv"
   ],
   "caps": {
    "M": 1,
    "C": 1,
    "L": 1,
    "X": 0
   },
   "gp": false,
   "dmOn": true,
   "gatedByDebt": true,
   "funding": "Poupança por meta (anti-deriva)",
   "hardRule": null,
   "triggers": "Controlar o creep discricionário: meta nomeada em vez de gasto difuso (doc 02)",
   "strategies": [
    "escada-vencimentos",
    "duration-match"
   ],
   "personas": "Camila & Diego, Ricardo, Patrícia",
   "segs": [
    "Retail",
    "Prime",
    "Principal",
    "Private"
   ],
   "kpi": "% da meta",
   "status": "base"
  },
  {
   "id": "alocar-subita",
   "name": "Alocar soma súbita (herança, venda, bônus)",
   "need": 6,
   "l3": "Longevidade",
   "nature": "evento",
   "h": 1,
   "hRange": [
    0,
    3
   ],
   "flexY": 2,
   "flexV": "wants",
   "ptypes": [
    "inv"
   ],
   "caps": {
    "M": 1,
    "C": 1,
    "L": 1,
    "X": 0
   },
   "gp": false,
   "dmOn": false,
   "gatedByDebt": true,
   "funding": "Estoque a posicionar (staging)",
   "hardRule": "Política de staging: estacionar em DI e posicionar em etapas — nunca all-in num dia (Patrícia: pilha de 35% em DI).",
   "triggers": "Evento de liquidez detectado; política de bônus (Ricardo)",
   "strategies": [
    "staging-soma-subita",
    "asset-location",
    "harvest-isencoes"
   ],
   "personas": "Patrícia, Ricardo, Antônio",
   "segs": [
    "Principal",
    "Private"
   ],
   "kpi": "% posicionado conforme política-destino",
   "status": "base"
  },
  {
   "id": "meta-fx",
   "name": "Meta em moeda estrangeira (educação fora, morar fora)",
   "need": 4,
   "l3": "Longevidade",
   "nature": "data",
   "h": 8,
   "hRange": [
    3,
    20
   ],
   "flexY": 2,
   "flexV": "wants",
   "ptypes": [
    "inv",
    "estr"
   ],
   "caps": {
    "M": 3,
    "C": 2,
    "L": 2,
    "X": 3
   },
   "gp": true,
   "dmOn": true,
   "fxLiability": true,
   "gatedByDebt": true,
   "funding": "Aporte em ativos na moeda do passivo",
   "hardRule": "A moeda do objetivo define o X: ter câmbio É o hedge — X alto é requisito. De-risking correto acontece DENTRO da moeda (glidepath só aperta M dos ativos sem câmbio; RF em moeda forte é o porto). [A-04]",
   "triggers": "Meta com passivo em moeda forte (Ricardo: educação no exterior)",
   "strategies": [
    "dolarizacao-em-camadas",
    "glidepath-derisk",
    "escada-vencimentos"
   ],
   "personas": "Ricardo, Patrícia, Antônio",
   "segs": [
    "Prime",
    "Principal",
    "Private"
   ],
   "kpi": "% da meta na moeda do passivo",
   "status": "review"
  },
  {
   "id": "negocio-capital",
   "name": "Capitalizar o negócio próprio",
   "need": 6,
   "l3": "Longevidade",
   "nature": "data",
   "h": 4,
   "hRange": [
    1,
    10
   ],
   "flexY": 2,
   "flexV": "wants",
   "ptypes": [
    "inv",
    "cred"
   ],
   "credIds": [
    "capital-giro"
   ],
   "caps": {
    "M": 1,
    "C": 2,
    "L": 2,
    "X": 0
   },
   "gp": false,
   "dmOn": true,
   "gatedByDebt": true,
   "funding": "Sobra PF + crédito PJ na fronteira certa",
   "hardRule": "Fronteira PF×PJ: pró-labore disciplinado; caixa da empresa não é patrimônio pessoal (Thiago).",
   "triggers": "Renda irregular + reserva ampliada antes de arriscar capital próprio",
   "strategies": [
    "amortizar-vs-investir",
    "dimensionar-reserva"
   ],
   "personas": "Thiago, Bruno, Patrícia",
   "segs": [
    "Prime",
    "Principal",
    "Private"
   ],
   "kpi": "Capital disponível sem contaminar a PF",
   "status": "review"
  },
  {
   "id": "sucessao",
   "name": "Sucessão organizada (menor vazamento)",
   "need": 7,
   "l3": "Legado",
   "nature": "estrut",
   "h": 20,
   "hRange": [
    0,
    40
   ],
   "flexY": 40,
   "flexV": "needs",
   "ptypes": [
    "estr",
    "prot",
    "inv"
   ],
   "caps": {
    "M": 2,
    "C": 2,
    "L": 3,
    "X": 2
   },
   "gp": false,
   "dmOn": false,
   "funding": "Estrutura + prêmios + realocação",
   "hardRule": "Janela fechando: leis estaduais do ITCMD progressivo valem a partir de 2027 — travar base/alíquota de hoje.",
   "triggers": "Horizonte longo + sucessão → previdência (A12); patrimônio imobilizado/quotas",
   "strategies": [
    "trio-sucessorio",
    "usufruto-trava-2027",
    "holding-com-substancia",
    "evitar-come-cotas"
   ],
   "personas": "Antônio, Patrícia, Helena, José Carlos",
   "segs": [
    "Principal",
    "Private"
   ],
   "kpi": "% do patrimônio com rota sucessória definida",
   "status": "base"
  },
  {
   "id": "sucessao-negocio",
   "name": "Sucessão do negócio (manter vs. vender)",
   "need": 7,
   "l3": "Legado",
   "nature": "estrut",
   "h": 5,
   "hRange": [
    2,
    15
   ],
   "flexY": 3,
   "flexV": "needs",
   "ptypes": [
    "estr"
   ],
   "caps": {
    "M": 3,
    "C": 3,
    "L": 3,
    "X": 2
   },
   "gp": false,
   "dmOn": false,
   "modIds": [
    "participacao"
   ],
   "funding": "Estrutura societária + eventual liquidez de venda",
   "hardRule": "Quotas entram no ITCMD a VALOR DE MERCADO (LC 227) — a avaliação contábil morreu; valuation é pré-requisito.",
   "triggers": "Fundador 60+ / dependência do dono (Bruno); participação concentrada (Patrícia)",
   "strategies": [
    "holding-com-substancia",
    "usufruto-trava-2027",
    "staging-soma-subita"
   ],
   "personas": "Bruno, Patrícia, Antônio",
   "segs": [
    "Principal",
    "Private"
   ],
   "kpi": "Rota definida: manter (governança) ou vender (staging)",
   "status": "review"
  },
  {
   "id": "liquidez-espolio",
   "name": "Liquidez do espólio (ITCMD e custas)",
   "need": 7,
   "l3": "Legado",
   "nature": "cont",
   "h": 20,
   "hRange": [
    0,
    40
   ],
   "flexY": 40,
   "flexV": "needs",
   "ptypes": [
    "prot",
    "inv"
   ],
   "extraIds": [
    "prev-suc"
   ],
   "caps": {
    "M": 0,
    "C": 1,
    "L": 1,
    "X": 0
   },
   "gp": false,
   "dmOn": false,
   "funding": "Prêmio de seguro dimensionado + previdência-bypass",
   "hardRule": "Sem liquidez, herdeiros vendem ativos com pressa e desconto: seguro + previdência (fora do inventário) pagam o ITCMD, não o espólio. [A-08]",
   "triggers": "Patrimônio imobilizado alto vs. caixa (Antônio)",
   "strategies": [
    "seguro-dimensionado-itcmd",
    "trio-sucessorio"
   ],
   "personas": "Antônio",
   "segs": [
    "Principal",
    "Private"
   ],
   "kpi": "ITCMD + custas estimados cobertos (motor)",
   "status": "base"
  },
  {
   "id": "doacao-vida",
   "name": "Doar em vida / filantropia",
   "need": 7,
   "l3": "Legado",
   "nature": "estrut",
   "h": 10,
   "hRange": [
    0,
    40
   ],
   "flexY": 40,
   "flexV": "wishes",
   "ptypes": [
    "estr"
   ],
   "caps": {
    "M": 3,
    "C": 3,
    "L": 3,
    "X": 3
   },
   "gp": false,
   "dmOn": false,
   "funding": "Excedente após needs/wants",
   "hardRule": null,
   "triggers": "Isenção anual estadual como capacidade consumível; regra de consolidação (LC 227) a monitorar",
   "strategies": [
    "doacao-seriada-isencao",
    "usufruto-trava-2027",
    "harvest-isencoes"
   ],
   "personas": "Antônio, Helena",
   "segs": [
    "Principal",
    "Private"
   ],
   "kpi": "Isenção anual utilizada",
   "status": "review"
  },
  {
   "id": "desmobilizacao-fisica",
   "name": "Desmobilizar patrimônio físico (rota de liquidez)",
   "need": 7,
   "l3": "Legado",
   "nature": "estrut",
   "h": 5,
   "hRange": [
    1,
    15
   ],
   "flexY": 3,
   "flexV": "wants",
   "ptypes": [
    "inv",
    "cred",
    "estr"
   ],
   "credIds": [
    "cgi",
    "home-equity"
   ],
   "caps": {
    "M": 1,
    "C": 1,
    "L": 2,
    "X": 0
   },
   "gp": false,
   "dmOn": false,
   "modIds": [
    "imovel-renda",
    "imovel-proprio",
    "participacao"
   ],
   "funding": "Venda programada (staging) / aluguel / crédito-ponte sobre o ativo",
   "hardRule": "A iliquidez do balanço é a causa-raiz do risco de espólio: cada ativo físico precisa de rota — vender, alugar ou dar em garantia. Valuation e custo de carregamento são do motor. [A-07]",
   "triggers": "Patrimônio físico ≫ financeiro (Antônio: R$55M/R$80M); pós-venda alimenta alocar-subita",
   "strategies": [
    "rota-liquidez-fisica",
    "staging-soma-subita",
    "holding-com-substancia",
    "seguro-dimensionado-itcmd"
   ],
   "personas": "Antônio, Patrícia",
   "segs": [
    "Principal",
    "Private"
   ],
   "kpi": "% do balanço físico com rota de liquidez definida",
   "status": "review"
  }
 ]
};
