---
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

> **GERADO** por `scripts/kb/extract-matriz.mjs` a partir de `fonte/vision_tax_duration_matrix.jsx`
> (v0.3, jul/2026, acervo Vision). Não edite à mão — edite a fonte e regenere.
> **Dados ilustrativos; ratificar com Tributário. Uso interno (lente de gerente) — nunca citado ao cliente na Etapa 2.**


## Liquidez (17 produtos)

| Produto | Tipo | Classe | Duração | Regime | Alíquota LP | Risco | Segmentos |
|---|---|---|---|---|---|---|---|
| Tesouro Selic | Investimento | Liquidez / caixa | Curtíssimo | RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private |
| CDB liquidez diária | Investimento | Renda fixa bancária | Curtíssimo | RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private |
| Fundo DI / Referenciado DI | Investimento | Fundos (aberto) | Curtíssimo | Come-cotas | 15% | Conservador | Retail, Prime, Principal, Private |
| Poupança | Investimento | Liquidez / caixa | Curtíssimo | Isento PF | 0% | Conservador | Retail, Prime |
| LCI / LCA (pós-fixada) | Investimento | Renda fixa bancária | Curto | Isento PF | 0% | Conservador | Prime, Principal, Private |
| CGI (crédito c/ garantia de investimentos) | Crédito | Liquidez / crédito | Médio | Sem IR | 0% | Moderado | Principal, Private |
| FGTS | Modelado | FGTS | Longo | Isento PF | 0% | Conservador | Retail, Prime |
| ETF de renda fixa | Investimento | Fundos (aberto) | Médio | ETF-RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private |
| Fundo Cambial | Investimento | Fundos (aberto) | Curto | Come-cotas | 20% | Moderado | Principal, Private |
| Home Equity (crédito c/ garantia de imóvel) | Crédito | Liquidez / crédito | Longo | Sem IR | 0% | Moderado | Principal, Private |
| Crédito Consignado | Crédito | Liquidez / crédito | Médio | Sem IR | 0% | Conservador | Retail, Prime |
| Plano de saúde | Proteção | Proteção / saúde | Vitalício | Dedução IRPF | 0% | Conservador | Retail, Prime, Principal, Private |
| Seguros patrimoniais (residencial/auto) | Proteção | Proteção / seguro | Vitalício | Sem IR | 0% | Conservador | Retail, Prime, Principal, Private |
| CDC / crédito pessoal (incl. veículo) | Crédito | Passivo / crédito | Curto | Sem IR | 0% | Conservador | Retail, Prime |
| Cartão rotativo / cheque especial | Crédito | Passivo / crédito | Curtíssimo | Sem IR | 0% | Conservador | Retail, Prime |
| Antecipação de 13º / restituição / recebíveis | Crédito | Passivo / crédito | Curtíssimo | Sem IR | 0% | Conservador | Retail, Prime |
| Capital de giro / conta garantida (PJ) | Crédito | Passivo / crédito PJ | Curto | Sem IR | 0% | Moderado | Prime, Principal, Private |

### Tesouro Selic (`selic`)
- **Papel:** Reserva de emergência · **Mandato:** Caixa / Selic · **Horizonte:** 0–1 anos · **Liquidez:** D+1 · sem marcação
- **Tributação:** RF regressivo — 22,5%→15% (evento: No resgate; IOF) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 0/0/0/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Único título sem marcação a mercado; capital sempre preservado — o veículo de reserva mais limpo.

### CDB liquidez diária (`cdb-liq`)
- **Papel:** Reserva / caixa · **Mandato:** Caixa / Selic · **Horizonte:** 0–1 anos · **Liquidez:** D+0 · FGC R$250k
- **Tributação:** RF regressivo — 22,5%→15% (evento: No resgate; IOF) · **Base legal:** Tabela regressiva RF · FGC
- **Risco M/C/L/X:** 0/1/0/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Core de reserva, familiar; sem come-cotas. Versões a prazo penalizam saída antecipada.

### Fundo DI / Referenciado DI (`fundo-di`)
- **Papel:** Caixa conveniente · **Mandato:** Caixa / Selic · **Horizonte:** 0–1 anos · **Liquidez:** D+0 / D+1
- **Tributação:** Come-cotas — 22,5%→15% + come-cotas (evento: Semestral (mai/nov) + resgate; IOF) · **Base legal:** Come-cotas + regressiva
- **Risco M/C/L/X:** 0/1/0/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Come-cotas quebra a composição silenciosamente; atenção à taxa de administração.

### Poupança (`poupanca`)
- **Papel:** Default por inércia · **Mandato:** Caixa / Selic · **Horizonte:** 0–1 anos · **Liquidez:** Saque livre · rende no aniversário
- **Tributação:** Isento PF — 0% (evento: —) · **Base legal:** Isenção legal
- **Risco M/C/L/X:** 0/0/0/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** TR + 0,5%/mês — perde para inflação. O hábito mais corrigível; o que o Vision substitui.

### LCI / LCA (pós-fixada) (`lci-lca`)
- **Papel:** Renda fixa tax-free · **Mandato:** Inflação / crédito · **Horizonte:** 1–3 anos · **Liquidez:** Carência, depois líquida/venc.
- **Tributação:** Isento PF — 0% (evento: No resgate/venc.) · **Base legal:** Isenção PF · FGC
- **Risco M/C/L/X:** 0/1/2/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Isenta de IR; sticky por design. Risco de crédito no emissor (FGC até R$250k). Vencedor silencioso da RF. Carência mínima vigente a confirmar (mudou 2022–24).

### CGI (crédito c/ garantia de investimentos) (`cgi`)
- **Papel:** Liquidez sem realizar ganho · **Mandato:** — · **Horizonte:** 0–5 anos · **Liquidez:** Sob demanda · carteira penhorada
- **Tributação:** Sem IR — Sem IR (não vende) (evento: — (sem evento tributável)) · **Base legal:** Crédito garantido
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento:** Levanta liquidez contra a carteira sem vender e disparar IR — a carteira continua compondo. Atenção à chamada de margem se a carteira cair. Ferramenta consciente de tributação.

### FGTS (`fgts`)
- **Papel:** Saldo vinculado · **Mandato:** — · **Horizonte:** 1–20 anos · **Liquidez:** Vinculado (saque em hipóteses legais)
- **Tributação:** Isento PF — 0% (evento: —) · **Base legal:** Remuneração legal TR+3%
- **Risco M/C/L/X:** 0/0/3/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** TR + 3% — negativo em termos reais. Modelar como arrasto; usar/sacar quando a hipótese legal permite. Ponte principal: amortizar/quitar financiamento imobiliário a cada 2 anos.

