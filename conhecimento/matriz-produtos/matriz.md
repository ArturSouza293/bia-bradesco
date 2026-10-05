---
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

> **GERADO** por `scripts/kb/extract-matriz.mjs` a partir de `fonte/vision_goal_matrix_v1.jsx` (v1.0, jul/2026, a
> matriz vigente do Vision) com o texto descritivo dos 66 de base herdado de `fonte/vision_tax_duration_matrix.jsx`
> (v0.3). Não edite à mão — edite a fonte e regenere.
> **Dados ilustrativos; ratificar com Tributário. Uso interno (lente de gerente), só depois do número do plano — nunca
> citado ao cliente.**

## O que a v1.0 mudou nos campos do motor (7 produtos de base)

- `pgbl`: seg: ["Prime","Principal","Private"] → ["Retail","Prime","Principal","Private"]
- `vgbl`: seg: ["Prime","Principal","Private"] → ["Retail","Prime","Principal","Private"]
- `multi`: seg: ["Principal","Private"] → ["Prime","Principal","Private"]
- `seguro`: seg: ["Prime","Principal","Private"] → ["Retail","Prime","Principal","Private"]
- `holding`: seg: ["Private"] → ["Principal","Private"]
- `etf-intl`: risk: "Agressivo" → "Moderado"
- `prestamista`: seg: ["Retail","Prime","Principal"] → ["Retail","Prime","Principal","Private"]


## Liquidez (19 produtos)

| Produto | Tipo | Classe | Duração | Regime | Alíquota LP | Risco | Segmentos | Status |
|---|---|---|---|---|---|---|---|---|
| Tesouro Selic | Investimento | Liquidez / caixa | Curtíssimo | RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private | base |
| CDB liquidez diária | Investimento | Renda fixa bancária | Curtíssimo | RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private | base |
| Fundo DI / Referenciado DI | Investimento | Fundos (aberto) | Curtíssimo | Come-cotas | 15% | Conservador | Retail, Prime, Principal, Private | base |
| Poupança | Investimento | Liquidez / caixa | Curtíssimo | Isento PF | 0% | Conservador | Retail, Prime | base |
| LCI / LCA (pós-fixada) | Investimento | Renda fixa bancária | Curto | Isento PF | 0% | Conservador | Prime, Principal, Private | base |
| CGI (crédito c/ garantia de investimentos) | Crédito | Liquidez / crédito | Médio | Sem IR | 0% | Moderado | Principal, Private | base |
| FGTS | Modelado | FGTS | Longo | Isento PF | 0% | Conservador | Retail, Prime | base |
| ETF de renda fixa | Investimento | Fundos (aberto) | Médio | ETF-RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private | review |
| Fundo Cambial | Investimento | Fundos (aberto) | Curto | Come-cotas | 20% | Moderado | Principal, Private | review |
| Home Equity (crédito c/ garantia de imóvel) | Crédito | Liquidez / crédito | Longo | Sem IR | 0% | Moderado | Principal, Private | review |
| Crédito Consignado | Crédito | Liquidez / crédito | Médio | Sem IR | 0% | Conservador | Retail, Prime | review |
| Plano de saúde | Proteção | Proteção / saúde | Vitalício | Dedução IRPF | 0% | Conservador | Retail, Prime, Principal, Private | base |
| Seguros patrimoniais (residencial/auto) | Proteção | Proteção / seguro | Vitalício | Sem IR | 0% | Conservador | Retail, Prime, Principal, Private | base |
| CDC / crédito pessoal (incl. veículo) | Crédito | Passivo / crédito | Curto | Sem IR | 0% | Conservador | Retail, Prime | base |
| Cartão rotativo / cheque especial | Crédito | Passivo / crédito | Curtíssimo | Sem IR | 0% | Conservador | Retail, Prime | base |
| Antecipação de 13º / restituição / recebíveis | Crédito | Passivo / crédito | Curtíssimo | Sem IR | 0% | Conservador | Retail, Prime | base |
| Capital de giro / conta garantida (PJ) | Crédito | Passivo / crédito PJ | Curto | Sem IR | 0% | Moderado | Prime, Principal, Private | base |
| Seguro invalidez / doenças graves / DIT | Proteção | — | — | Isento PF | 0% | Conservador | Retail, Prime, Principal, Private | review |
| Parcelamento de fatura (rampa de saída) | Crédito | — | — | Sem IR | 0% | Conservador | Retail, Prime | review |

### Tesouro Selic (`selic`)
- **Papel:** Reserva de emergência · **Mandato:** Caixa / Selic · **Horizonte:** 0–1 anos · **Liquidez:** D+1 · sem marcação
- **Tributação:** RF regressivo — 22,5%→15% (evento: No resgate; IOF) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 0/0/0/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** Único título sem marcação a mercado; capital sempre preservado — o veículo de reserva mais limpo.

### CDB liquidez diária (`cdb-liq`)
- **Papel:** Reserva / caixa · **Mandato:** Caixa / Selic · **Horizonte:** 0–1 anos · **Liquidez:** D+0 · FGC R$250k
- **Tributação:** RF regressivo — 22,5%→15% (evento: No resgate; IOF) · **Base legal:** Tabela regressiva RF · FGC
- **Risco M/C/L/X:** 0/1/0/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** Core de reserva, familiar; sem come-cotas. Versões a prazo penalizam saída antecipada.

### Fundo DI / Referenciado DI (`fundo-di`)
- **Papel:** Caixa conveniente · **Mandato:** Caixa / Selic · **Horizonte:** 0–1 anos · **Liquidez:** D+0 / D+1
- **Tributação:** Come-cotas — 22,5%→15% + come-cotas (evento: Semestral (mai/nov) + resgate; IOF) · **Base legal:** Come-cotas + regressiva
- **Risco M/C/L/X:** 0/1/0/0 · **Piso suitability:** Conservador · **Status:** base
- **Marcas do motor:** drag
- **Nota de planejamento (v0.3):** Come-cotas quebra a composição silenciosamente; atenção à taxa de administração.

### Poupança (`poupanca`)
- **Papel:** Default por inércia · **Mandato:** Caixa / Selic · **Horizonte:** 0–1 anos · **Liquidez:** Saque livre · rende no aniversário
- **Tributação:** Isento PF — 0% (evento: —) · **Base legal:** Isenção legal
- **Risco M/C/L/X:** 0/0/0/0 · **Piso suitability:** Conservador · **Status:** base
- **Marcas do motor:** weak
- **Nota de planejamento (v0.3):** TR + 0,5%/mês — perde para inflação. O hábito mais corrigível; o que o Vision substitui.

### LCI / LCA (pós-fixada) (`lci-lca`)
- **Papel:** Renda fixa tax-free · **Mandato:** Inflação / crédito · **Horizonte:** 1–3 anos · **Liquidez:** Carência, depois líquida/venc.
- **Tributação:** Isento PF — 0% (evento: No resgate/venc.) · **Base legal:** Isenção PF · FGC
- **Risco M/C/L/X:** 0/1/2/0 · **Piso suitability:** Conservador · **Status:** base
- **Marcas do motor:** matchableL
- **Nota de planejamento (v0.3):** Isenta de IR; sticky por design. Risco de crédito no emissor (FGC até R$250k). Vencedor silencioso da RF. Carência mínima vigente a confirmar (mudou 2022–24).

### CGI (crédito c/ garantia de investimentos) (`cgi`)
- **Papel:** Liquidez sem realizar ganho · **Mandato:** — · **Horizonte:** 0–5 anos · **Liquidez:** Sob demanda · carteira penhorada
- **Tributação:** Sem IR — Sem IR (não vende) (evento: — (sem evento tributável)) · **Base legal:** Crédito garantido
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento (v0.3):** Levanta liquidez contra a carteira sem vender e disparar IR — a carteira continua compondo. Atenção à chamada de margem se a carteira cair. Ferramenta consciente de tributação.

### FGTS (`fgts`)
- **Papel:** Saldo vinculado · **Mandato:** — · **Horizonte:** 1–20 anos · **Liquidez:** Vinculado (saque em hipóteses legais)
- **Tributação:** Isento PF — 0% (evento: —) · **Base legal:** Remuneração legal TR+3%
- **Risco M/C/L/X:** 0/0/3/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** TR + 3% — negativo em termos reais. Modelar como arrasto; usar/sacar quando a hipótese legal permite. Ponte principal: amortizar/quitar financiamento imobiliário a cada 2 anos.

