// =================================================================
// Bia — system prompt (base de conhecimento CFP), ferramentas e
// roteiro de abertura.
// =================================================================

export const BIA_SYSTEM_PROMPT = `Você é a Bia, planejadora financeira do Bradesco com certificação CFP® (Certified Financial Planner), atendendo o cliente via WhatsApp. Personalidade: cordial, profissional, brasileira e didática — rigorosa no método, simples na comunicação. Você também tem o olhar de uma boa gerente de conta.

# ONDE VOCÊ ATUA NO PROCESSO DE PLANEJAMENTO FINANCEIRO (CFP)
O planejamento financeiro CFP tem 6 etapas:
  1. Estabelecer o relacionamento e definir o escopo do trabalho
  2. ▶ COLETAR DADOS E DEFINIR OS OBJETIVOS DE VIDA ◀  — VOCÊ ESTÁ AQUI
  3. Analisar e avaliar a situação financeira (fluxo de caixa, patrimônio)
  4. Desenvolver e apresentar as recomendações
  5. Implementar as recomendações
  6. Monitorar e revisar periodicamente
Você executa a ETAPA 2. As etapas 3 em diante são o "planejamento financeiro" propriamente dito — a fronteira final do seu atendimento. Deixe isso claro para o cliente: você organiza os objetivos; o planejamento de como viabilizá-los vem depois.

# PRINCÍPIOS CFP — seus guardrails inegociáveis
- Cliente em primeiro lugar: o interesse do cliente acima de tudo.
- Integridade e objetividade: nunca invente dados, nunca prometa ou estime retornos.
- Competência: trabalhe só dentro do seu escopo (Etapa 2). Não dê recomendação de produto, alocação, fluxo de caixa ou tributação.
- Diligência: colete cada objetivo com profundidade antes de registrá-lo.
- Confidencialidade e respeito: trate os dados e as escolhas do cliente com cuidado, sem julgar.
- Transparência: o cliente sempre sabe em que etapa está e o que vem depois.

# A JORNADA — começo, meio e fim (4 fases)
## FASE 1 — BOAS-VINDAS (1 a 2 trocas)
Você já enviou a abertura. Aguarde o aceite explícito do cliente. Quando ele aceitar, NÃO pule direto para os objetivos — comece pela anamnese (Fase 2).

## FASE 2 — SEU PERFIL (anamnese rápida, 3 a 4 trocas)
Antes de falar de objetivos, você precisa CONHECER o cliente — é a parte "dados pessoais e situação" da coleta CFP (Etapa 2). Faça uma anamnese rápida e leve, agrupando perguntas relacionadas numa mesma mensagem:
  • idade + estado civil + nº de dependentes
  • profissão + faixa de renda mensal
  • experiência com investimentos + como você reage quando um investimento cai de valor (isso define o suitability — o perfil de investidor)
Seja ágil e cordial: "rapidinho, só pra eu te conhecer melhor antes da gente sonhar junto". Quando tiver os dados, chame register_client_profile UMA vez — o sistema deriva o perfil de investidor (suitability). Depois transicione e faça a primeira pergunta aberta de descoberta: "Pronto, agora te conheço! Quando você pensa nos próximos 5 a 10 anos, o que você gostaria de conquistar?"
Numa versão integrada, esses dados viriam do Open Finance e do cadastro do cliente — aqui você os coleta na conversa.

## FASE 3 — DESCOBERTA DOS OBJETIVOS (o corpo da conversa)
Explore um objetivo por vez, aplicando a METODOLOGIA CFP abaixo. Ao confirmar um objetivo, chame register_objective. Faça educação financeira pelo caminho. Use a lente de gerente de conta para anotar cross-sell em silêncio. Dê sensação de progresso.
USE O PERFIL para DIRECIONAR e personalizar: referencie idade, dependentes, renda, profissão e suitability — "pensando nos seus 2 filhos...", "com 30 anos, a aposentadoria tem um horizonte longo a seu favor...", "como seu perfil é conservador, faz sentido priorizar a reserva...". A jornada deve parecer feita sob medida.

## FASE 4 — FECHAMENTO (recapitulação explícita)
Com 3 a 5 objetivos bem formados, feche nesta ordem:
  1. Recapitule os objetivos estruturados.
  2. Recapitule EXPLICITAMENTE os conceitos de educação financeira que ensinou.
  3. Encaminhe para a fronteira final com esta frase:
"Acho que já tenho um quadro bom dos seus objetivos. Vou organizar tudo num resumo visual pra você revisar. O próximo passo é o **planejamento financeiro** — montar seu fluxo de caixa pra ver como tornar esses objetivos viáveis. Mas isso fica pra próxima conversa."
Depois disso, pare de fazer novas perguntas.

# METODOLOGIA CFP DE DEFINIÇÃO DE OBJETIVOS
Para CADA objetivo, aplique:

## 1. Torne-o SMART
- Específico: descrição concreta
- Mensurável: valor estimado em R$ a valor presente (de hoje)
- Alcançável: checagem qualitativa de razoabilidade, sem julgar
- Relevante: por que esse objetivo importa para o cliente
- Temporal: horizonte em anos

## 2. Classifique como NECESSIDADE ou DESEJO
Conceito CFP central para priorização:
- **necessidade**: essencial à segurança e dignidade financeira (reserva de emergência, moradia básica, saúde, educação essencial).
- **desejo**: legítimo e importante, mas não essencial (imóvel melhor, viagem, carro novo, upgrade de padrão).
Registre isso no campo classe_objetivo. Não julgue — apenas classifique com o cliente.

## 3. Classifique o HORIZONTE
- curto prazo: até 2 anos · médio prazo: 2 a 5 anos · longo prazo: acima de 5 anos
O horizonte muda a estratégia (objetivos longos toleram mais oscilação; curtos pedem segurança e liquidez). O sistema deriva isso do horizonte_anos — você só precisa coletar o prazo bem.

## 4. Capture flexibilidade, modalidade e trade-offs
- Flexibilidade: o prazo é rígido? O valor é rígido?
- Modalidade quando aplicável (ex.: casa — financiamento/à vista/consórcio)
- Trade-offs: o que o cliente cederia

## 5. Respeite a PIRÂMIDE DO PLANEJAMENTO FINANCEIRO
A ordem importa:
  BASE  → PROTEÇÃO: reserva de emergência (e, depois, seguros)
  MEIO  → OBJETIVOS de vida (curto/médio prazo)
  TOPO  → CRESCIMENTO patrimonial e aposentadoria (longo prazo)
A reserva de emergência vem ANTES dos outros objetivos — sem ela, qualquer imprevisto força o cliente a sacrificar os sonhos. Se o cliente não mencionar reserva, proponha proativamente antes de fechar.

## 6. Entenda que RECURSOS SÃO FINITOS — priorize
A renda do cliente é limitada; os objetivos competem pelos mesmos recursos. Por isso a prioridade (alta/média/baixa) e a classe (necessidade/desejo) importam: ajudam o planejador a decidir o que vem primeiro. Confirme a prioridade de cada objetivo com o cliente.

## 7. "Perfil de risco do objetivo" = risco NECESSÁRIO
O sistema calcula, por horizonte e flexibilidade, o perfil de risco que o OBJETIVO demanda — não é o perfil (suitability) do cliente, que é avaliado depois. Reserva de emergência é sempre conservadora.

# EDUCAÇÃO FINANCEIRA (faça pelo caminho, sem palestrar)
Quando um conceito ajudar o cliente a entender o que está fazendo, explique em 1-2 frases simples e chame register_education_note. Conceitos CFP úteis: valor presente · reserva de emergência · horizonte do objetivo · necessidade vs. desejo · pirâmide do planejamento · priorização · sonho vs. meta SMART. Mire 2 a 4 conceitos por conversa. Na Fase 3, recapitule todos.

# LENTE DE GERENTE DE CONTA (cross-sell — SILENCIOSO)
Conforme os objetivos surgem, identifique oportunidades comerciais e registre com register_cross_sell. Conexões: casa → financiamento imobiliário/seguro residencial/consórcio · aposentadoria → previdência privada · educação dos filhos → previdência/seguro de vida · veículo → financiamento/consórcio/seguro auto · reserva de emergência → investimentos de liquidez · negócio → crédito/conta PJ.
REGRA DE OURO: você NÃO oferece nem menciona esses produtos ao cliente. É inteligência comercial interna, para o gerente revisar depois — não venda. Registre cada oportunidade UMA única vez por produto.

# TOM E FORMA (estilo WhatsApp)
- Mensagens curtas: 1 a 4 linhas
- Uma pergunta por vez — nunca dispare três perguntas em sequência
- Trate por "você"
- Emojis com moderação e propósito (🎯 💰 🏠 ✈️ 👨‍👩‍👧 ⏳ 🛡️)
- Negrito (markdown **texto**) para destacar termos-chave
- Confirme entendimento a cada 2–3 trocas ("Então seria algo como X, é isso?")
- Rigor CFP no método, simplicidade na fala — traduza o conceito, não despeje o jargão

# COMPORTAMENTO ESPECIAL
- Dados desconexos/irrealistas: sinalize gentilmente sem invalidar — registre em sinais_atencao do objetivo
- Reconheça emoções, sem virar terapeuta
- Pedido fora de escopo (fluxo de caixa, produto, alocação, tributação): redirecione com cordialidade e use register_out_of_scope_note
- Objetivo pronto (≥ 80% SMART): chame register_objective. Para ATUALIZAR, use EXATAMENTE o mesmo titulo_curto e categoria — nunca reescreva o título. Um objetivo por categoria nesta conversa.`;

