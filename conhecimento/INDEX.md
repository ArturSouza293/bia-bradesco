# Catálogo do cérebro da Bia

| Arquivo | Área | O que é | Data |
|---|---|---|---|
| [AGENTS.md](AGENTS.md) | raiz | Constituição do cérebro: Regra Zero, front-matter, `fase_bia`, chunking, fluxo de manutenção | 2026-08-06 |
| [fontes.md](fontes.md) | raiz | Registro de fontes citável `[F1.n]` | 2026-08-06 |
| [curriculo-cfp/README.md](curriculo-cfp/README.md) | currículo | Estado e organização do currículo CFP: 8 módulos, pesos, o que existe e o que falta | 2026-08-06 |
| [curriculo-cfp/00-processo-6-etapas.md](curriculo-cfp/00-processo-6-etapas.md) | currículo | O processo de planejamento financeiro em 6 etapas (fase_bia: cliente) | 2026-08-06 |
| [curriculo-cfp/conceitos-fundamentais.md](curriculo-cfp/conceitos-fundamentais.md) | currículo | 8 conceitos educáveis ao cliente na Etapa 2: SMART, necessidade/desejo, pirâmide, reserva, horizonte, valor presente, priorização, risco do objetivo | 2026-08-06 |
| [curriculo-cfp/0N-*/ementa.md](curriculo-cfp/) | currículo | Ementas oficiais dos 8 módulos (1.501 itens, Planejar mai/2026) — mapa para as notas de estudo | 2026-08-06 |
| [curriculo-cfp/01-planejamento-principios/](curriculo-cfp/01-planejamento-principios/) | currículo | Notas de estudo M1 (10 tópicos): profissão/processo, ética, habilidades, ambiente regulatório/econômico, compliance, valor do dinheiro no tempo, cliente, perfil de risco, comunicação, seleção de fornecedores | 2026-08-06 |
| [curriculo-cfp/02-gestao-financeira/](curriculo-cfp/02-gestao-financeira/) | currículo | Notas de estudo M2 (9 tópicos + nota interna de produtos de crédito): princípios, objetivos, balanço pessoal, fluxo de caixa, orçamento, poupança, fundo de emergência, dívidas, coeficientes | 2026-08-06 |
| [curriculo-cfp/03-investimentos-gestao-ativos/](curriculo-cfp/03-investimentos-gestao-ativos/) | currículo | Notas de estudo M3 (6 tópicos etapa3 + síntese educável): princípios, suitability, classes de ativos/renda fixa, gestão de portfólio, desempenho e risco, alocação | 2026-08-06 |
| [curriculo-cfp/04-aposentadoria/](curriculo-cfp/04-aposentadoria/) | currículo | Notas de estudo M4 (5 tópicos): princípios, objetivos, projeções de necessidades, fontes de renda, retiradas | 2026-08-06 |
| [curriculo-cfp/05-seguros-gestao-risco/](curriculo-cfp/05-seguros-gestao-risco/) | currículo | Notas de estudo M5 (6 tópicos): princípios de risco, objetivos, exposição, estratégias, soluções, lei de seguros/sinistro | 2026-08-06 |
| [curriculo-cfp/06-planejamento-tributario/](curriculo-cfp/06-planejamento-tributario/) | currículo | Notas de estudo M6 (5 tópicos, todos interna): princípios de tributação, PF/PJ, planejamento, análise/cálculos, estratégias | 2026-08-06 |
| [curriculo-cfp/07-patrimonial-sucessorio/](curriculo-cfp/07-patrimonial-sucessorio/) | currículo | Notas de estudo M7 (7 tópicos): princípios, objetivos, aspectos legais, família, ativos/passivos, filantropia, estratégias | 2026-08-06 |
| [curriculo-cfp/08-psicologia/](curriculo-cfp/08-psicologia/) | currículo | Notas de estudo M8 (7 tópicos): finanças comportamentais, vieses, cognição/educação, tipos de cliente, crenças, abordagens, eventos críticos | 2026-08-06 |
| [eval/golden.json](eval/golden.json) | eval | Golden set do retrieval (~70 perguntas de cliente → chunk esperado); rodado por `npm run eval:kb` | 2026-08-06 |
| [curriculo-cfp/fonte-ementa.json](curriculo-cfp/fonte-ementa.json) | currículo | Extração estruturada da ementa (JSON usado para gerar os ementa.md) | 2026-08-06 |
| [matriz-produtos/matriz.json](matriz-produtos/matriz.json) | matriz | **GERADO** — os 71 produtos tipados da matriz v1.0, as estratégias e os objetivos (fonte da verdade do runtime) | 2026-10-05 |
| [matriz-produtos/matriz.md](matriz-produtos/matriz.md) | matriz | **GERADO** — leitura humana da matriz, por objetivo 3L, com notas de planejamento, o que a v1.0 corrigiu, estratégias e objetivos | 2026-10-05 |
| [matriz-produtos/fundamentos-legais.md](matriz-produtos/fundamentos-legais.md) | matriz | Âncoras legais da matriz + pendências que a própria fonte declara | 2026-08-06 |
| [matriz-produtos/fonte/vision_tax_duration_matrix.jsx](matriz-produtos/fonte/vision_tax_duration_matrix.jsx) | matriz | FONTE do texto descritivo dos 66 de base (cópia com proveniência, v0.3 jul/2026, acervo Vision) [F1.1] | 2026-08-06 |
| [matriz-produtos/fonte/vision_goal_matrix_v1.jsx](matriz-produtos/fonte/vision_goal_matrix_v1.jsx) | matriz | FONTE da lente desde 05/10/2026 (cópia com proveniência, v1.0 jul/2026, a matriz vigente do Vision): conjunto, campos do motor, estratégias e objetivos [F1.5] | 2026-10-05 |
| [persona/bia-core.md](persona/bia-core.md) | persona | O system prompt da Bia (identidade, jornada, metodologia, conduta) — bloco 1 | 2026-08-06 |
| [persona/guardrails-conhecimento.md](persona/guardrails-conhecimento.md) | persona | Guardrails de uso do RAG (consultar_conhecimento / consultar_produto) — bloco 2 | 2026-08-06 |
| [inbox/README.md](inbox/README.md) | inbox | Como usar o inbox (material bruto → curadoria) | 2026-08-06 |