### ETF de renda fixa (`etf-rf`)
- **Papel:** Cesta de RF num ticker, sem come-cotas · **Mandato:** Caixa ou Inflação, conforme índice · **Horizonte:** 1–7 anos · **Liquidez:** B3 · a qualquer hora
- **Tributação:** ETF-RF regressivo — 25%→15% (prazo médio da carteira) (evento: Na venda/resgate) · **Base legal:** Regressiva por PMRC — Portaria MF 163/2016
- **Risco M/C/L/X:** 1/1/0/0 · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento (v0.3):** Alíquota corre pelo prazo médio de repactuação da carteira (PMRC), não pelo tempo que o investidor segurou a cota — pode nascer perto do piso de 15%. Sem come-cotas e sem IOF mesmo <30 dias.

### Fundo Cambial (`fundo-cambial`)
- **Papel:** Hedge cambial / dólar onshore · **Mandato:** Câmbio / dólar · **Horizonte:** 0–2 anos · **Liquidez:** D+1 a D+30
- **Tributação:** Come-cotas — 22,5%→20% (curto prazo típico) (evento: Semestral + resgate; IOF) · **Base legal:** Regra geral de fundos curto prazo
- **Risco M/C/L/X:** 2/0/1/3 · **Piso suitability:** Moderado · **Status:** review
- **Marcas do motor:** drag
- **Nota de planejamento (v0.3):** A maioria é curto prazo (carteira média <365 dias) — teto de come-cotas de 20%, não 15%; confirmar a classificação do fundo específico antes de assumir o piso de 15% usado em outras linhas.

### Home Equity (crédito c/ garantia de imóvel) (`home-equity`)
- **Papel:** Liquidez de menor custo sem vender · **Mandato:** — · **Horizonte:** 5–20 anos · **Liquidez:** Sob demanda · imóvel em garantia
- **Tributação:** Sem IR — Sem IR (é dívida) (evento: — (sem fato gerador p/ o mutuário)) · **Base legal:** Natureza de dívida
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento (v0.3):** Paralelo ao CGI, com imóvel como colateral em vez da carteira; custo (juros) menor pelo colateral. iof=false porque a coluna mede o IOF<30d de resgate; o IOF/crédito próprio (~0,38% + diário até teto) incide na contratação, fora do escopo. Juros não dedutíveis no IRPF.

### Crédito Consignado (`consignado`)
- **Papel:** Crédito mais barato com margem consignável · **Mandato:** — · **Horizonte:** 1–6 anos · **Liquidez:** Desconto em folha/benefício
- **Tributação:** Sem IR — Sem IR (é dívida) (evento: — (sem fato gerador)) · **Base legal:** Natureza de dívida
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento (v0.3):** Mesma lógica de CGI/home equity: sem IR ao tomador; IOF/crédito próprio na contratação, fora do escopo IOF<30d. Mais relevante em Retail/Prime — contraponto direto ao financiar-vs-investir. Também instrumento de CONSOLIDAÇÃO de dívida rotativa cara.

### Plano de saúde (`saude`)
- **Papel:** Proteção de fluxo + dedução · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Uso contínuo (mensalidade)
- **Tributação:** Dedução IRPF — Despesa dedutível SEM TETO (completa) (evento: Anual (dedução na DIRPF)) · **Base legal:** Dedução integral de despesas médicas (declaração completa)
- **Risco:** não se aplica (produto de Proteção) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** Não é investimento — é proteção + a alavanca de dedução mais subestimada: despesas médicas (incluindo o plano) são dedutíveis SEM TETO na completa. Regra sistêmica: gasto de saúde alto → completa quase sempre vence → habilita a dedução de 12% do PGBL. Reajustes acima do IPCA: modelar inflação médica própria (Fernanda).

### Seguros patrimoniais (residencial/auto) (`seg-patrimonial`)
- **Papel:** Protege o balanço · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Contingente (sinistro)
- **Tributação:** Sem IR — Indenização = recomposição · sem IR (evento: No sinistro) · **Base legal:** Indenização não é renda
- **Risco:** não se aplica (produto de Proteção) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** Indenização é recomposição patrimonial, não renda tributável. Sem dimensão de investimento — protege o balanço de choques que, sem seguro, drenariam a reserva ou forçariam venda de ativos (o elo com Liquidez).

### CDC / crédito pessoal (incl. veículo) (`cdc`)
- **Papel:** Consumo a prazo (evitar) · **Mandato:** — · **Horizonte:** 0–4 anos · **Liquidez:** Parcelas fixas
- **Tributação:** Sem IR — Sem IR (é dívida) (evento: —) · **Base legal:** Natureza de dívida
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** CET alto, sem qualquer benefício fiscal. Regra sistêmica: quitar antes de qualquer alocação (exceto reserva mínima) — nenhum retorno líquido realista bate o custo. Financiar bem depreciante (veículo, −12% real) é a pior combinação da matriz.

### Cartão rotativo / cheque especial (`rotativo`)
- **Papel:** Emergência cara (eliminar) · **Mandato:** — · **Horizonte:** 0–1 anos · **Liquidez:** Revolvente (evitar)
- **Tributação:** Sem IR — Sem IR (é dívida) (evento: —) · **Base legal:** Natureza de dívida
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** CET de três dígitos — destruidor de patrimônio. Regra sistêmica dura: dívida rotativa detectada → plano de quitação/consolidação (consignado, CGI) ANTES de qualquer conversa de investimento (Marcos).

### Antecipação de 13º / restituição / recebíveis (`antecipacao`)
- **Papel:** Suavização pontual · **Mandato:** — · **Horizonte:** 0–1 anos · **Liquidez:** Quita no recebível
- **Tributação:** Sem IR — Sem IR (é dívida) (evento: —) · **Base legal:** Natureza de dívida
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** Liquidez pontual com spread do banco. Uso excepcional de suavização — arriscado como hábito; se recorrente, o problema é orçamento, não crédito.

### Capital de giro / conta garantida (PJ) (`capital-giro`)
- **Papel:** Fôlego da empresa (PJ) · **Mandato:** — · **Horizonte:** 0–3 anos · **Liquidez:** Rotativo PJ
- **Tributação:** Sem IR — Sem IR ao tomador · juros dedutíveis na PJ (evento: —) · **Base legal:** Natureza de dívida (PJ)
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento (v0.3):** Mantém a empresa respirando sem contaminar a PF. Regra de fronteira: pró-labore disciplinado + não misturar caixa PJ e patrimônio pessoal (Thiago, Patrícia). Juros dedutíveis NA PJ (lucro real), nunca na PF.

### Seguro invalidez / doenças graves / DIT (`seg-invalidez`)
- **Linha nova da v1.0** · **Horizonte:** 0–40 anos · **Tributação:** Isento PF (alíquota-piso 0%)
- **Risco:** não se aplica (produto de Proteção) · **Piso suitability:** Conservador · **Status:** review
- **Marcas do motor:** review
- **Nota da v1.0:** [B-02] mecânica SUSEP A CONFIRMAR

### Parcelamento de fatura (rampa de saída) (`parcelamento-fatura`)
- **Linha nova da v1.0** · **Horizonte:** 0–1 anos · **Tributação:** Sem IR (alíquota-piso 0%)
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** review
- **Marcas do motor:** review
- **Nota da v1.0:** [A-10/B-07]


## Longevidade (41 produtos)