### ETF de renda fixa (`etf-rf`)
- **Papel:** Cesta de RF num ticker, sem come-cotas · **Mandato:** Caixa ou Inflação, conforme índice · **Horizonte:** 1–7 anos · **Liquidez:** B3 · a qualquer hora
- **Tributação:** ETF-RF regressivo — 25%→15% (prazo médio da carteira) (evento: Na venda/resgate) · **Base legal:** Regressiva por PMRC — Portaria MF 163/2016
- **Risco M/C/L/X:** 1/1/0/0 · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento:** Alíquota corre pelo prazo médio de repactuação da carteira (PMRC), não pelo tempo que o investidor segurou a cota — pode nascer perto do piso de 15%. Sem come-cotas e sem IOF mesmo <30 dias.

### Fundo Cambial (`fundo-cambial`)
- **Papel:** Hedge cambial / dólar onshore · **Mandato:** Câmbio / dólar · **Horizonte:** 0–2 anos · **Liquidez:** D+1 a D+30
- **Tributação:** Come-cotas — 22,5%→20% (curto prazo típico) (evento: Semestral + resgate; IOF) · **Base legal:** Regra geral de fundos curto prazo
- **Risco M/C/L/X:** 2/0/1/3 · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento:** A maioria é curto prazo (carteira média <365 dias) — teto de come-cotas de 20%, não 15%; confirmar a classificação do fundo específico antes de assumir o piso de 15% usado em outras linhas.

### Home Equity (crédito c/ garantia de imóvel) (`home-equity`)
- **Papel:** Liquidez de menor custo sem vender · **Mandato:** — · **Horizonte:** 5–20 anos · **Liquidez:** Sob demanda · imóvel em garantia
- **Tributação:** Sem IR — Sem IR (é dívida) (evento: — (sem fato gerador p/ o mutuário)) · **Base legal:** Natureza de dívida
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento:** Paralelo ao CGI, com imóvel como colateral em vez da carteira; custo (juros) menor pelo colateral. iof=false porque a coluna mede o IOF<30d de resgate; o IOF/crédito próprio (~0,38% + diário até teto) incide na contratação, fora do escopo. Juros não dedutíveis no IRPF.

### Crédito Consignado (`consignado`)
- **Papel:** Crédito mais barato com margem consignável · **Mandato:** — · **Horizonte:** 1–6 anos · **Liquidez:** Desconto em folha/benefício
- **Tributação:** Sem IR — Sem IR (é dívida) (evento: — (sem fato gerador)) · **Base legal:** Natureza de dívida
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento:** Mesma lógica de CGI/home equity: sem IR ao tomador; IOF/crédito próprio na contratação, fora do escopo IOF<30d. Mais relevante em Retail/Prime — contraponto direto ao financiar-vs-investir. Também instrumento de CONSOLIDAÇÃO de dívida rotativa cara.

### Plano de saúde (`saude`)
- **Papel:** Proteção de fluxo + dedução · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Uso contínuo (mensalidade)
- **Tributação:** Dedução IRPF — Despesa dedutível SEM TETO (completa) (evento: Anual (dedução na DIRPF)) · **Base legal:** Dedução integral de despesas médicas (declaração completa)
- **Risco:** não se aplica (produto de Proteção) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Não é investimento — é proteção + a alavanca de dedução mais subestimada: despesas médicas (incluindo o plano) são dedutíveis SEM TETO na completa. Regra sistêmica: gasto de saúde alto → completa quase sempre vence → habilita a dedução de 12% do PGBL. Reajustes acima do IPCA: modelar inflação médica própria (Fernanda).

### Seguros patrimoniais (residencial/auto) (`seg-patrimonial`)
- **Papel:** Protege o balanço · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Contingente (sinistro)
- **Tributação:** Sem IR — Indenização = recomposição · sem IR (evento: No sinistro) · **Base legal:** Indenização não é renda
- **Risco:** não se aplica (produto de Proteção) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Indenização é recomposição patrimonial, não renda tributável. Sem dimensão de investimento — protege o balanço de choques que, sem seguro, drenariam a reserva ou forçariam venda de ativos (o elo com Liquidez).

### CDC / crédito pessoal (incl. veículo) (`cdc`)
- **Papel:** Consumo a prazo (evitar) · **Mandato:** — · **Horizonte:** 0–4 anos · **Liquidez:** Parcelas fixas
- **Tributação:** Sem IR — Sem IR (é dívida) (evento: —) · **Base legal:** Natureza de dívida
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** CET alto, sem qualquer benefício fiscal. Regra sistêmica: quitar antes de qualquer alocação (exceto reserva mínima) — nenhum retorno líquido realista bate o custo. Financiar bem depreciante (veículo, −12% real) é a pior combinação da matriz.

### Cartão rotativo / cheque especial (`rotativo`)
- **Papel:** Emergência cara (eliminar) · **Mandato:** — · **Horizonte:** 0–1 anos · **Liquidez:** Revolvente (evitar)
- **Tributação:** Sem IR — Sem IR (é dívida) (evento: —) · **Base legal:** Natureza de dívida
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** CET de três dígitos — destruidor de patrimônio. Regra sistêmica dura: dívida rotativa detectada → plano de quitação/consolidação (consignado, CGI) ANTES de qualquer conversa de investimento (Marcos).

### Antecipação de 13º / restituição / recebíveis (`antecipacao`)
- **Papel:** Suavização pontual · **Mandato:** — · **Horizonte:** 0–1 anos · **Liquidez:** Quita no recebível
- **Tributação:** Sem IR — Sem IR (é dívida) (evento: —) · **Base legal:** Natureza de dívida
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Liquidez pontual com spread do banco. Uso excepcional de suavização — arriscado como hábito; se recorrente, o problema é orçamento, não crédito.

### Capital de giro / conta garantida (PJ) (`capital-giro`)
- **Papel:** Fôlego da empresa (PJ) · **Mandato:** — · **Horizonte:** 0–3 anos · **Liquidez:** Rotativo PJ
- **Tributação:** Sem IR — Sem IR ao tomador · juros dedutíveis na PJ (evento: —) · **Base legal:** Natureza de dívida (PJ)
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento:** Mantém a empresa respirando sem contaminar a PF. Regra de fronteira: pró-labore disciplinado + não misturar caixa PJ e patrimônio pessoal (Thiago, Patrícia). Juros dedutíveis NA PJ (lucro real), nunca na PF.


## Longevidade (38 produtos)

