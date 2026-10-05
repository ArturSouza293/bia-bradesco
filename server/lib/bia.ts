// =================================================================
// Bia — system prompt (montado do cérebro em conhecimento/persona/),
// ferramentas e roteiro de abertura.
// =================================================================

import { SYSTEM_PROMPT } from '../kb/persona.generated.js';

// O prompt vive em conhecimento/persona/*.md (versionado, com fonte) e é
// montado por `npm run kb:build` — não voltar a hard-codar aqui.
export const BIA_SYSTEM_PROMPT = SYSTEM_PROMPT;

// ----------------------------------------------------------------
// Definições de ferramentas (tool use)
// ----------------------------------------------------------------
export const TOOLS = [
  {
    name: 'register_user',
    description:
      'Registra o nome do cliente no início da conversa (Fase 1), logo após o aceite. Chame UMA vez assim que souber o nome. O sistema cria ou recupera o usuário e devolve a memória de sessões anteriores — use-a para personalizar o atendimento de quem já passou pela demo.',
    input_schema: {
      type: 'object',
      properties: {
        nome: {
          type: 'string',
          description: 'Primeiro nome ou como o cliente quer ser chamado',
        },
      },
      required: ['nome'],
    },
  },
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
      'Registra um conceito de educação financeira que você explicou ao cliente. Chame logo após explicar algo. Se a explicação veio da base de conhecimento (consultar_conhecimento), termine o resumo com "(fonte: kb:ID)" usando o id do trecho consultado.',
    input_schema: {
      type: 'object',
      properties: {
        topico: {
          type: 'string',
          description: 'Nome curto do conceito (ex.: "Pirâmide do planejamento")',
        },
        resumo: {
          type: 'string',
          description:
            'Como você explicou, em 1-2 frases simples. Se usou a base de conhecimento, inclua "(fonte: kb:ID)" no fim.',
        },
      },
      required: ['topico', 'resumo'],
    },
  },
  {
    name: 'consultar_conhecimento',
    description:
      'Consulta a base de conhecimento CFP da Bia (educação financeira). Use ANTES de explicar um conceito ao cliente ou responder dúvida conceitual — devolve trechos com id de fonte. Não registra nada; traduza o trecho para o seu tom (1-2 frases) e cite o id no register_education_note.',
    input_schema: {
      type: 'object',
      properties: {
        pergunta: {
          type: 'string',
          description:
            'A dúvida ou o conceito, em linguagem natural (ex.: "por que a reserva de emergência vem antes dos outros objetivos?")',
        },
      },
      required: ['pergunta'],
    },
  },
  {
    name: 'consultar_produto',
    description:
      'USO INTERNO (lente de gerente) — consulta a matriz de produtos do banco (matriz vigente v1.0: 71 produtos × tributação × risco, e as estratégias de planejamento). Consulte SÓ DEPOIS que o número do plano da pessoa existe na conversa — plano antes do produto. Use APENAS para fundamentar o racional de register_cross_sell ou enriquecer register_out_of_scope_note. NUNCA cite ao cliente produtos, alíquotas ou regimes tributários: a Etapa 2 não faz recomendação de produto/tributação, e os dados são ilustrativos (pendentes de ratificação pelo Tributário).',
    input_schema: {
      type: 'object',
      properties: {
        busca: {
          type: 'string',
          description: 'Nome/tema do produto (ex.: "previdência", "consórcio", "seguro de vida")',
        },
        objetivo_3l: {
          type: 'string',
          enum: ['Liquidez', 'Longevidade', 'Legado'],
          description: 'Filtro por objetivo 3L (opcional)',
        },
        regime: {
          type: 'string',
          description: 'Filtro por regime tributário (opcional, ex.: "isento", "previdência")',
        },
        segmento: {
          type: 'string',
          enum: ['Retail', 'Prime', 'Principal', 'Private'],
          description: 'Filtro por segmento (opcional)',
        },
      },
      required: [],
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
    text: `Sou a planejadora financeira de IA do Bradesco — sigo o método dos planejadores **CFP®**, e um planejador humano responde por ele — e vou te ajudar a **organizar seus objetivos de vida** numa conversa rápida (uns 10–15 minutinhos). 🎯

Funciona assim: primeiro eu te conheço rapidinho (idade, família, renda...), depois a gente descobre seus objetivos juntos, com educação financeira pelo caminho. No final, monto um resumo pra você levar pra próxima etapa.

**Podemos começar?**`,
  },
];