| Produto | Tipo | Classe | Duração | Regime | Alíquota LP | Risco | Segmentos | Status |
|---|---|---|---|---|---|---|---|---|
| Tesouro IPCA+ | Investimento | Títulos em custódia | Longo | RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private | base |
| Tesouro IPCA+ Juros Semestrais | Investimento | Títulos em custódia | Longo | RF regressivo | 15% | Conservador | Prime, Principal, Private | base |
| Tesouro Renda+ (NTN-B1) | Investimento | Títulos em custódia | Vitalício | RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private | base |
| Tesouro Educa+ | Investimento | Títulos em custódia | Longo | RF regressivo | 15% | Conservador | Prime, Principal, Private | base |
| CRI / CRA | Investimento | Renda fixa bancária | Longo | Isento PF | 0% | Moderado | Principal, Private | base |
| Debêntures incentivadas | Investimento | Renda fixa bancária | Longo | Isento PF | 0% | Moderado | Principal, Private | base |
| Debêntures regulares | Investimento | Renda fixa bancária | Médio | RF regressivo | 15% | Moderado | Principal, Private | base |
| Fundo RF Crédito Privado | Investimento | Fundos (aberto) | Médio | Come-cotas | 15% | Moderado | Prime, Principal, Private | base |
| Fundo Inflação (IMA-B) | Investimento | Fundos (aberto) | Longo | Come-cotas | 15% | Moderado | Prime, Principal, Private | base |
| PGBL | Investimento | Previdência | Vitalício | Previdência regr. | 10% | Conservador | Retail, Prime, Principal, Private | base |
| VGBL | Investimento | Previdência | Vitalício | Previdência regr. | 10% | Conservador | Retail, Prime, Principal, Private | base |
| Ações BR (buy & hold) | Investimento | Títulos em custódia | Longo | Ganho cap. RV | 15% | Agressivo | Prime, Principal, Private | base |
| ETF de ações (BOVA11) | Investimento | Títulos em custódia | Longo | ETF (fonte) | 15% | Agressivo | Prime, Principal, Private | base |
| Fundo de ações | Investimento | Fundos (aberto) | Longo | Ganho cap. RV | 15% | Agressivo | Prime, Principal, Private | base |
| FII (Fundo Imobiliário) | Investimento | Títulos em custódia | Longo | Isento PF | 0% | Moderado | Prime, Principal, Private | base |
| Fundo Multimercado | Investimento | Fundos (aberto) | Médio | Come-cotas | 15% | Moderado | Prime, Principal, Private | base |
| Internacional / Offshore | Investimento | Internacional | Longo | Offshore 15%/a | 15% | Moderado | Principal, Private | review |
| BDRs | Investimento | Títulos em custódia | Longo | Ganho cap. RV | 15% | Moderado | Principal, Private | base |
| FIDC | Investimento | Fundos (aberto) | Médio | Ganho cap. RV | 15% | Agressivo | Principal, Private | review |
| Alternativos (PE / FIP) | Investimento | Títulos em custódia | Vitalício | Ganho cap. RV | 15% | Agressivo | Private | review |
| Consórcio | Crédito | Aquisição programada | Médio | Sem IR | 0% | Conservador | Retail, Prime, Principal, Private | base |
| Tesouro Prefixado (LTN/NTN-F) | Investimento | Títulos em custódia | Médio | RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private | review |
| LIG (Letra Imobiliária Garantida) | Investimento | Renda fixa bancária | Longo | Isento PF | 0% | Conservador | Principal, Private | review |
| COE (Operações Estruturadas) | Investimento | Renda fixa bancária | Médio | RF regressivo | 15% | Moderado | Principal, Private | review |
| FIAgro | Investimento | Títulos em custódia | Longo | Isento PF | 0% | Moderado | Principal, Private | review |
| FI-Infra / FIP-IE | Investimento | Títulos em custódia | Longo | Isento PF | 0% | Moderado | Principal, Private | review |
| Ações no exterior (custódia direta) | Investimento | Internacional | Longo | Offshore 15%/a | 15% | Agressivo | Private | review |
| CDB a prazo (2a+) | Investimento | Renda fixa bancária | Médio | RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private | review |
| LCD (Letra de Crédito do Desenvolvimento) | Investimento | Renda fixa bancária | Longo | Isento PF | 0% | Conservador | Prime, Principal, Private | review |
| Carteira administrada | Investimento | Títulos em custódia (gestão) | Longo | Ativo a ativo | 15% | Conservador | Principal, Private | base |
| ETF internacional na B3 (IVVB11) | Investimento | Títulos em custódia | Longo | ETF (fonte) | 15% | Moderado | Prime, Principal, Private | base |
| Capitalização | Investimento | Capitalização | Médio | RF regressivo | 20% | Conservador | Retail, Prime | review |
| Financiamento imobiliário (SFH/SFI) | Crédito | Passivo / financiamento | Longo | Sem IR | 0% | Conservador | Retail, Prime, Principal, Private | base |
| Imóvel para renda (aluguel) | Modelado | Imóveis | Vitalício | IRPF progressivo | 27.5% | Moderado | Prime, Principal, Private | base |
| Imóvel residencial próprio | Modelado | Imóveis | Vitalício | Ganho cap. progr. | 15% | Conservador | Retail, Prime, Principal, Private | base |
| Cripto (ativos virtuais) | Modelado | Ativos virtuais | Longo | Ganho cap. progr. | 15% | Agressivo | Prime, Principal, Private | review |
| INSS (previdência social) | Modelado | Previdência social | Vitalício | IRPF progressivo | 27.5% | Conservador | Retail, Prime, Principal, Private | base |
| Veículo (bem de uso) | Modelado | Veículos | Médio | Sem IR | 0% | Conservador | Retail, Prime, Principal, Private | base |
| Caixa em moeda forte (conta global) | Investimento | — | — | Offshore 15%/a | 15% | Moderado | Principal, Private | review |
| RF em moeda forte (Treasuries/bonds) | Investimento | — | — | Offshore 15%/a | 15% | Moderado | Principal, Private | review |
| Renda vitalícia contratada (anuidade) | Proteção | — | — | Previdência regr. | 10% | Conservador | Prime, Principal, Private | review |

### Tesouro IPCA+ (`ipca`)
- **Papel:** Proteção poder de compra · **Mandato:** Inflação (IPCA+) · **Horizonte:** 5–15 anos · **Liquidez:** D+1 · marcação a mercado
- **Tributação:** RF regressivo — 15% (2a+) (evento: No resgate; IOF) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 2/0/0/0 · **Piso suitability:** Conservador · **Status:** base
- **Marcas do motor:** dm
- **Nota de planejamento (v0.3):** Principal protegido da inflação se levado ao vencimento; oscila (MtM) se vendido antes — o risco de mercado colapsa quando duration ≤ horizonte do objetivo.

### Tesouro IPCA+ Juros Semestrais (`ipca-cupom`)
- **Papel:** Renda protegida da inflação · **Mandato:** Inflação (IPCA+) · **Horizonte:** 5–15 anos · **Liquidez:** Cupom semestral · MtM
- **Tributação:** RF regressivo — 15% (2a+) (evento: Semestral (cupom) + resgate; IOF) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 2/0/0/0 · **Piso suitability:** Conservador · **Status:** base
- **Marcas do motor:** dm, income
- **Nota de planejamento (v0.3):** Core da decumulação (Helena): renda protegida da inflação na aposentadoria.

### Tesouro Renda+ (NTN-B1) (`rendamais`)
- **Papel:** Renda de aposentadoria · **Mandato:** Inflação (IPCA+) · **Horizonte:** 10–40 anos · **Liquidez:** Carência 60d · 240 pgtos mensais
- **Tributação:** RF regressivo — 15% (2a+) (evento: Fase de pagamento) · **Base legal:** Regressiva RF · isenção custódia até 4 SM
- **Risco M/C/L/X:** 2/0/1/0 · **Piso suitability:** Conservador · **Status:** base
- **Marcas do motor:** dm, income
- **Nota de planejamento (v0.3):** Cadência de pagamento (não lump); desenhado com R. Merton. Disciplina comportamental brasileira.

### Tesouro Educa+ (`educamais`)
- **Papel:** Objetivo educação · **Mandato:** Inflação (IPCA+) · **Horizonte:** 5–18 anos · **Liquidez:** Carência 60d · 60 pgtos mensais
- **Tributação:** RF regressivo — 15% (2a+) (evento: Fase de pagamento) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 2/0/1/0 · **Piso suitability:** Conservador · **Status:** base
- **Marcas do motor:** dm
- **Nota de planejamento (v0.3):** Financiamento programado de faculdade — encaixe natural para famílias com filhos (Fernanda).

### CRI / CRA (`cri-cra`)
- **Papel:** RF isenta longa · **Mandato:** Crédito privado · **Horizonte:** 4–10 anos · **Liquidez:** Venc. (secundário fino)
- **Tributação:** Isento PF — 0% (evento: No vencimento) · **Base legal:** Isenção PF (imob./agro)
- **Risco M/C/L/X:** 1/2/3/0 · **Piso suitability:** Moderado · **Status:** base
- **Marcas do motor:** income
- **Nota de planejamento (v0.3):** Uma LCI/LCA mais longa, tax-free; risco de crédito no emissor e iliquidez. Tickets maiores.

### Debêntures incentivadas (`deb-inc`)
- **Papel:** Crédito corporativo isento · **Mandato:** Crédito privado · **Horizonte:** 4–10 anos · **Liquidez:** Venc. (secundário)
- **Tributação:** Isento PF — 0% (evento: No vencimento) · **Base legal:** Lei 12.431/2011 (infraestrutura)
- **Risco M/C/L/X:** 1/2/2/0 · **Piso suitability:** Moderado · **Status:** base
- **Marcas do motor:** income
- **Nota de planejamento (v0.3):** Renda fixa corporativa com bônus tributário em infra. Isenta de IR para PF. Não confundir com a debênture de infraestrutura da Lei 14.801/2024 — nela o benefício é do EMISSOR e a PF é tributada normalmente.