| Produto | Tipo | Classe | Duração | Regime | Alíquota LP | Risco | Segmentos |
|---|---|---|---|---|---|---|---|
| Tesouro IPCA+ | Investimento | Títulos em custódia | Longo | RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private |
| Tesouro IPCA+ Juros Semestrais | Investimento | Títulos em custódia | Longo | RF regressivo | 15% | Conservador | Prime, Principal, Private |
| Tesouro Renda+ (NTN-B1) | Investimento | Títulos em custódia | Vitalício | RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private |
| Tesouro Educa+ | Investimento | Títulos em custódia | Longo | RF regressivo | 15% | Conservador | Prime, Principal, Private |
| CRI / CRA | Investimento | Renda fixa bancária | Longo | Isento PF | 0% | Moderado | Principal, Private |
| Debêntures incentivadas | Investimento | Renda fixa bancária | Longo | Isento PF | 0% | Moderado | Principal, Private |
| Debêntures regulares | Investimento | Renda fixa bancária | Médio | RF regressivo | 15% | Moderado | Principal, Private |
| Fundo RF Crédito Privado | Investimento | Fundos (aberto) | Médio | Come-cotas | 15% | Moderado | Prime, Principal, Private |
| Fundo Inflação (IMA-B) | Investimento | Fundos (aberto) | Longo | Come-cotas | 15% | Moderado | Prime, Principal, Private |
| PGBL | Investimento | Previdência | Vitalício | Previdência regr. | 10% | Conservador | Prime, Principal, Private |
| VGBL | Investimento | Previdência | Vitalício | Previdência regr. | 10% | Conservador | Prime, Principal, Private |
| Ações BR (buy & hold) | Investimento | Títulos em custódia | Longo | Ganho cap. RV | 15% | Agressivo | Prime, Principal, Private |
| ETF de ações (BOVA11) | Investimento | Títulos em custódia | Longo | ETF (fonte) | 15% | Agressivo | Prime, Principal, Private |
| Fundo de ações | Investimento | Fundos (aberto) | Longo | Ganho cap. RV | 15% | Agressivo | Prime, Principal, Private |
| FII (Fundo Imobiliário) | Investimento | Títulos em custódia | Longo | Isento PF | 0% | Moderado | Prime, Principal, Private |
| Fundo Multimercado | Investimento | Fundos (aberto) | Médio | Come-cotas | 15% | Moderado | Principal, Private |
| Internacional / Offshore | Investimento | Internacional | Longo | Offshore 15%/a | 15% | Moderado | Principal, Private |
| BDRs | Investimento | Títulos em custódia | Longo | Ganho cap. RV | 15% | Moderado | Principal, Private |
| FIDC | Investimento | Fundos (aberto) | Médio | Ganho cap. RV | 15% | Agressivo | Principal, Private |
| Alternativos (PE / FIP) | Investimento | Títulos em custódia | Vitalício | Ganho cap. RV | 15% | Agressivo | Private |
| Consórcio | Crédito | Aquisição programada | Médio | Sem IR | 0% | Conservador | Retail, Prime, Principal, Private |
| Tesouro Prefixado (LTN/NTN-F) | Investimento | Títulos em custódia | Médio | RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private |
| LIG (Letra Imobiliária Garantida) | Investimento | Renda fixa bancária | Longo | Isento PF | 0% | Conservador | Principal, Private |
| COE (Operações Estruturadas) | Investimento | Renda fixa bancária | Médio | RF regressivo | 15% | Moderado | Principal, Private |
| FIAgro | Investimento | Títulos em custódia | Longo | Isento PF | 0% | Moderado | Principal, Private |
| FI-Infra / FIP-IE | Investimento | Títulos em custódia | Longo | Isento PF | 0% | Moderado | Principal, Private |
| Ações no exterior (custódia direta) | Investimento | Internacional | Longo | Offshore 15%/a | 15% | Agressivo | Private |
| CDB a prazo (2a+) | Investimento | Renda fixa bancária | Médio | RF regressivo | 15% | Conservador | Retail, Prime, Principal, Private |
| LCD (Letra de Crédito do Desenvolvimento) | Investimento | Renda fixa bancária | Longo | Isento PF | 0% | Conservador | Prime, Principal, Private |
| Carteira administrada | Investimento | Títulos em custódia (gestão) | Longo | Ativo a ativo | 15% | Conservador | Principal, Private |
| ETF internacional na B3 (IVVB11) | Investimento | Títulos em custódia | Longo | ETF (fonte) | 15% | Agressivo | Prime, Principal, Private |
| Capitalização | Investimento | Capitalização | Médio | RF regressivo | 20% | Conservador | Retail, Prime |
| Financiamento imobiliário (SFH/SFI) | Crédito | Passivo / financiamento | Longo | Sem IR | 0% | Conservador | Retail, Prime, Principal, Private |
| Imóvel para renda (aluguel) | Modelado | Imóveis | Vitalício | IRPF progressivo | 27.5% | Moderado | Prime, Principal, Private |
| Imóvel residencial próprio | Modelado | Imóveis | Vitalício | Ganho cap. progr. | 15% | Conservador | Retail, Prime, Principal, Private |
| Cripto (ativos virtuais) | Modelado | Ativos virtuais | Longo | Ganho cap. progr. | 15% | Agressivo | Prime, Principal, Private |
| INSS (previdência social) | Modelado | Previdência social | Vitalício | IRPF progressivo | 27.5% | Conservador | Retail, Prime, Principal, Private |
| Veículo (bem de uso) | Modelado | Veículos | Médio | Sem IR | 0% | Conservador | Retail, Prime, Principal, Private |

### Tesouro IPCA+ (`ipca`)
- **Papel:** Proteção poder de compra · **Mandato:** Inflação (IPCA+) · **Horizonte:** 5–15 anos · **Liquidez:** D+1 · marcação a mercado
- **Tributação:** RF regressivo — 15% (2a+) (evento: No resgate; IOF) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 2/0/0/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Principal protegido da inflação se levado ao vencimento; oscila (MtM) se vendido antes — o risco de mercado colapsa quando duration ≤ horizonte do objetivo.

### Tesouro IPCA+ Juros Semestrais (`ipca-cupom`)
- **Papel:** Renda protegida da inflação · **Mandato:** Inflação (IPCA+) · **Horizonte:** 5–15 anos · **Liquidez:** Cupom semestral · MtM
- **Tributação:** RF regressivo — 15% (2a+) (evento: Semestral (cupom) + resgate; IOF) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 2/0/0/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Core da decumulação (Helena): renda protegida da inflação na aposentadoria.

### Tesouro Renda+ (NTN-B1) (`rendamais`)
- **Papel:** Renda de aposentadoria · **Mandato:** Inflação (IPCA+) · **Horizonte:** 10–40 anos · **Liquidez:** Carência 60d · 240 pgtos mensais
- **Tributação:** RF regressivo — 15% (2a+) (evento: Fase de pagamento) · **Base legal:** Regressiva RF · isenção custódia até 4 SM
- **Risco M/C/L/X:** 2/0/1/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Cadência de pagamento (não lump); desenhado com R. Merton. Disciplina comportamental brasileira.

### Tesouro Educa+ (`educamais`)
- **Papel:** Objetivo educação · **Mandato:** Inflação (IPCA+) · **Horizonte:** 5–18 anos · **Liquidez:** Carência 60d · 60 pgtos mensais
- **Tributação:** RF regressivo — 15% (2a+) (evento: Fase de pagamento) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 2/0/1/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Financiamento programado de faculdade — encaixe natural para famílias com filhos (Fernanda).