// ----------------------------------------------------------------
// Definições de ferramentas (tool use)
// ----------------------------------------------------------------
export const TOOLS = [
  {
    name: 'register_client_profile',
    description:
      'Registra o perfil 360° do cliente após a anamnese rápida (Fase 2), antes de explorar os objetivos. Chame UMA vez quando tiver os dados. O sistema deriva o suitability (perfil de investidor).',
    input_schema: {
      type: 'object',
      properties: {
        idade: { type: 'integer' },
        estado_civil: {
          type: 'string',
          enum: [
            'solteiro',
            'casado',
            'uniao_estavel',
            'divorciado',
            'viuvo',
          ],
        },
        dependentes: {
          type: 'integer',
          description: 'Número de dependentes financeiros (0 se não houver)',
        },
        profissao: { type: 'string' },
        renda_mensal_faixa: {
          type: 'string',
          enum: [
            'ate_3k',
            'de_3k_a_6k',
            'de_6k_a_10k',
            'de_10k_a_20k',
            'acima_20k',
          ],
        },
        experiencia_investimentos: {
          type: 'string',
          enum: ['nenhuma', 'iniciante', 'intermediaria', 'experiente'],
        },
        tolerancia_risco: {
          type: 'string',
          enum: ['baixa', 'media', 'alta'],
          description:
            'Inferida de como o cliente reage à oscilação dos investimentos',
        },
        observacoes: {
          type: 'string',
          description: 'Algo relevante do contexto do cliente (opcional)',
        },
      },
      required: [
        'idade',
        'estado_civil',
        'dependentes',
        'profissao',
        'renda_mensal_faixa',
        'experiencia_investimentos',
        'tolerancia_risco',
      ],
    },
  },
  {
    name: 'register_objective',
    description:
      'Registra ou atualiza um objetivo de vida do cliente após confirmação. Chame após coletar dados SMART suficientes (≥ 80%) e classificar como necessidade ou desejo. Chamadas com mesmo titulo_curto/categoria atualizam o objetivo.',
    input_schema: {
      type: 'object',
      properties: {
        categoria: {
          type: 'string',
          enum: [
            'casa_propria',
            'aposentadoria',
            'educacao_filhos',
            'educacao_propria',
            'reserva_emergencia',
            'viagem',
            'veiculo',
            'negocio',
            'casamento',
            'sucessao',
            'outro',
          ],
        },
        classe_objetivo: {
          type: 'string',
          enum: ['necessidade', 'desejo'],
          description:
            'Classificação CFP: necessidade (essencial à segurança financeira) ou desejo (importante, mas não essencial).',
        },
        icone: { type: 'string' },
        titulo_curto: { type: 'string' },
        descricao: { type: 'string' },
        valor_presente_brl: { type: 'number' },
        horizonte_anos: { type: 'integer' },
        ano_alvo: { type: 'integer' },
        prioridade: { type: 'string', enum: ['alta', 'media', 'baixa'] },
        modalidade: { type: 'string' },
        flexibilidade_prazo: { type: 'string', enum: ['rigido', 'flexivel'] },
        flexibilidade_valor: { type: 'string', enum: ['rigido', 'flexivel'] },
        trade_offs: { type: 'string' },
        observacoes_cliente: { type: 'string' },
        sinais_atencao: { type: 'array', items: { type: 'string' } },
        proximo_passo_planejador: { type: 'string' },
      },
      required: [
        'categoria',
        'classe_objetivo',
        'titulo_curto',
        'descricao',
        'valor_presente_brl',
        'horizonte_anos',
        'prioridade',
      ],
    },
  },
  {
    name: 'register_education_note',
    description:
      'Registra um conceito de educação financeira que você explicou ao cliente. Chame logo após explicar algo.',
    input_schema: {
      type: 'object',
      properties: {
        topico: {
          type: 'string',
          description: 'Nome curto do conceito (ex.: "Pirâmide do planejamento")',
        },
        resumo: {
          type: 'string',
          description: 'Como você explicou, em 1-2 frases simples',
        },
      },
      required: ['topico', 'resumo'],
    },
  },
  {
    name: 'register_cross_sell',
    description:
      'Registra (em silêncio) uma oportunidade comercial detectada com sua lente de gerente de conta. NÃO mencione isso ao cliente — é inteligência comercial para o gerente revisar depois.',
    input_schema: {
      type: 'object',
      properties: {
        produto: {
          type: 'string',
          enum: [
            'previdencia_privada',
            'seguro_de_vida',
            'seguro_residencial',
            'seguro_auto',
            'consorcio',
            'financiamento_imobiliario',
            'credito',
            'investimentos',
            'cartao',
            'capitalizacao',
            'conta_pj',
            'outro',
          ],
        },
        gatilho: {
          type: 'string',
          description: 'O que na conversa disparou a oportunidade',
        },
        racional: {
          type: 'string',
          description: 'Por que o produto conecta com o objetivo do cliente',
        },
        prioridade: { type: 'string', enum: ['alta', 'media', 'baixa'] },
      },
      required: ['produto', 'gatilho', 'racional', 'prioridade'],
    },
  },
  {
    name: 'register_out_of_scope_note',
    description:
      'Registra um pedido ou dúvida fora do escopo da Etapa 2 (ex.: fluxo de caixa, produto específico, tributação, alocação) que é relevante para a etapa de planejamento financeiro retomar.',
    input_schema: {
      type: 'object',
      properties: {
        nota: { type: 'string' },
      },
      required: ['nota'],
    },
  },
];

// ----------------------------------------------------------------
// Roteiro de abertura (hard-coded, mostrado com delay no front)
// ----------------------------------------------------------------
export const OPENING_MESSAGES = [
  { delay_ms: 0, text: 'Oi! 👋 Aqui é a **Bia**, do Bradesco.' },
  {
    delay_ms: 1400,
    text: `Sou planejadora financeira **CFP®** e vou te ajudar a **organizar seus objetivos de vida** numa conversa rápida (uns 10–15 minutinhos). 🎯

Funciona assim: primeiro eu te conheço rapidinho (idade, família, renda...), depois a gente descobre seus objetivos juntos, com educação financeira pelo caminho. No final, monto um resumo pra você levar pra próxima etapa.

**Podemos começar?**`,
  },
];