### Debêntures regulares (`deb-reg`)
- **Papel:** Crédito privado · **Mandato:** Crédito privado · **Horizonte:** 3–7 anos · **Liquidez:** Venc. (secundário)
- **Tributação:** RF regressivo — 22,5%→15% (evento: No resgate/venc.) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 1/2/2/0 · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento (v0.3):** Pagam IR (vs. incentivadas isentas). Yield sobre o DI com risco de crédito.

### Fundo RF Crédito Privado (`fundo-cp`)
- **Papel:** Yield pickup sobre DI · **Mandato:** Crédito privado · **Horizonte:** 1–3 anos · **Liquidez:** D+30 (alguns D+90)
- **Tributação:** Come-cotas — 22,5%→15% + come-cotas (evento: Semestral + resgate; IOF) · **Base legal:** Come-cotas + regressiva
- **Risco M/C/L/X:** 1/2/2/0 · **Piso suitability:** Moderado · **Status:** base
- **Marcas do motor:** drag
- **Nota de planejamento (v0.3):** Yield sobre o DI via crédito; come-cotas arrasta. Atenção ao risco de crédito do pool.

### Fundo Inflação (IMA-B) (`fundo-imab`)
- **Papel:** Sleeve longa anti-inflação · **Mandato:** Inflação (IPCA+) · **Horizonte:** 3–10 anos · **Liquidez:** D+1 a D+30
- **Tributação:** Come-cotas — 22,5%→15% + come-cotas (evento: Semestral + resgate; IOF) · **Base legal:** Come-cotas + regressiva
- **Risco M/C/L/X:** 2/1/1/0 · **Piso suitability:** Moderado · **Status:** base
- **Marcas do motor:** drag
- **Nota de planejamento (v0.3):** Substitui Tesouro IPCA+ com diversificação; come-cotas reduz a eficiência vs. o título direto.

### PGBL (`pgbl`)
- **Papel:** Dedução 12% + regressiva · **Mandato:** Por mandato − taxa · **Horizonte:** 10–40 anos · **Liquidez:** Resgate / renda
- **Tributação:** Previdência regr. — 35%→10% (10a+) (evento: Na saída / renda) · **Base legal:** Regressiva previdência · dedução 12% · Lei 14.803/2024
- **Risco M/C/L/X:** 1/1/2/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** Três benefícios: dedução (12% da renda, só declarante completa) + regressiva + sucessão fora do inventário. Lei 14.803/2024: a opção pelo regime (regressivo/progressivo) passou a ser feita no momento do resgate/benefício — decisão flexibilizada. Risco: conforme o FIE contratado.
- **Nota da v1.0:** [A-02] +Retail

### VGBL (`vgbl`)
- **Papel:** Regressiva + sucessão · **Mandato:** Por mandato − taxa · **Horizonte:** 10–40 anos · **Liquidez:** Resgate / renda
- **Tributação:** Previdência regr. — 35%→10% (só ganho) (evento: Na saída / renda) · **Base legal:** Regressiva previdência (só ganho) · Lei 14.803/2024
- **Risco M/C/L/X:** 1/1/2/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** Sem dedução; tributa só o ganho. Ideal para declarante pela simplificada e alocação sucessória. IOF de entrada: 5% sobre aportes anuais acima de R$600k/CPF (Decreto 12.499/2025) — PGBL não é afetado; fracionar entre anos evita. Lei 14.803/2024: opção de regime no resgate. Risco: conforme o FIE.
- **Nota da v1.0:** [A-02] +Retail

### Ações BR (buy & hold) (`acoes`)
- **Papel:** Crescimento · **Mandato:** Ações BR · **Horizonte:** 5–15 anos · **Liquidez:** B3 · D+2
- **Tributação:** Ganho cap. RV — 15% + isenção R$20k/mês (evento: Na venda) · **Base legal:** Ganho de capital RV · isenção spot
- **Risco M/C/L/X:** 3/0/0/0 · **Piso suitability:** Agressivo · **Status:** base
- **Nota de planejamento (v0.3):** Isenção de R$20k/mês em vendas spot (que ETF não tem); dividendos isentos até o teto de 2026.

### ETF de ações (BOVA11) (`etf-acoes`)
- **Papel:** Mercado inteiro num ticker · **Mandato:** Ações BR · **Horizonte:** 5–15 anos · **Liquidez:** B3 · a qualquer hora
- **Tributação:** ETF (fonte) — 15% · sem isenção 20k (evento: Na venda) · **Base legal:** Ganho de capital · dividendos tributados
- **Risco M/C/L/X:** 3/0/0/0 · **Piso suitability:** Agressivo · **Status:** base
- **Nota de planejamento (v0.3):** Simples e barato para ter o índice; tributação menos amigável que ações diretas (sem isenção de R$20k).

### Fundo de ações (`fundo-acoes`)
- **Papel:** Gestão delegada · **Mandato:** Ações BR · **Horizonte:** 5–15 anos · **Liquidez:** D+30
- **Tributação:** Ganho cap. RV — 15% · sem come-cotas (evento: No resgate) · **Base legal:** 15% s/ ganho · sem come-cotas
- **Risco M/C/L/X:** 3/0/2/0 · **Piso suitability:** Agressivo · **Status:** base
- **Nota de planejamento (v0.3):** Fundos de ação não sofrem come-cotas; razoavelmente eficiente para dinheiro longo em ações.

### FII (Fundo Imobiliário) (`fii`)
- **Papel:** Renda isenta mensal · **Mandato:** Imobiliário / renda · **Horizonte:** 5–15 anos · **Liquidez:** B3 · líquida
- **Tributação:** Isento PF — Distrib. isenta · 20% no ganho (evento: Distrib. mensal + venda) · **Base legal:** Distribuição isenta PF · ganho 20%
- **Risco M/C/L/X:** 2/1/1/0 · **Piso suitability:** Moderado · **Status:** base
- **Marcas do motor:** income
- **Nota de planejamento (v0.3):** Motor de renda isenta (Helena). O ganho de capital na venda de cotas é tributado a 20%. Isenção exige 50+ cotistas, negociação em bolsa e cotista PF <10%.

### Fundo Multimercado (`multi`)
- **Papel:** Gestão ativa · **Mandato:** Multimercado · **Horizonte:** 3–7 anos · **Liquidez:** D+30 cotização + D+1
- **Tributação:** Come-cotas — 22,5%→15% + come-cotas (evento: Semestral + resgate; IOF) · **Base legal:** Come-cotas + regressiva
- **Risco M/C/L/X:** 2/1/2/0 · **Piso suitability:** Moderado · **Status:** base
- **Marcas do motor:** drag
- **Nota de planejamento (v0.3):** Sleeve de gestão ativa (juros/FX/ações); come-cotas arrasta a composição. Confirmar classificação curto vs. longo prazo do fundo — muda o piso (20% vs. 15%).
- **Nota da v1.0:** [B-04] +Prime

### Internacional / Offshore (`intl`)
- **Papel:** Diversificação + moeda · **Mandato:** Internacional · **Horizonte:** 5–15 anos · **Liquidez:** Varia (conta/fundo)
- **Tributação:** Offshore 15%/a — 15% flat anual (evento: Anual (31/dez) ou realização) · **Base legal:** Lei 14.754/2023
- **Risco M/C/L/X:** 2/1/2/3 · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento (v0.3):** Fim do diferimento; substância importa. FX é a maior incerteza. Escala ~11% Principal → ~34% Private.

### BDRs (`bdr`)
- **Papel:** Ações globais em BRL · **Mandato:** Internacional · **Horizonte:** 5–15 anos · **Liquidez:** B3
- **Tributação:** Ganho cap. RV — 15% · dividendos tributados (evento: Na venda) · **Base legal:** Ganho de capital RV
- **Risco M/C/L/X:** 3/0/1/3 · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento (v0.3):** Acesso a ações estrangeiras em BRL sem conta offshore; dividendos estrangeiros passam por tributação. Se BDR tem a isenção de R$20k/mês: a confirmar.