### CRI / CRA (`cri-cra`)
- **Papel:** RF isenta longa · **Mandato:** Crédito privado · **Horizonte:** 4–10 anos · **Liquidez:** Venc. (secundário fino)
- **Tributação:** Isento PF — 0% (evento: No vencimento) · **Base legal:** Isenção PF (imob./agro)
- **Risco M/C/L/X:** 1/2/3/0 · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento:** Uma LCI/LCA mais longa, tax-free; risco de crédito no emissor e iliquidez. Tickets maiores.

### Debêntures incentivadas (`deb-inc`)
- **Papel:** Crédito corporativo isento · **Mandato:** Crédito privado · **Horizonte:** 4–10 anos · **Liquidez:** Venc. (secundário)
- **Tributação:** Isento PF — 0% (evento: No vencimento) · **Base legal:** Lei 12.431/2011 (infraestrutura)
- **Risco M/C/L/X:** 1/2/2/0 · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento:** Renda fixa corporativa com bônus tributário em infra. Isenta de IR para PF. Não confundir com a debênture de infraestrutura da Lei 14.801/2024 — nela o benefício é do EMISSOR e a PF é tributada normalmente.

### Debêntures regulares (`deb-reg`)
- **Papel:** Crédito privado · **Mandato:** Crédito privado · **Horizonte:** 3–7 anos · **Liquidez:** Venc. (secundário)
- **Tributação:** RF regressivo — 22,5%→15% (evento: No resgate/venc.) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 1/2/2/0 · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento:** Pagam IR (vs. incentivadas isentas). Yield sobre o DI com risco de crédito.

### Fundo RF Crédito Privado (`fundo-cp`)
- **Papel:** Yield pickup sobre DI · **Mandato:** Crédito privado · **Horizonte:** 1–3 anos · **Liquidez:** D+30 (alguns D+90)
- **Tributação:** Come-cotas — 22,5%→15% + come-cotas (evento: Semestral + resgate; IOF) · **Base legal:** Come-cotas + regressiva
- **Risco M/C/L/X:** 1/2/2/0 · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento:** Yield sobre o DI via crédito; come-cotas arrasta. Atenção ao risco de crédito do pool.

### Fundo Inflação (IMA-B) (`fundo-imab`)
- **Papel:** Sleeve longa anti-inflação · **Mandato:** Inflação (IPCA+) · **Horizonte:** 3–10 anos · **Liquidez:** D+1 a D+30
- **Tributação:** Come-cotas — 22,5%→15% + come-cotas (evento: Semestral + resgate; IOF) · **Base legal:** Come-cotas + regressiva
- **Risco M/C/L/X:** 2/1/1/0 · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento:** Substitui Tesouro IPCA+ com diversificação; come-cotas reduz a eficiência vs. o título direto.

### PGBL (`pgbl`)
- **Papel:** Dedução 12% + regressiva · **Mandato:** Por mandato − taxa · **Horizonte:** 10–40 anos · **Liquidez:** Resgate / renda
- **Tributação:** Previdência regr. — 35%→10% (10a+) (evento: Na saída / renda) · **Base legal:** Regressiva previdência · dedução 12% · Lei 14.803/2024
- **Risco M/C/L/X:** 1/1/2/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Três benefícios: dedução (12% da renda, só declarante completa) + regressiva + sucessão fora do inventário. Lei 14.803/2024: a opção pelo regime (regressivo/progressivo) passou a ser feita no momento do resgate/benefício — decisão flexibilizada. Risco: conforme o FIE contratado.

### VGBL (`vgbl`)
- **Papel:** Regressiva + sucessão · **Mandato:** Por mandato − taxa · **Horizonte:** 10–40 anos · **Liquidez:** Resgate / renda
- **Tributação:** Previdência regr. — 35%→10% (só ganho) (evento: Na saída / renda) · **Base legal:** Regressiva previdência (só ganho) · Lei 14.803/2024
- **Risco M/C/L/X:** 1/1/2/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Sem dedução; tributa só o ganho. Ideal para declarante pela simplificada e alocação sucessória. IOF de entrada: 5% sobre aportes anuais acima de R$600k/CPF (Decreto 12.499/2025) — PGBL não é afetado; fracionar entre anos evita. Lei 14.803/2024: opção de regime no resgate. Risco: conforme o FIE.

### Ações BR (buy & hold) (`acoes`)
- **Papel:** Crescimento · **Mandato:** Ações BR · **Horizonte:** 5–15 anos · **Liquidez:** B3 · D+2
- **Tributação:** Ganho cap. RV — 15% + isenção R$20k/mês (evento: Na venda) · **Base legal:** Ganho de capital RV · isenção spot
- **Risco M/C/L/X:** 3/0/0/0 · **Piso suitability:** Agressivo · **Status:** base
- **Nota de planejamento:** Isenção de R$20k/mês em vendas spot (que ETF não tem); dividendos isentos até o teto de 2026.

### ETF de ações (BOVA11) (`etf-acoes`)
- **Papel:** Mercado inteiro num ticker · **Mandato:** Ações BR · **Horizonte:** 5–15 anos · **Liquidez:** B3 · a qualquer hora
- **Tributação:** ETF (fonte) — 15% · sem isenção 20k (evento: Na venda) · **Base legal:** Ganho de capital · dividendos tributados
- **Risco M/C/L/X:** 3/0/0/0 · **Piso suitability:** Agressivo · **Status:** base
- **Nota de planejamento:** Simples e barato para ter o índice; tributação menos amigável que ações diretas (sem isenção de R$20k).

### Fundo de ações (`fundo-acoes`)
- **Papel:** Gestão delegada · **Mandato:** Ações BR · **Horizonte:** 5–15 anos · **Liquidez:** D+30
- **Tributação:** Ganho cap. RV — 15% · sem come-cotas (evento: No resgate) · **Base legal:** 15% s/ ganho · sem come-cotas
- **Risco M/C/L/X:** 3/0/2/0 · **Piso suitability:** Agressivo · **Status:** base
- **Nota de planejamento:** Fundos de ação não sofrem come-cotas; razoavelmente eficiente para dinheiro longo em ações.

### FII (Fundo Imobiliário) (`fii`)
- **Papel:** Renda isenta mensal · **Mandato:** Imobiliário / renda · **Horizonte:** 5–15 anos · **Liquidez:** B3 · líquida
- **Tributação:** Isento PF — Distrib. isenta · 20% no ganho (evento: Distrib. mensal + venda) · **Base legal:** Distribuição isenta PF · ganho 20%
- **Risco M/C/L/X:** 2/1/1/0 · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento:** Motor de renda isenta (Helena). O ganho de capital na venda de cotas é tributado a 20%. Isenção exige 50+ cotistas, negociação em bolsa e cotista PF <10%.

### Fundo Multimercado (`multi`)
- **Papel:** Gestão ativa · **Mandato:** Multimercado · **Horizonte:** 3–7 anos · **Liquidez:** D+30 cotização + D+1
- **Tributação:** Come-cotas — 22,5%→15% + come-cotas (evento: Semestral + resgate; IOF) · **Base legal:** Come-cotas + regressiva
- **Risco M/C/L/X:** 2/1/2/0 · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento:** Sleeve de gestão ativa (juros/FX/ações); come-cotas arrasta a composição. Confirmar classificação curto vs. longo prazo do fundo — muda o piso (20% vs. 15%).

### Internacional / Offshore (`intl`)
- **Papel:** Diversificação + moeda · **Mandato:** Internacional · **Horizonte:** 5–15 anos · **Liquidez:** Varia (conta/fundo)
- **Tributação:** Offshore 15%/a — 15% flat anual (evento: Anual (31/dez) ou realização) · **Base legal:** Lei 14.754/2023
- **Risco M/C/L/X:** 2/1/2/3 · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento:** Fim do diferimento; substância importa. FX é a maior incerteza. Escala ~11% Principal → ~34% Private.

### BDRs (`bdr`)
- **Papel:** Ações globais em BRL · **Mandato:** Internacional · **Horizonte:** 5–15 anos · **Liquidez:** B3
- **Tributação:** Ganho cap. RV — 15% · dividendos tributados (evento: Na venda) · **Base legal:** Ganho de capital RV
- **Risco M/C/L/X:** 3/0/1/3 · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento:** Acesso a ações estrangeiras em BRL sem conta offshore; dividendos estrangeiros passam por tributação. Se BDR tem a isenção de R$20k/mês: a confirmar.

### FIDC (`fidc`)
- **Papel:** Aumentador de retorno · **Mandato:** Crédito privado · **Horizonte:** 2–5 anos · **Liquidez:** Fechado / semi-líquido
- **Tributação:** Ganho cap. RV — 15% (qualificado, sem come-cotas) (evento: Na realização) · **Base legal:** Lei 14.754 (exceção FIDC)
- **Risco M/C/L/X:** 1/3/3/0 · **Piso suitability:** Agressivo · **Status:** review
- **Nota de planejamento:** Spread alto, risco de crédito no pool; para perfis sofisticados. Qualificado escapa do come-cotas — confirmar classificação Entidade de Investimento do fundo específico. Subscrição sofre IOF de 0,38% (desde jul/2025).

### Alternativos (PE / FIP) (`alts`)
- **Papel:** Prêmio de iliquidez · **Mandato:** Alternativos · **Horizonte:** 7–15 anos · **Liquidez:** Fechado / ilíquido
- **Tributação:** Ganho cap. RV — 15% (FIP qualificado) (evento: Na realização / desinv.) · **Base legal:** Lei 14.754 (exceção FIP)
- **Risco M/C/L/X:** 3/2/3/0 · **Piso suitability:** Agressivo · **Status:** review
- **Nota de planejamento:** Prêmio de iliquidez (~+10% real, ilustrativo); só Private. FIP qualificado escapa do come-cotas.

### Consórcio (`consorcio`)
- **Papel:** Aquisição programada · **Mandato:** — · **Horizonte:** 2–7 anos · **Liquidez:** Travado até contemplação
- **Tributação:** Sem IR — Sem IR (evento: —) · **Base legal:** —
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Poupança forçada + aquisição adiada; sem juros mas com taxa de administração. Acesso só por sorteio ou lance (FGTS pode dar lance em imobiliário). Stickiness de dupla face: ótimo quando força bom comportamento, ruim quando trava no produto errado.

### Tesouro Prefixado (LTN/NTN-F) (`prefixado`)
- **Papel:** Trava taxa nominal hoje · **Mandato:** Taxa fixa · **Horizonte:** 2–10 anos · **Liquidez:** D+1 · marcação a mercado
- **Tributação:** RF regressivo — 22,5%→15% (evento: No resgate; IOF) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 3/0/0/0 · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento:** Útil quando a visão é de queda de juro nominal — sofre marcação a mercado CHEIA se vendido antes do vencimento (M3), mais que o IPCA+. Casado com o vencimento, o risco de mercado colapsa. Não protege da inflação.

### LIG (Letra Imobiliária Garantida) (`lig`)
- **Papel:** RF isenta com garantia dupla · **Mandato:** Inflação / crédito · **Horizonte:** 3–10 anos · **Liquidez:** Carência, depois líquida/venc.
- **Tributação:** Isento PF — 0% (evento: No resgate/venc.) · **Base legal:** Lei 14.421/2022 — isenção PF
- **Risco M/C/L/X:** 0/1/2/0 · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento:** Como LCI/LCA, mas com patrimônio de afetação + garantia direta do emissor (dupla proteção); tickets e prazos maiores, encaixa em Principal/Private.

### COE (Operações Estruturadas) (`coe`)
- **Papel:** Visão tática, capital protegido (opcional) · **Mandato:** Tático / estruturado · **Horizonte:** 1–5 anos · **Liquidez:** Só no vencimento (regra geral)
- **Tributação:** RF regressivo — 22,5%→15% (evento: No vencimento; IOF) · **Base legal:** Tabela regressiva RF
- **Risco M/C/L/X:** 2/2/3/0 · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento:** Um único evento tributário no vencimento; o risco real está na estrutura (capital protegido vs. não) e no emissor, não no IR — exige nota de risco própria por série, não genérica.

### FIAgro (`fiagro`)
- **Papel:** Renda isenta ligada ao agro · **Mandato:** Agro / crédito · **Horizonte:** 4–10 anos · **Liquidez:** B3 · líquida
- **Tributação:** Isento PF — Distrib. isenta (c/ requisitos) · 20% ganho (evento: Distrib. + venda) · **Base legal:** Lei 14.130/2021; Lei 11.033/2004 art. 3º
- **Risco M/C/L/X:** 2/2/1/0 · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento:** Isenção da distribuição só vale com 50+ cotistas, cotas negociadas em bolsa/balcão e nenhum cotista PF com >=10% — fora disso, 20% na distribuição. Ganho na venda é sempre 20% (o FI-Infra também isenta o ganho; o FIAgro não).

### FI-Infra / FIP-IE (`fi-infra`)
- **Papel:** Renda + ganho isentos — mais amplo que FII · **Mandato:** Infraestrutura / crédito · **Horizonte:** 5–15 anos · **Liquidez:** B3 · líquida (ou fechado)
- **Tributação:** Isento PF — Distrib. isenta · ganho isento (evento: Distrib. + venda) · **Base legal:** Lei 12.431/2011; Resolução CVM 175
- **Risco M/C/L/X:** 2/2/1/0 · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento:** Isenção cobre distribuição E ganho de capital na venda das cotas — mais ampla que a do FII (que tributa o ganho a 20%). Exige >=85% do PL em ativos de infraestrutura elegíveis, majoritariamente debêntures incentivadas.