### FIDC (`fidc`)
- **Papel:** Aumentador de retorno · **Mandato:** Crédito privado · **Horizonte:** 2–5 anos · **Liquidez:** Fechado / semi-líquido
- **Tributação:** Ganho cap. RV — 15% (qualificado, sem come-cotas) (evento: Na realização) · **Base legal:** Lei 14.754 (exceção FIDC)
- **Risco M/C/L/X:** 1/3/3/0 · **Piso suitability:** Agressivo · **Status:** review
- **Nota de planejamento (v0.3):** Spread alto, risco de crédito no pool; para perfis sofisticados. Qualificado escapa do come-cotas — confirmar classificação Entidade de Investimento do fundo específico. Subscrição sofre IOF de 0,38% (desde jul/2025).

### Alternativos (PE / FIP) (`alts`)
- **Papel:** Prêmio de iliquidez · **Mandato:** Alternativos · **Horizonte:** 7–15 anos · **Liquidez:** Fechado / ilíquido
- **Tributação:** Ganho cap. RV — 15% (FIP qualificado) (evento: Na realização / desinv.) · **Base legal:** Lei 14.754 (exceção FIP)
- **Risco M/C/L/X:** 3/2/3/0 · **Piso suitability:** Agressivo · **Status:** review
- **Nota de planejamento (v0.3):** Prêmio de iliquidez (~+10% real, ilustrativo); só Private. FIP qualificado escapa do come-cotas.

### Consórcio (`consorcio`)
- **Papel:** Aquisição programada · **Mandato:** — · **Horizonte:** 2–7 anos · **Liquidez:** Travado até contemplação
- **Tributação:** Sem IR — Sem IR (evento: —) · **Base legal:** —
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** Poupança forçada + aquisição adiada; sem juros mas com taxa de administração. Acesso só por sorteio ou lance (FGTS pode dar lance em imobiliário). Stickiness de dupla face: ótimo quando força bom comportamento, ruim quando trava no produto errado.

### Tesouro Prefixado (LTN/NTN-F) (`prefixado`)
- **Papel:** Trava taxa nominal hoje · **Mandato:** Taxa fixa · **Horizonte:** 2–10 anos · **Liquidez:** D+1 · marcação a mercado
- **Tributação:** RF regressivo — 22,5%→15% (evento: No resgate; IOF) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 3/0/0/0 · **Piso suitability:** Conservador · **Status:** review
- **Marcas do motor:** dm
- **Nota de planejamento (v0.3):** Útil quando a visão é de queda de juro nominal — sofre marcação a mercado CHEIA se vendido antes do vencimento (M3), mais que o IPCA+. Casado com o vencimento, o risco de mercado colapsa. Não protege da inflação.

### LIG (Letra Imobiliária Garantida) (`lig`)
- **Papel:** RF isenta com garantia dupla · **Mandato:** Inflação / crédito · **Horizonte:** 3–10 anos · **Liquidez:** Carência, depois líquida/venc.
- **Tributação:** Isento PF — 0% (evento: No resgate/venc.) · **Base legal:** Lei 14.421/2022 — isenção PF
- **Risco M/C/L/X:** 0/1/2/0 · **Piso suitability:** Conservador · **Status:** review
- **Marcas do motor:** matchableL
- **Nota de planejamento (v0.3):** Como LCI/LCA, mas com patrimônio de afetação + garantia direta do emissor (dupla proteção); tickets e prazos maiores, encaixa em Principal/Private.
- **Nota da v1.0:** basis correta: Lei 13.097/2015 [B-06]

### COE (Operações Estruturadas) (`coe`)
- **Papel:** Visão tática, capital protegido (opcional) · **Mandato:** Tático / estruturado · **Horizonte:** 1–5 anos · **Liquidez:** Só no vencimento (regra geral)
- **Tributação:** RF regressivo — 22,5%→15% (evento: No vencimento; IOF) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 2/2/3/0 · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento (v0.3):** Um único evento tributário no vencimento; o risco real está na estrutura (capital protegido vs. não) e no emissor, não no IR — exige nota de risco própria por série, não genérica.

### FIAgro (`fiagro`)
- **Papel:** Renda isenta ligada ao agro · **Mandato:** Agro / crédito · **Horizonte:** 4–10 anos · **Liquidez:** B3 · líquida
- **Tributação:** Isento PF — Distrib. isenta (c/ requisitos) · 20% ganho (evento: Distrib. + venda) · **Base legal:** Lei 14.130/2021; Lei 11.033/2004 art. 3º
- **Risco M/C/L/X:** 2/2/1/0 · **Piso suitability:** Moderado · **Status:** review
- **Marcas do motor:** income
- **Nota de planejamento (v0.3):** Isenção da distribuição só vale com 50+ cotistas, cotas negociadas em bolsa/balcão e nenhum cotista PF com >=10% — fora disso, 20% na distribuição. Ganho na venda é sempre 20% (o FI-Infra também isenta o ganho; o FIAgro não).

### FI-Infra / FIP-IE (`fi-infra`)
- **Papel:** Renda + ganho isentos — mais amplo que FII · **Mandato:** Infraestrutura / crédito · **Horizonte:** 5–15 anos · **Liquidez:** B3 · líquida (ou fechado)
- **Tributação:** Isento PF — Distrib. isenta · ganho isento (evento: Distrib. + venda) · **Base legal:** Lei 12.431/2011; Resolução CVM 175
- **Risco M/C/L/X:** 2/2/1/0 · **Piso suitability:** Moderado · **Status:** review
- **Marcas do motor:** income
- **Nota de planejamento (v0.3):** Isenção cobre distribuição E ganho de capital na venda das cotas — mais ampla que a do FII (que tributa o ganho a 20%). Exige >=85% do PL em ativos de infraestrutura elegíveis, majoritariamente debêntures incentivadas.

### Ações no exterior (custódia direta) (`acoes-exterior`)
- **Papel:** Exposição direta sem wrapper BR · **Mandato:** Internacional · **Horizonte:** 5–15 anos · **Liquidez:** Mercado de origem
- **Tributação:** Offshore 15%/a — A CONFIRMAR — 15%/a (Lei 14.754) ou ganho de capital (evento: Anual e/ou na venda — a confirmar) · **Base legal:** Lei 14.754/2023 — mecânica a confirmar
- **Risco M/C/L/X:** 3/0/1/3 · **Piso suitability:** Agressivo · **Status:** review
- **Nota de planejamento (v0.3):** ZONA CINZENTA: não confirmado se ações estrangeiras em custódia direta caem em aplicações financeiras no exterior (15%/ano) ou no regime tradicional de ganho de capital sobre bens no exterior. CONFIANÇA BAIXA — não usar com cliente sem confirmação do Tributário.

### CDB a prazo (2a+) (`cdb-prazo`)
- **Papel:** RF datada núcleo · **Mandato:** Crédito bancário (pós/pré/IPCA) · **Horizonte:** 2–5 anos · **Liquidez:** Vencimento (saída penalizada)
- **Tributação:** RF regressivo — 22,5%→15% (evento: No resgate/venc.; IOF) · **Base legal:** Tabela regressiva RF · FGC
- **Risco M/C/L/X:** 0/1/2/0 · **Piso suitability:** Conservador · **Status:** review
- **Marcas do motor:** matchableL
- **Nota de planejamento (v0.3):** Versão a prazo do CDB: piso de 15% em 2a+, FGC até R$250k, sem liquidez até o vencimento. Casamento natural com objetivos datados de médio prazo; comparar sempre com o kit isento (LCI/LCA) no líquido.

### LCD (Letra de Crédito do Desenvolvimento) (`lcd`)
- **Papel:** RF isenta (desenvolvimento) · **Mandato:** Crédito / desenvolvimento · **Horizonte:** 3–10 anos · **Liquidez:** Carência/vencimento
- **Tributação:** Isento PF — 0% (evento: No vencimento) · **Base legal:** Lei 14.937/2024 — isenção PF
- **Risco M/C/L/X:** 0/1/2/0 · **Piso suitability:** Conservador · **Status:** review
- **Marcas do motor:** matchableL
- **Nota de planejamento (v0.3):** Emitida por bancos de desenvolvimento (BNDES e congêneres), isenta de IR para PF como LCI/LCA, com limite global anual de emissão. Prateleira ainda rasa; confirmar disponibilidade no catálogo.