### Ações no exterior (custódia direta) (`acoes-exterior`)
- **Papel:** Exposição direta sem wrapper BR · **Mandato:** Internacional · **Horizonte:** 5–15 anos · **Liquidez:** Mercado de origem
- **Tributação:** Offshore 15%/a — A CONFIRMAR — 15%/a (Lei 14.754) ou ganho de capital (evento: Anual e/ou na venda — a confirmar) · **Base legal:** Lei 14.754/2023 — mecânica a confirmar
- **Risco M/C/L/X:** 3/0/1/3 · **Piso suitability:** Agressivo · **Status:** review
- **Nota de planejamento:** ZONA CINZENTA: não confirmado se ações estrangeiras em custódia direta caem em aplicações financeiras no exterior (15%/ano) ou no regime tradicional de ganho de capital sobre bens no exterior. CONFIANÇA BAIXA — não usar com cliente sem confirmação do Tributário.

### CDB a prazo (2a+) (`cdb-prazo`)
- **Papel:** RF datada núcleo · **Mandato:** Crédito bancário (pós/pré/IPCA) · **Horizonte:** 2–5 anos · **Liquidez:** Vencimento (saída penalizada)
- **Tributação:** RF regressivo — 22,5%→15% (evento: No resgate/venc.; IOF) · **Base legal:** Tabela regressiva RF · FGC
- **Risco M/C/L/X:** 0/1/2/0 · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento:** Versão a prazo do CDB: piso de 15% em 2a+, FGC até R$250k, sem liquidez até o vencimento. Casamento natural com objetivos datados de médio prazo; comparar sempre com o kit isento (LCI/LCA) no líquido.

### LCD (Letra de Crédito do Desenvolvimento) (`lcd`)
- **Papel:** RF isenta (desenvolvimento) · **Mandato:** Crédito / desenvolvimento · **Horizonte:** 3–10 anos · **Liquidez:** Carência/vencimento
- **Tributação:** Isento PF — 0% (evento: No vencimento) · **Base legal:** Lei 14.937/2024 — isenção PF
- **Risco M/C/L/X:** 0/1/2/0 · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento:** Emitida por bancos de desenvolvimento (BNDES e congêneres), isenta de IR para PF como LCI/LCA, com limite global anual de emissão. Prateleira ainda rasa; confirmar disponibilidade no catálogo.

### Carteira administrada (`carteira-adm`)
- **Papel:** Gestão sob medida sem come-cotas · **Mandato:** Por composição − mandatos · **Horizonte:** 3–40 anos · **Liquidez:** Por ativo · mandato contratado
- **Tributação:** Ativo a ativo — Cada ativo segue sua regra · sem come-cotas de wrapper (evento: Por ativo (venda/cupom)) · **Base legal:** Tributação por ativo · doc 03
- **Risco:** não se aplica (produto de Investimento) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** O wrapper estratégico do Principal/Private (UC04): ativos no nome do cliente, tributação ativo a ativo, SEM come-cotas de estrutura — vantagem estrutural sobre fundo exclusivo pós-Lei 14.754. Taxa de gestão sobre AuA não é dedutível na PF. O risco é o da composição contratada, limitada pelo perfil.

### ETF internacional na B3 (IVVB11) (`etf-intl`)
- **Papel:** Dolarização simples via B3 · **Mandato:** Internacional · **Horizonte:** 5–15 anos · **Liquidez:** B3 · a qualquer hora
- **Tributação:** ETF (fonte) — 15% · sem isenção 20k (evento: Na venda) · **Base legal:** Regime de ETF de ações (B3)
- **Risco M/C/L/X:** 3/0/0/3 · **Piso suitability:** Agressivo · **Status:** base
- **Nota de planejamento:** IVVB11 e afins: 15% no ganho, sem isenção de R$20k/mês, sem come-cotas — com exposição cambial embutida. Dolarização simples sem conta offshore nem regime da Lei 14.754.

### Capitalização (`capitalizacao`)
- **Papel:** Disciplina comportamental (fraco) · **Mandato:** — · **Horizonte:** 1–5 anos · **Liquidez:** Resgate com penalidade/prazo
- **Tributação:** RF regressivo — A CONFIRMAR · sorteios 30% na fonte (evento: No resgate/sorteio) · **Base legal:** Mecânica de IR do resgate a confirmar
- **Risco M/C/L/X:** 0/1/2/0 · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento:** Popular e financeiramente fraco (doc 02): rendimento real ~nulo (TR), sorteios tributados a 30% exclusivo na fonte. Papel honesto: disciplina comportamental — sinalizar upgrade para consórcio/Tesouro programado. Mecânica exata do IR no resgate: A CONFIRMAR.

### Financiamento imobiliário (SFH/SFI) (`financ-imob`)
- **Papel:** Aquisição alavancada de moradia · **Mandato:** — · **Horizonte:** 5–35 anos · **Liquidez:** Amortizável (SAC/Price) · FGTS a cada 2a
- **Tributação:** Sem IR — Sem IR · juros NÃO dedutíveis (evento: —) · **Base legal:** Doc 03 · SFH/SFI
- **Risco:** não se aplica (produto de Crédito) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** O maior passivo da PF. Juros NÃO são dedutíveis no IRPF (diferente dos EUA — doc 03); FGTS pode amortizar/quitar a cada 2 anos (a ponte FGTS→imóvel). Decisão viva do goal-based: amortizar vs. investir = taxa do contrato vs. retorno LÍQUIDO de IR esperado, com prestamista embutido no CET.

### Imóvel para renda (aluguel) (`imovel-renda`)
- **Papel:** Renda imobiliária direta · **Mandato:** Imobiliário / renda · **Horizonte:** 5–40 anos · **Liquidez:** Meses para vender · vacância
- **Tributação:** IRPF progressivo — Aluguel: até 27,5% · Venda: GCAP 15→22,5% (evento: Mensal (carnê-leão) + venda) · **Base legal:** Carnê-leão · GCAP progressivo · redutores Lei 11.196/7.713
- **Risco M/C/L/X:** 2/0/3/0 · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento:** Classe do engine ausente até a v0.2. Aluguel = carnê-leão progressivo até 27,5% (a renda recorrente mais tributada da matriz); venda = GCAP 15→22,5% com redutores por antiguidade. Estratégia PJ imobiliária (Lucro Presumido ~11–14% sobre a receita) pode reduzir o atrito — avaliar caso a caso. Iliquidez alta + vacância. Comparar sempre com FII no líquido.