### Carteira administrada (`carteira-adm`)
- **Papel:** Gestão sob medida sem come-cotas · **Mandato:** Por composição − mandatos · **Horizonte:** 3–40 anos · **Liquidez:** Por ativo · mandato contratado
- **Tributação:** Ativo a ativo — Cada ativo segue sua regra · sem come-cotas de wrapper (evento: Por ativo (venda/cupom)) · **Base legal:** Tributação por ativo · doc 03
- **Risco:** não se aplica (produto de Investimento) · **Piso suitability:** Conservador · **Status:** base
- **Marcas do motor:** wrapper
- **Nota de planejamento (v0.3):** O wrapper estratégico do Principal/Private (UC04): ativos no nome do cliente, tributação ativo a ativo, SEM come-cotas de estrutura — vantagem estrutural sobre fundo exclusivo pós-Lei 14.754. Taxa de gestão sobre AuA não é dedutível na PF. O risco é o da composição contratada, limitada pelo perfil.
- **Nota da v1.0:** [D-07] mandato do perfil

### ETF internacional na B3 (IVVB11) (`etf-intl`)
- **Papel:** Dolarização simples via B3 · **Mandato:** Internacional · **Horizonte:** 5–15 anos · **Liquidez:** B3 · a qualquer hora
- **Tributação:** ETF (fonte) — 15% · sem isenção 20k (evento: Na venda) · **Base legal:** Regime de ETF de ações (B3)
- **Risco M/C/L/X:** 3/0/0/3 · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento (v0.3):** IVVB11 e afins: 15% no ganho, sem isenção de R$20k/mês, sem come-cotas — com exposição cambial embutida. Dolarização simples sem conta offshore nem regime da Lei 14.754.
- **Nota da v1.0:** [B-05] piso Agressivo→Moderado (índice diversificado)

### Capitalização (`capitalizacao`)
- **Papel:** Disciplina comportamental (fraco) · **Mandato:** — · **Horizonte:** 1–5 anos · **Liquidez:** Resgate com penalidade/prazo
- **Tributação:** RF regressivo — A CONFIRMAR · sorteios 30% na fonte (evento: No resgate/sorteio) · **Base legal:** Mecânica de IR do resgate a confirmar
- **Risco M/C/L/X:** 0/1/2/0 · **Piso suitability:** Conservador · **Status:** review
- **Marcas do motor:** weak
- **Nota de planejamento (v0.3):** Popular e financeiramente fraco (doc 02): rendimento real ~nulo (TR), sorteios tributados a 30% exclusivo na fonte. Papel honesto: disciplina comportamental — sinalizar upgrade para consórcio/Tesouro programado. Mecânica exata do IR no resgate: A CONFIRMAR.

### Financiamento imobiliário (SFH/SFI) (`financ-imob`)
- **Papel:** Aquisição alavancada de moradia · **Mandato:** — · **Horizonte:** 5–35 anos · **Liquidez:** Amortizável (SAC/Price) · FGTS a cada 2a
- **Tributação:** Sem IR — Sem IR · juros NÃO dedutíveis (evento: —) · **Base legal:** Doc 03 · SFH/SFI
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** O maior passivo da PF. Juros NÃO são dedutíveis no IRPF (diferente dos EUA — doc 03); FGTS pode amortizar/quitar a cada 2 anos (a ponte FGTS→imóvel). Decisão viva do goal-based: amortizar vs. investir = taxa do contrato vs. retorno LÍQUIDO de IR esperado, com prestamista embutido no CET.

### Imóvel para renda (aluguel) (`imovel-renda`)
- **Papel:** Renda imobiliária direta · **Mandato:** Imobiliário / renda · **Horizonte:** 5–40 anos · **Liquidez:** Meses para vender · vacância
- **Tributação:** IRPF progressivo — Aluguel: até 27,5% · Venda: GCAP 15→22,5% (evento: Mensal (carnê-leão) + venda) · **Base legal:** Carnê-leão · GCAP progressivo · redutores Lei 11.196/7.713
- **Risco M/C/L/X:** 2/0/3/0 · **Piso suitability:** Moderado · **Status:** base
- **Marcas do motor:** income
- **Nota de planejamento (v0.3):** Classe do engine ausente até a v0.2. Aluguel = carnê-leão progressivo até 27,5% (a renda recorrente mais tributada da matriz); venda = GCAP 15→22,5% com redutores por antiguidade. Estratégia PJ imobiliária (Lucro Presumido ~11–14% sobre a receita) pode reduzir o atrito — avaliar caso a caso. Iliquidez alta + vacância. Comparar sempre com FII no líquido.

### Imóvel residencial próprio (`imovel-proprio`)
- **Papel:** Moradia (uso) · **Mandato:** — · **Horizonte:** 5–40 anos · **Liquidez:** Meses para vender
- **Tributação:** Ganho cap. progr. — GCAP 15→22,5% · isenções 180d / único ≤R$440k (evento: Na venda) · **Base legal:** Lei 11.196 art. 39 · Lei 9.250 art. 23
- **Risco M/C/L/X:** 1/0/3/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** Duas isenções clássicas de GCAP: (a) venda de residencial + compra de outro em 180 dias (1×/5 anos); (b) imóvel único ≤R$440k (1×/5 anos). Regras sistêmicas do objetivo trocar de casa. Não gera renda; gera custo (condomínio/IPTU) — modelar como uso, não investimento.

### Cripto (ativos virtuais) (`cripto`)
- **Papel:** Satélite especulativo · **Mandato:** Cripto / satélite · **Horizonte:** 3–10 anos · **Liquidez:** 24/7 · alta volatilidade
- **Tributação:** Ganho cap. progr. — 15→22,5% · isenção R$35k/mês (BR) (evento: Na alienação (mensal)) · **Base legal:** GCAP + IN RFB 1888 · Lei 14.754 (exterior)
- **Risco M/C/L/X:** 3/0/1/2 · **Piso suitability:** Agressivo · **Status:** review
- **Nota de planejamento (v0.3):** Classe detida pelo cliente (não vendida): exchange nacional = GCAP progressivo 15→22,5% com isenção de R$35k/mês em alienações (regra mantida com a caducidade da MP 1.303); exterior/self-custody = regime da Lei 14.754 — mecânica A CONFIRMAR por caso. Goal-based trata como satélite de risco, nunca core.

### INSS (previdência social) (`inss`)
- **Papel:** Piso vitalício de aposentadoria · **Mandato:** — · **Horizonte:** 10–40 anos · **Liquidez:** Benefício mensal vitalício
- **Tributação:** IRPF progressivo — Benefício: IRPF progressivo (isenção extra 65+) (evento: No benefício (mensal)) · **Base legal:** Teto em assumptions.ts · IRPF
- **Risco:** não se aplica (produto de Modelado) · **Piso suitability:** Conservador · **Status:** base
- **Marcas do motor:** income
- **Nota de planejamento (v0.3):** Não vendido, mas é o piso vitalício do objetivo aposentadoria (teto do benefício em assumptions.ts, com fonte e data). Contribuição dedutível na completa; benefício tributado como renda ordinária (isenção extra a partir de 65 anos). Regra sistêmica: gap = despesa desejada − INSS projetado é o que a carteira precisa financiar (Thiago: previdência privada como substituto).

### Veículo (bem de uso) (`veiculo`)
- **Papel:** Bem de uso depreciante · **Mandato:** — · **Horizonte:** 0–10 anos · **Liquidez:** Dias/semanas (usado)
- **Tributação:** Sem IR — Sem IR · IPVA à parte (evento: —) · **Base legal:** Engine params (−12% real a.a.)
- **Risco:** não se aplica (produto de Modelado) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** Bem de uso que deprecia ~−12% real a.a. (engine) — modelar a perda, não o ativo. Sem IR (IPVA é imposto de propriedade, à parte). Regra sistêmica: objetivo trocar de carro financia-se com consórcio/poupança programada; CDC sobre bem depreciante é a pior combinação da matriz.

### Caixa em moeda forte (conta global) (`usd-cash`)
- **Linha nova da v1.0** · **Horizonte:** 0–10 anos · **Tributação:** Offshore 15%/a (alíquota-piso 15%)
- **Risco M/C/L/X:** 0/0/1/3 · **Piso suitability:** Moderado · **Status:** review
- **Marcas do motor:** review
- **Nota da v1.0:** [B-01] regime Lei 14.754 A CONFIRMAR (depósito não remunerado pode ser isento)

### RF em moeda forte (Treasuries/bonds) (`usd-bonds`)
- **Linha nova da v1.0** · **Horizonte:** 1–10 anos · **Tributação:** Offshore 15%/a (alíquota-piso 15%)
- **Risco M/C/L/X:** 1/0/1/3 · **Piso suitability:** Moderado · **Status:** review
- **Marcas do motor:** dm, income, review
- **Nota da v1.0:** [B-01] escada casável na moeda do passivo