### Imóvel residencial próprio (`imovel-proprio`)
- **Papel:** Moradia (uso) · **Mandato:** — · **Horizonte:** 5–40 anos · **Liquidez:** Meses para vender
- **Tributação:** Ganho cap. progr. — GCAP 15→22,5% · isenções 180d / único ≤R$440k (evento: Na venda) · **Base legal:** Lei 11.196 art. 39 · Lei 9.250 art. 23
- **Risco M/C/L/X:** 1/0/3/0 · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Duas isenções clássicas de GCAP: (a) venda de residencial + compra de outro em 180 dias (1×/5 anos); (b) imóvel único ≤R$440k (1×/5 anos). Regras sistêmicas do objetivo trocar de casa. Não gera renda; gera custo (condomínio/IPTU) — modelar como uso, não investimento.

### Cripto (ativos virtuais) (`cripto`)
- **Papel:** Satélite especulativo · **Mandato:** Cripto / satélite · **Horizonte:** 3–10 anos · **Liquidez:** 24/7 · alta volatilidade
- **Tributação:** Ganho cap. progr. — 15→22,5% · isenção R$35k/mês (BR) (evento: Na alienação (mensal)) · **Base legal:** GCAP + IN RFB 1888 · Lei 14.754 (exterior)
- **Risco M/C/L/X:** 3/0/1/2 · **Piso suitability:** Agressivo · **Status:** review
- **Nota de planejamento:** Classe detida pelo cliente (não vendida): exchange nacional = GCAP progressivo 15→22,5% com isenção de R$35k/mês em alienações (regra mantida com a caducidade da MP 1.303); exterior/self-custody = regime da Lei 14.754 — mecânica A CONFIRMAR por caso. Goal-based trata como satélite de risco, nunca core.

### INSS (previdência social) (`inss`)
- **Papel:** Piso vitalício de aposentadoria · **Mandato:** — · **Horizonte:** 10–40 anos · **Liquidez:** Benefício mensal vitalício
- **Tributação:** IRPF progressivo — Benefício: IRPF progressivo (isenção extra 65+) (evento: No benefício (mensal)) · **Base legal:** Teto em assumptions.ts · IRPF
- **Risco:** não se aplica (produto de Modelado) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Não vendido, mas é o piso vitalício do objetivo aposentadoria (teto do benefício em assumptions.ts, com fonte e data). Contribuição dedutível na completa; benefício tributado como renda ordinária (isenção extra a partir de 65 anos). Regra sistêmica: gap = despesa desejada − INSS projetado é o que a carteira precisa financiar (Thiago: previdência privada como substituto).

### Veículo (bem de uso) (`veiculo`)
- **Papel:** Bem de uso depreciante · **Mandato:** — · **Horizonte:** 0–10 anos · **Liquidez:** Dias/semanas (usado)
- **Tributação:** Sem IR — Sem IR · IPVA à parte (evento: —) · **Base legal:** Engine params (−12% real a.a.)
- **Risco:** não se aplica (produto de Modelado) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Bem de uso que deprecia ~−12% real a.a. (engine) — modelar a perda, não o ativo. Sem IR (IPVA é imposto de propriedade, à parte). Regra sistêmica: objetivo trocar de carro financia-se com consórcio/poupança programada; CDC sobre bem depreciante é a pior combinação da matriz.


## Legado (11 produtos)

| Produto | Tipo | Classe | Duração | Regime | Alíquota LP | Risco | Segmentos |
|---|---|---|---|---|---|---|---|
| Seguro de vida (termo) | Proteção | Proteção / seguro | Vitalício | Isento PF | 0% | Conservador | Prime, Principal, Private |
| Previdência como sucessão | Estrutura | Previdência | Vitalício | ITCMD sucessão | 0% | Conservador | Prime, Principal, Private |
| Holding patrimonial (familiar) | Estrutura | Estrutura societária | Vitalício | ITCMD sucessão | 8% | Moderado | Private |
| Doação com reserva de usufruto | Estrutura | Estrutura sucessória | Vitalício | ITCMD sucessão | 8% | Moderado | Principal, Private |
| Trust (sucessão internacional) | Estrutura | Estrutura sucessória | Vitalício | ITCMD sucessão | 8% | Moderado | Private |
| Fundo exclusivo / fechado | Investimento | Fundos (fechado) | Vitalício | Come-cotas | 15% | Moderado | Private |
| Seguro de vida resgatável (vida inteira/dotal) | Proteção | Proteção / seguro | Vitalício | Isento PF | 0% | Conservador | Principal, Private |
| Seguro prestamista | Proteção | Proteção / seguro | Médio | Sem IR | 0% | Conservador | Retail, Prime, Principal |
| Offshore PJ (controlada no exterior) | Estrutura | Estrutura internacional | Vitalício | Offshore 15%/a | 15% | Moderado | Private |
| Doação em dinheiro/bens (simples) | Estrutura | Estrutura sucessória | Vitalício | ITCMD sucessão | 8% | Conservador | Principal, Private |
| Participação societária (empresa própria) | Modelado | Participação societária | Vitalício | Dividendos + IRPFM | 10% | Agressivo | Principal, Private |

### Seguro de vida (termo) (`seguro`)
- **Papel:** Liquidez de espólio · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Pagamento no evento coberto
- **Tributação:** Isento PF — Isento · fora do ITCMD (evento: Na morte (evento)) · **Base legal:** Código Civil (não é herança)
- **Risco:** não se aplica (produto de Proteção) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** A ferramenta de liquidez sucessória mais pura: paga rápido, contorna o inventário, isento aos beneficiários. Dimensionar para pagar o ITCMD do espólio.

### Previdência como sucessão (`prev-suc`)
- **Papel:** Bypass de inventário · **Mandato:** Por mandato − taxa · **Horizonte:** 0–40 anos · **Liquidez:** Beneficiários · acesso rápido
- **Tributação:** ITCMD sucessão — Fora do inventário · sem ITCMD (evento: Na morte (beneficiários)) · **Base legal:** STF Tema 1.214 (RE 1.363.013) — definitivo
- **Risco:** não se aplica (produto de Estrutura) · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento:** Tese do STF é definitiva (mérito 12/2024, modulação recusada): passa fora do inventário aos beneficiários designados, sem ITCMD. Ressalvas reais — resistência administrativa de alguns fiscos estaduais; exceção do próprio STF para simulação/abuso (aporte desproporcional, perto da morte, que preterie herdeiro ou prejudique meação/credores). Confirmar com Tributário se há dispositivo da LC 227/2026 que reforce a tese para PGBL/VGBL.

### Holding patrimonial (familiar) (`holding`)
- **Papel:** Governança + sucessão · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Estrutural (quotas)
- **Tributação:** ITCMD sucessão — ITCMD na sucessão societária (evento: Na transferência de quotas) · **Base legal:** Direito societário · ITCMD estadual · STF Tema 796
- **Risco:** não se aplica (produto de Estrutura) · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento:** Sucessão corre no quadro societário (não em inventário lento). Válida com substância e documentação; estruturas de fachada são o que evitar. Integralizar imóveis: imunidade de ITBI limitada ao valor do capital (STF Tema 796) — o excedente paga.

### Doação com reserva de usufruto (`usufruto`)
- **Papel:** Antecipa e trava a base · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Estrutural
- **Tributação:** ITCMD sucessão — ITCMD na doação (trava a base) (evento: Na doação) · **Base legal:** EC 132/2023 · LC 227/2026 · isenção estadual
- **Risco:** não se aplica (produto de Estrutura) · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento:** Trava as regras e a base de hoje e move a valorização para fora de um inventário futuro; doador mantém renda/controle. Cronologia: a LC 227/2026 tornou a progressividade obrigatória, mas não é autoaplicável — cada estado precisa de lei própria e, por anterioridade, ela só vale a partir de 2027 (SP segue a 4% fixo em 2026). A janela está fechando, não fechada.

### Trust (sucessão internacional) (`trust`)
- **Papel:** Sucessão internacional com substância · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Estrutural
- **Tributação:** ITCMD sucessão — ITCMD no repasse ou na morte do settlor (o 1º) (evento: Repasse ao beneficiário / morte do settlor) · **Base legal:** Lei 14.754/2023; LC 227/2026
- **Risco:** não se aplica (produto de Estrutura) · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento:** A LC 227/2026 fixou o ITCMD no repasse ao beneficiário ou na morte do instituidor, o que ocorrer primeiro — encerrando a cobrança na constituição de trusts revogáveis. A Lei 14.754 trata bens em trust como do instituidor em vida (transparência): sem substância, não há blindagem.

### Fundo exclusivo / fechado (`fundo-exclusivo`)
- **Papel:** Governança + sucessão familiar · **Mandato:** Por composição · **Horizonte:** 5–40 anos · **Liquidez:** Fechado · amortizações/eventos
- **Tributação:** Come-cotas — 22,5%→15% + come-cotas (salvo FIA/FIP/FIDC/FIAgro) (evento: Semestral + resgate) · **Base legal:** Lei 14.754/2023
- **Risco:** não se aplica (produto de Investimento) · **Piso suitability:** Moderado · **Status:** base
- **Nota de planejamento:** Pós-Lei 14.754 sofre come-cotas (salvo FIA/FIP/FIDC/FIAgro qualificados) — perdeu o diferimento que o justificava. Segue relevante por governança e sucessão (doação de cotas com usufruto), com custo de estrutura que só fecha em patrimônios grandes. Comparar sempre com carteira administrada.

### Seguro de vida resgatável (vida inteira/dotal) (`vida-resgatavel`)
- **Papel:** Proteção + acumulação sucessória · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Resgate após carência · morte paga rápido
- **Tributação:** Isento PF — Morte: isenta/fora ITCMD · Resgate: IR a confirmar (evento: Na morte / no resgate) · **Base legal:** Código Civil · mecânica de resgate por SKU (SUSEP)
- **Risco:** não se aplica (produto de Proteção) · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento:** Na morte: isento e fora do inventário/ITCMD como o vida a termo. O resgate EM VIDA é tributado sobre o rendimento — mecânica varia por produto SUSEP, A CONFIRMAR por SKU. Combina proteção + acumulação sucessória para Private.

### Seguro prestamista (`prestamista`)
- **Papel:** Protege a família da dívida · **Mandato:** — · **Horizonte:** 0–20 anos · **Liquidez:** Contingente (evento)
- **Tributação:** Sem IR — Indenização quita a dívida · sem IR (evento: No evento (quita dívida)) · **Base legal:** Natureza securitária
- **Risco:** não se aplica (produto de Proteção) · **Piso suitability:** Conservador · **Status:** base
- **Nota de planejamento:** Quita o saldo devedor no óbito/invalidez — o beneficiário é o credor; indenização sem IR. Protege a família de herdar dívida (embutido no CET do crédito). Regra sistêmica: todo financiamento relevante carrega prestamista ou vida equivalente.

### Offshore PJ (controlada no exterior) (`offshore-pj`)
- **Papel:** Veículo internacional c/ substância · **Mandato:** Internacional · **Horizonte:** 0–40 anos · **Liquidez:** Estrutural
- **Tributação:** Offshore 15%/a — 15%/a sobre lucros (31/dez) · opção transparência (evento: Anual (31/dez)) · **Base legal:** Lei 14.754/2023
- **Risco:** não se aplica (produto de Estrutura) · **Piso suitability:** Moderado · **Status:** review
- **Nota de planejamento:** Lucros tributados anualmente a 15% em 31/dez, repatriados ou não, com opção de transparência fiscal (declarar os ativos como se PF). Custos de manutenção + substância obrigatória. Sucessão internacional exige planejamento próprio (will/probate local). Para Private com diversificação genuína.

### Doação em dinheiro/bens (simples) (`doacao`)
- **Papel:** Antecipação de herança · **Mandato:** — · **Horizonte:** 0–40 anos · **Liquidez:** Ato único
- **Tributação:** ITCMD sucessão — ITCMD estadual · isenção anual por estado (evento: Na doação) · **Base legal:** ITCMD estadual · LC 227/2026
- **Risco:** não se aplica (produto de Estrutura) · **Piso suitability:** Conservador · **Status:** review
- **Nota de planejamento:** A ferramenta de transferência mais simples: ITCMD estadual com isenções anuais por estado (SP ~R$96k/ano, A CONFIRMAR). Atenção à futura regra de consolidação de doações seriadas (LC 227 — prazo estadual a definir). Antecipa herança em vida com controle do timing.

### Participação societária (empresa própria) (`participacao`)
- **Papel:** O negócio do cliente · **Mandato:** Empresa própria · **Horizonte:** 0–40 anos · **Liquidez:** Ilíquida (evento societário)
- **Tributação:** Dividendos + IRPFM — Dividendos 10% >R$50k/mês · IRPFM · GCAP quotas (evento: Distribuição + venda + sucessão) · **Base legal:** Lei 15.270/2025 · LC 227/2026 (valor de mercado)
- **Risco M/C/L/X:** 3/2/3/0 · **Piso suitability:** Agressivo · **Status:** review
- **Nota de planejamento:** O maior ativo do cliente PJ (Patrícia, Antônio): dividendos isentos até R$50k/mês/empresa (10% de retenção acima), IRPFM no agregado, ganho na venda de quotas progressivo 15→22,5%. Sucessão: ITCMD sobre VALOR DE MERCADO das quotas (LC 227 — encerra a avaliação contábil), via holding/doação com usufruto. Concentração é o risco dominante.