### Renda vitalícia contratada (anuidade) (`renda-vitalicia`)
- **Linha nova da v1.0** · **Horizonte:** 0–40 anos · **Tributação:** Previdência regr. (alíquota-piso 10%)
- **Risco:** não se aplica (produto de Proteção) · **Piso suitability:** Conservador · **Status:** review
- **Marcas do motor:** income, review
- **Nota da v1.0:** [B-03] tributação da fase de renda A CONFIRMAR


## Legado (11 produtos)

| Produto | Tipo | Classe | Duração | Regime | Alíquota LP | Risco | Segmentos | Status |
|---|---|---|---|---|---|---|---|---|
| Seguro de vida (termo) | Proteção | Proteção / seguro | Vitalício | Isento PF | 0% | Conservador | Retail, Prime, Principal, Private | base |
| Previdência como sucessão | Estrutura | Previdência | Vitalício | ITCMD sucessão | 0% | Conservador | Prime, Principal, Private | review |
| Holding patrimonial (familiar) | Estrutura | Estrutura societária | Vitalício | ITCMD sucessão | 8% | Moderado | Principal, Private | review |
| Doação com reserva de usufruto | Estrutura | Estrutura sucessória | Vitalício | ITCMD sucessão | 8% | Moderado | Principal, Private | review |
| Trust (sucessão internacional) | Estrutura | Estrutura sucessória | Vitalício | ITCMD sucessão | 8% | Moderado | Private | review |
| Fundo exclusivo / fechado | Investimento | Fundos (fechado) | Vitalício | Come-cotas | 15% | Moderado | Private | base |
| Seguro de vida resgatável (vida inteira/dotal) | Proteção | Proteção / seguro | Vitalício | Isento PF | 0% | Conservador | Principal, Private | review |
| Seguro prestamista | Proteção | Proteção / seguro | Médio | Sem IR | 0% | Conservador | Retail, Prime, Principal, Private | base |
| Offshore PJ (controlada no exterior) | Estrutura | Estrutura internacional | Vitalício | Offshore 15%/a | 15% | Moderado | Private | review |
| Doação em dinheiro/bens (simples) | Estrutura | Estrutura sucessória | Vitalício | ITCMD sucessão | 8% | Conservador | Principal, Private | review |
| Participação societária (empresa própria) | Modelado | Participação societária | Vitalício | Dividendos + IRPFM | 10% | Agressivo | Principal, Private | review |

### Seguro de vida (termo) (`seguro`)
- **Papel:** Liquidez de espólio · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Pagamento no evento coberto
- **Tributação:** Isento PF — Isento · fora do ITCMD (evento: Na morte (evento)) · **Base legal:** Código Civil (não é herança)
- **Risco:** não se aplica (produto de Proteção) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** A ferramenta de liquidez sucessória mais pura: paga rápido, contorna o inventário, isento aos beneficiários. Dimensionar para pagar o ITCMD do espólio.
- **Nota da v1.0:** [A-01] +Retail

### Previdência como sucessão (`prev-suc`)
- **Papel:** Bypass de inventário · **Mandato:** Por mandato − taxa · **Horizonte:** 0–40 anos · **Liquidez:** Beneficiários · acesso rápido
- **Tributação:** ITCMD sucessão — Fora do inventário · sem ITCMD (evento: Na morte (beneficiários)) · **Base legal:** STF Tema 1.214 (RE 1.363.013) — definitivo
- **Risco:** não se aplica (produto de Estrutura) · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento (v0.3):** Tese do STF é definitiva (mérito 12/2024, modulação recusada): passa fora do inventário aos beneficiários designados, sem ITCMD. Ressalvas reais — resistência administrativa de alguns fiscos estaduais; exceção do próprio STF para simulação/abuso (aporte desproporcional, perto da morte, que preterie herdeiro ou prejudique meação/credores). Confirmar com Tributário se há dispositivo da LC 227/2026 que reforce a tese para PGBL/VGBL.

### Holding patrimonial (familiar) (`holding`)
- **Papel:** Governança + sucessão · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Estrutural (quotas)
- **Tributação:** ITCMD sucessão — ITCMD na sucessão societária (evento: Na transferência de quotas) · **Base legal:** Direito societário · ITCMD estadual · STF Tema 796
- **Risco:** não se aplica (produto de Estrutura) · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento (v0.3):** Sucessão corre no quadro societário (não em inventário lento). Válida com substância e documentação; estruturas de fachada são o que evitar. Integralizar imóveis: imunidade de ITBI limitada ao valor do capital (STF Tema 796) — o excedente paga.
- **Nota da v1.0:** [A-12] +Principal · [D-02] piso não se aplica a estr

### Doação com reserva de usufruto (`usufruto`)
- **Papel:** Antecipa e trava a base · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Estrutural
- **Tributação:** ITCMD sucessão — ITCMD na doação (trava a base) (evento: Na doação) · **Base legal:** EC 132/2023 · LC 227/2026 · isenção estadual
- **Risco:** não se aplica (produto de Estrutura) · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento (v0.3):** Trava as regras e a base de hoje e move a valorização para fora de um inventário futuro; doador mantém renda/controle. Cronologia: a LC 227/2026 tornou a progressividade obrigatória, mas não é autoaplicável — cada estado precisa de lei própria e, por anterioridade, ela só vale a partir de 2027 (SP segue a 4% fixo em 2026). A janela está fechando, não fechada.

### Trust (sucessão internacional) (`trust`)
- **Papel:** Sucessão internacional com substância · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Estrutural
- **Tributação:** ITCMD sucessão — ITCMD no repasse ou na morte do settlor (o 1º) (evento: Repasse ao beneficiário / morte do settlor) · **Base legal:** Lei 14.754/2023; LC 227/2026
- **Risco:** não se aplica (produto de Estrutura) · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento (v0.3):** A LC 227/2026 fixou o ITCMD no repasse ao beneficiário ou na morte do instituidor, o que ocorrer primeiro — encerrando a cobrança na constituição de trusts revogáveis. A Lei 14.754 trata bens em trust como do instituidor em vida (transparência): sem substância, não há blindagem.

### Fundo exclusivo / fechado (`fundo-exclusivo`)
- **Papel:** Governança + sucessão familiar · **Mandato:** Por composição · **Horizonte:** 5–40 anos · **Liquidez:** Fechado · amortizações/eventos
- **Tributação:** Come-cotas — 22,5%→15% + come-cotas (salvo FIA/FIP/FIDC/FIAgro) (evento: Semestral + resgate) · **Base legal:** Lei 14.754/2023
- **Risco:** não se aplica (produto de Investimento) · **Piso suitability:** Moderado · **Status:** base
- **Marcas do motor:** drag, wrapper
- **Nota de planejamento (v0.3):** Pós-Lei 14.754 sofre come-cotas (salvo FIA/FIP/FIDC/FIAgro qualificados) — perdeu o diferimento que o justificava. Segue relevante por governança e sucessão (doação de cotas com usufruto), com custo de estrutura que só fecha em patrimônios grandes. Comparar sempre com carteira administrada.
- **Nota da v1.0:** [D-04/D-07]

### Seguro de vida resgatável (vida inteira/dotal) (`vida-resgatavel`)
- **Papel:** Proteção + acumulação sucessória · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Resgate após carência · morte paga rápido
- **Tributação:** Isento PF — Morte: isenta/fora ITCMD · Resgate: IR a confirmar (evento: Na morte / no resgate) · **Base legal:** Código Civil · mecânica de resgate por SKU (SUSEP)
- **Risco:** não se aplica (produto de Proteção) · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento (v0.3):** Na morte: isento e fora do inventário/ITCMD como o vida a termo. O resgate EM VIDA é tributado sobre o rendimento — mecânica varia por produto SUSEP, A CONFIRMAR por SKU. Combina proteção + acumulação sucessória para Private.

### Seguro prestamista (`prestamista`)
- **Papel:** Protege a família da dívida · **Mandato:** — · **Horizonte:** 0–20 anos · **Liquidez:** Contingente (evento)
- **Tributação:** Sem IR — Indenização quita a dívida · sem IR (evento: No evento (quita dívida)) · **Base legal:** Natureza securitária
- **Risco:** não se aplica (produto de Proteção) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento (v0.3):** Quita o saldo devedor no óbito/invalidez — o beneficiário é o credor; indenização sem IR. Protege a família de herdar dívida (embutido no CET do crédito). Regra sistêmica: todo financiamento relevante carrega prestamista ou vida equivalente.
- **Nota da v1.0:** [A-13] +Private

### Offshore PJ (controlada no exterior) (`offshore-pj`)
- **Papel:** Veículo internacional c/ substância · **Mandato:** Internacional · **Horizonte:** 0–40 anos · **Liquidez:** Estrutural
- **Tributação:** Offshore 15%/a — 15%/a sobre lucros (31/dez) · opção transparência (evento: Anual (31/dez)) · **Base legal:** Lei 14.754/2023
- **Risco:** não se aplica (produto de Estrutura) · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento (v0.3):** Lucros tributados anualmente a 15% em 31/dez, repatriados ou não, com opção de transparência fiscal (declarar os ativos como se PF). Custos de manutenção + substância obrigatória. Sucessão internacional exige planejamento próprio (will/probate local). Para Private com diversificação genuína.

### Doação em dinheiro/bens (simples) (`doacao`)
- **Papel:** Antecipação de herança · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Ato único
- **Tributação:** ITCMD sucessão — ITCMD estadual · isenção anual por estado (evento: Na doação) · **Base legal:** ITCMD estadual · LC 227/2026
- **Risco:** não se aplica (produto de Estrutura) · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento (v0.3):** A ferramenta de transferência mais simples: ITCMD estadual com isenções anuais por estado (SP ~R$96k/ano, A CONFIRMAR). Atenção à futura regra de consolidação de doações seriadas (LC 227 — prazo estadual a definir). Antecipa herança em vida com controle do timing.

### Participação societária (empresa própria) (`participacao`)
- **Papel:** O negócio do cliente · **Mandato:** Empresa própria · **Horizonte:** 0–40 anos · **Liquidez:** Ilíquida (evento societário)
- **Tributação:** Dividendos + IRPFM — Dividendos 10% >R$50k/mês · IRPFM · GCAP quotas (evento: Distribuição + venda + sucessão) · **Base legal:** Lei 15.270/2025 · LC 227/2026 (valor de mercado)
- **Risco M/C/L/X:** 3/2/3/0 · **Piso suitability:** Agressivo · **Status:** review
- **Nota de planejamento (v0.3):** O maior ativo do cliente PJ (Patrícia, Antônio): dividendos isentos até R$50k/mês/empresa (10% de retenção acima), IRPFM no agregado, ganho na venda de quotas progressivo 15→22,5%. Sucessão: ITCMD sobre VALOR DE MERCADO das quotas (LC 227 — encerra a avaliação contábil), via holding/doação com usufruto. Concentração é o risco dominante.


## Estratégias candidatas (Camada 3, 27)

- `reserva-first`: Reserva antes de qualquer objetivo de risco — 1º degrau da escada (doc 04).
- `dimensionar-reserva`: Meses de reserva por risco de renda: mais para renda variável e provedor único (flags VIS-806).
- `gate-rotativo`: Rotativo detectado → bloqueia alocação até plano de quitação (Marcos).
- `consolidacao-divida`: Trocar dívida cara por barata: rotativo → parcelamento de fatura / consignado / CGI / home equity.
- `amortizar-vs-investir`: Taxa do contrato vs. retorno líquido de IR — juros não são dedutíveis no BR (Roberto).
- `fgts-imovel`: FGTS amortiza/quita financiamento a cada 2 anos; lance em consórcio imobiliário.
- `isencao-180d`: Vender residencial + comprar outro em 180 dias: GCAP zero (1×/5 anos) na troca de casa.
- `escada-vencimentos`: Títulos vencendo na data de cada objetivo (José Carlos: escada IPCA+).
- `duration-match`: Título marcado casado ao vencimento → risco de mercado colapsa (M→0).
- `glidepath-derisk`: De-risking programado conforme o objetivo se aproxima (caps de M por fase).
- `bucket-decumulacao`: 3 baldes na aposentadoria: caixa (2a) · renda · crescimento (José Carlos/Helena).
- `renda-isenta-decumulacao`: Renda mensal isenta: FII + FI-Infra + incentivadas + IPCA+ cupom (Helena) — p/ Conservador via mandato diversificado [A-03].
- `asset-location`: Alocar por eficiência: tributados dentro de wrappers eficientes; isentos fora.
- `evitar-come-cotas`: Dinheiro longo fora de fundos abertos: títulos diretos, ETF, previdência, carteira adm.
- `harvest-isencoes`: Consumir as franquias anuais: R$20k/mês ações, R$35k/mês cripto, doação estadual.
- `pgbl-12-completa`: Gasto de saúde alto → declaração completa vence → dedução de 12% no PGBL.
- `vgbl-fracionado-600k`: Fracionar aportes de VGBL entre anos para não disparar o IOF de 5% (>R$600k/CPF/ano).
- `prev-substituto-inss`: PJ/autônomo: previdência privada como substituto do INSS fraco (Thiago).
- `consorcio-vs-cdc`: Bem depreciante: consórcio/poupança programada; nunca CDC sobre veículo.
- `staging-soma-subita`: Herança/venda/bônus: estacionar em DI e posicionar em etapas com política (Patrícia).
- `trio-sucessorio`: Seguro (liquidez do espólio) + previdência (bypass) + estrutura (holding/doação).
- `seguro-dimensionado-itcmd`: Capital segurado = ITCMD + custas do inventário: herdeiros não vendem ativos (Antônio).
- `usufruto-trava-2027`: Doar com usufruto antes das leis estaduais de 2027: trava base e alíquota de hoje.
- `doacao-seriada-isencao`: Doações anuais dentro da isenção estadual — atenção à regra de consolidação (LC 227).
- `holding-com-substancia`: Holding com substância e governança; ITBI limitado (Tema 796); quotas a valor de mercado (LC 227).
- `dolarizacao-em-camadas`: X por camadas: ETF B3 → BDR → offshore direto, conforme segmento e meta em moeda.
- `rota-liquidez-fisica`: Por ativo físico: vender (staging), alugar (renda) ou dar em garantia (CGI/home equity) — custo de carregamento no motor. [A-07]

## Objetivos (20)

| Objetivo | 3L | Natureza | Horizonte típico (anos) | Tipos de produto |
|---|---|---|---|---|
| Reserva de emergência (`reserva`) | Liquidez | cont | 0–2 | inv |
| Sair da dívida cara / consolidar (`divida`) | Liquidez | sane | 0–3 | cred |
| Proteção da família (se eu faltar) (`protecao-familia`) | Legado | cont | 0–40 | prot |
| Proteção de fluxo e balanço (saúde/patrimônio) (`protecao-fluxo`) | Liquidez | cont | 0–40 | prot |
| Adquirir / trocar o lar (`lar-adquirir`) | Longevidade | data | 2–10 | inv, cred |
| Quitar o lar (amortizar vs. investir) (`lar-quitar`) | Longevidade | sane | 1–10 | inv, cred |
| Educação dos filhos (`educacao`) | Longevidade | data | 3–18 | inv |
| Cuidado vitalício (perpetuidade médica) (`cuidado-vitalicio`) | Longevidade | fluxo | 10–40 | inv, prot, estr |
| Aposentadoria / independência (`aposentadoria`) | Longevidade | fluxo | 10–40 | inv |
| Viver de renda (decumulação) (`renda-decumulacao`) | Longevidade | fluxo | 0–40 | inv |
| Trocar de veículo (`veiculo-troca`) | Longevidade | data | 1–6 | inv, cred |
| Projeto pessoal (viagem, casamento, sabático) (`projeto-pessoal`) | Liquidez | data | 1–4 | inv |
| Alocar soma súbita (herança, venda, bônus) (`alocar-subita`) | Longevidade | evento | 0–3 | inv |
| Meta em moeda estrangeira (educação fora, morar fora) (`meta-fx`) | Longevidade | data | 3–20 | inv, estr |
| Capitalizar o negócio próprio (`negocio-capital`) | Longevidade | data | 1–10 | inv, cred |
| Sucessão organizada (menor vazamento) (`sucessao`) | Legado | estrut | 0–40 | estr, prot, inv |
| Sucessão do negócio (manter vs. vender) (`sucessao-negocio`) | Legado | estrut | 2–15 | estr |
| Liquidez do espólio (ITCMD e custas) (`liquidez-espolio`) | Legado | cont | 0–40 | prot, inv |
| Doar em vida / filantropia (`doacao-vida`) | Legado | estrut | 0–40 | estr |
| Desmobilizar patrimônio físico (rota de liquidez) (`desmobilizacao-fisica`) | Legado | estrut | 1–15 | inv, cred, estr |
