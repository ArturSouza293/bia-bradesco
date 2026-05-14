// =================================================================
// /api/chat — streaming SSE + tool use (register_objective)
// =================================================================
// Body: { session_id: string, messages: [{role, content: string}] }
// Stream: SSE com eventos:
//   data: {"type":"text","delta":"..."}
//   data: {"type":"objective_registered","objective":{...}}
//   data: {"type":"out_of_scope_note","nota":"..."}
//   data: {"type":"error","message":"..."}
//   data: {"type":"done"}
// =================================================================

import {
  adminSupabase,
  calcularPerfilRisco,
  calcularSmartScore,
  CATEGORIA_ICONE,
  checkMessageLimit,
  errorResponse,
  getClientIp,
  handlePreflight,
  type NetlifyContext,
  type ObjectiveInput,
} from './lib/shared.ts';

// -----------------------------------------------------------------
// System prompt e tool definitions (duplicado intencionalmente)
// -----------------------------------------------------------------
const BIA_SYSTEM_PROMPT = `Você é a Bia, assistente virtual de planejamento financeiro do Bradesco, atendendo o cliente via WhatsApp. Sua personalidade é cordial, profissional, brasileira e didática — como uma planejadora financeira CFP experiente que se comunica de forma acessível.

# FRONTEIRAS DO ATENDIMENTO

## Entrada
Esta conversa começa porque o cliente sinalizou interesse em cadastrar objetivos de vida. Você inicia com a mensagem de boas-vindas e aguarda aceite explícito antes de avançar para a descoberta.

## Escopo
Você atua EXCLUSIVAMENTE na descoberta e estruturação de objetivos de vida. Você NÃO faz nesta conversa:
- Análise de fluxo de caixa (receitas/despesas)
- Recomendação de produtos ou alocação
- Simulação de retornos ou cálculo de aportes mensais
- Análise de seguros, previdência específica, crédito, tributação
- Suitability (perfil do investidor pessoa)

Se o cliente pedir algo fora do escopo, redirecione com cordialidade:
"Vou anotar isso para a próxima etapa. Por aqui, foco em entender seus objetivos. O planejador retoma esses pontos com você depois."
E use a ferramenta register_out_of_scope_note para anotar.

## Saída
Sua entrega final é um conjunto de 3 a 5 cards de objetivos estruturados, gerados via a ferramenta register_objective. Quando considerar que temos cards suficientes e bem formados, sinalize encerramento com:
"Acho que já tenho um quadro bom dos seus objetivos. Vou organizar tudo em um resumo visual para você revisar. Pode olhar com calma e, se quiser ajustar algo, me avisa."

Depois disso, pare de fazer novas perguntas.

# METODOLOGIA (princípios CFP)

Para cada objetivo, conduza o cliente a torná-lo SMART:
- Específico: descrição concreta
- Mensurável: valor estimado em R$ a valor presente (de hoje)
- Alcançável: checagem qualitativa de razoabilidade sem julgar
- Relevante: por que esse objetivo importa
- Temporal: horizonte em anos

Capture também:
- Flexibilidade: o prazo é rígido? O valor é rígido? (pergunte naturalmente)
- Modalidade quando aplicável (ex.: casa própria — financiamento ou à vista?)
- Trade-offs: o que o cliente aceitaria ceder

Categorias típicas a explorar:
🏠 casa própria · 🎓 educação · 👴 aposentadoria · ✈️ viagens · 🚗 veículo · 🛡️ reserva de emergência · 💼 negócio · 💍 casamento · 👨‍👩‍👧 sucessão

# TOM E FORMA (estilo WhatsApp)
- Mensagens curtas: 1 a 4 linhas
- Uma pergunta por vez — nunca dispare três perguntas em sequência
- Trate por "você"
- Emojis com moderação e propósito
- Negrito (markdown **texto**) para destacar termos-chave
- Confirme entendimento a cada 2–3 trocas ("Então seria algo como X, é isso?")
- NUNCA invente dados, prometa retornos ou indique produto

# COMPORTAMENTO ESPECIAL
- Se cliente fornecer dados desconexos ou irrealistas, sinalize gentilmente sem invalidar ("vamos anotar como ponto de atenção pra discutir com o planejador") — adicione em sinais_atencao
- Reconheça emoções quando aparecerem sem virar terapeuta
- Reserva de emergência: se o cliente não mencionar, proativamente sugira incluir antes de fechar a sessão
- Toda vez que um objetivo estiver pronto (≥ 80% SMART), chame register_objective com os dados consolidados
- Pode atualizar um objetivo já registrado chamando register_objective de novo com o mesmo titulo_curto
- Use register_out_of_scope_note para anotar pedidos fora de escopo que sejam relevantes para o planejador retomar`;

const TOOLS = [
  {
    name: 'register_objective',
    description:
      'Registra ou atualiza um objetivo de vida do cliente após confirmação. Chame após coletar dados SMART suficientes (≥ 80% de completude). Chamadas subsequentes com mesmo titulo_curto atualizam o objetivo existente.',
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
        'titulo_curto',
        'descricao',
        'valor_presente_brl',
        'horizonte_anos',
        'prioridade',
      ],
    },
  },
  {
    name: 'register_out_of_scope_note',
    description:
      'Registra uma observação que está fora do escopo desta conversa mas é relevante para o planejador retomar depois.',
    input_schema: {
      type: 'object',
      properties: {
        nota: { type: 'string' },
      },
      required: ['nota'],
    },
  },
];

// -----------------------------------------------------------------
// Constants
// -----------------------------------------------------------------
const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MAX_TOOL_LOOP_ITERATIONS = 6;

// -----------------------------------------------------------------
// Tipos auxiliares
// -----------------------------------------------------------------
interface IncomingMessage {
  role: 'user' | 'assistant';
  content: string;
}

type AnthropicContentBlock =
  | { type: 'text'; text: string }
  | { type: 'tool_use'; id: string; name: string; input: Record<string, unknown> }
  | { type: 'tool_result'; tool_use_id: string; content: string; is_error?: boolean };

type AnthropicMessage =
  | { role: 'user'; content: string | AnthropicContentBlock[] }
  | { role: 'assistant'; content: AnthropicContentBlock[] };

// -----------------------------------------------------------------
// Handler principal
// -----------------------------------------------------------------
export default async function handler(req: Request, context: NetlifyContext) {
  const pf = handlePreflight(req);
  if (pf) return pf;
  if (req.method !== 'POST') return errorResponse('Método não permitido', 405);

  let body: { session_id?: string; messages?: IncomingMessage[] };
  try {
    body = await req.json();
  } catch {
    return errorResponse('Body inválido — JSON esperado', 400);
  }

  const session_id = body.session_id;
  const messages = body.messages;
  if (!session_id || typeof session_id !== 'string') {
    return errorResponse('session_id é obrigatório', 400);
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    return errorResponse('messages não pode ser vazio', 400);
  }

  // Validação da sessão
  const sb = adminSupabase();
  const { data: session, error: sessErr } = await sb
    .from('sessions')
    .select('id, status')
    .eq('id', session_id)
    .maybeSingle();
  if (sessErr) return errorResponse('Erro ao validar sessão', 500);
  if (!session) return errorResponse('Sessão não encontrada', 404);
  if (session.status !== 'active') {
    return errorResponse('Sessão já encerrada', 409);
  }

  // Rate limit por sessão
  const lim = await checkMessageLimit(session_id);
  if (!lim.ok) {
    return errorResponse(
      `Limite de ${lim.count} mensagens por sessão atingido. Reinicie a conversa para continuar.`,
      429,
    );
  }

  // Persistir a última mensagem do usuário (a que acabou de entrar)
  const last = messages[messages.length - 1];
  if (last.role !== 'user') {
    return errorResponse('A última mensagem precisa ser do usuário', 400);
  }
  await sb.from('messages').insert({
    session_id,
    role: 'user',
    content: last.content,
  });

  // API key
  const apiKey = Deno.env.get('ANTHROPIC_API_KEY');
  if (!apiKey) return errorResponse('ANTHROPIC_API_KEY não configurada', 500);
  const model = Deno.env.get('ANTHROPIC_MODEL') ?? 'claude-opus-4-7';

  // Marca IP na sessão (idempotente — só atualiza se ainda nulo)
  const clientIp = getClientIp(req, context);
  await sb
    .from('sessions')
    .update({ client_ip: clientIp })
    .eq('id', session_id)
    .is('client_ip', null);

  // Inicia stream para o cliente
  const stream = new ReadableStream({
    async start(controller) {
      try {
        await runConversation({
          session_id,
          apiKey,
          model,
          incoming: messages,
          controller,
        });
      } catch (err) {
        const message =
          err instanceof Error ? err.message : 'Erro inesperado no servidor';
        controller.enqueue(sseEvent({ type: 'error', message }));
      } finally {
        controller.enqueue(sseEvent({ type: 'done' }));
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
      'X-Accel-Buffering': 'no',
      'Access-Control-Allow-Origin': '*',
    },
  });
}

// -----------------------------------------------------------------
// Loop de conversa com tool use
// -----------------------------------------------------------------
async function runConversation(params: {
  session_id: string;
  apiKey: string;
  model: string;
  incoming: IncomingMessage[];
  controller: ReadableStreamDefaultController<Uint8Array>;
}) {
  const { session_id, apiKey, model, incoming, controller } = params;

  // Normalização para Anthropic:
  // 1) Remove mensagens com content vazio (assistant balões pending que sobraram)
  // 2) Tira mensagens 'assistant' do começo (as openers — contexto já está no system prompt)
  //    A Anthropic API exige primeiro 'user' e alternância.
  const trimmed = incoming.filter(
    (m) => typeof m.content === 'string' && m.content.trim().length > 0,
  );
  const firstUserIdx = trimmed.findIndex((m) => m.role === 'user');
  if (firstUserIdx < 0) {
    throw new Error('Nenhuma mensagem de usuário encontrada na conversa');
  }
  // Mescla mensagens consecutivas de mesma role (defesa em profundidade contra
  // sequências user/user ou assistant/assistant que a Anthropic recusa)
  const filtered: IncomingMessage[] = [];
  for (const m of trimmed.slice(firstUserIdx)) {
    const last = filtered[filtered.length - 1];
    if (last && last.role === m.role) {
      filtered[filtered.length - 1] = {
        ...last,
        content: `${last.content}\n\n${m.content}`,
      };
    } else {
      filtered.push(m);
    }
  }

  // Converte para AnthropicMessage[]
  let conversation: AnthropicMessage[] = filtered.map((m) =>
    m.role === 'user'
      ? { role: 'user', content: m.content }
      : { role: 'assistant', content: [{ type: 'text', text: m.content }] },
  );

  let assistantTextAccum = '';

  for (let iter = 0; iter < MAX_TOOL_LOOP_ITERATIONS; iter++) {
    const { assistantBlocks, stopReason, textForThisTurn } =
      await streamFromAnthropic({
        apiKey,
        model,
        conversation,
        controller,
      });

    assistantTextAccum += textForThisTurn;

    // Acrescenta a mensagem do assistente à conversa (com blocos preservados)
    conversation = [
      ...conversation,
      { role: 'assistant', content: assistantBlocks },
    ];

    if (stopReason !== 'tool_use') break;

    // Executa as tools e monta tool_results
    const toolUses = assistantBlocks.filter(
      (b): b is Extract<AnthropicContentBlock, { type: 'tool_use' }> =>
        b.type === 'tool_use',
    );

    const toolResults: AnthropicContentBlock[] = [];
    for (const tu of toolUses) {
      const result = await executeTool({
        session_id,
        name: tu.name,
        input: tu.input,
        controller,
      });
      toolResults.push({
        type: 'tool_result',
        tool_use_id: tu.id,
        content: JSON.stringify(result),
        is_error: !result.ok,
      });
    }

    conversation = [
      ...conversation,
      { role: 'user', content: toolResults },
    ];
  }

  // Persiste o texto consolidado do assistente
  if (assistantTextAccum.trim().length > 0) {
    const sb = adminSupabase();
    await sb.from('messages').insert({
      session_id,
      role: 'assistant',
      content: assistantTextAccum,
    });
  }
}

// -----------------------------------------------------------------
// Streaming da resposta da Anthropic + parsing de SSE
// -----------------------------------------------------------------
async function streamFromAnthropic(params: {
  apiKey: string;
  model: string;
  conversation: AnthropicMessage[];
  controller: ReadableStreamDefaultController<Uint8Array>;
}): Promise<{
  assistantBlocks: AnthropicContentBlock[];
  stopReason: string;
  textForThisTurn: string;
}> {
  const { apiKey, model, conversation, controller } = params;

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: 1024,
      system: BIA_SYSTEM_PROMPT,
      tools: TOOLS,
      messages: conversation,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Anthropic API ${res.status}: ${errText.slice(0, 500)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';

  // Blocos sendo acumulados (por index)
  const blocks: Record<number, AnthropicContentBlock> = {};
  const partialJson: Record<number, string> = {};
  let stopReason = 'end_turn';
  let textForThisTurn = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    buffer += decoder.decode(value, { stream: true });

    // SSE: eventos separados por \n\n
    let sepIdx: number;
    while ((sepIdx = buffer.indexOf('\n\n')) >= 0) {
      const rawEvent = buffer.slice(0, sepIdx);
      buffer = buffer.slice(sepIdx + 2);
      const dataLine = rawEvent
        .split('\n')
        .find((l) => l.startsWith('data: '));
      if (!dataLine) continue;
      const jsonStr = dataLine.slice(6).trim();
      if (!jsonStr || jsonStr === '[DONE]') continue;

      let evt: Record<string, unknown>;
      try {
        evt = JSON.parse(jsonStr);
      } catch {
        continue;
      }

      const type = evt.type as string;

      if (type === 'content_block_start') {
        const idx = evt.index as number;
        const cb = evt.content_block as AnthropicContentBlock & {
          input?: Record<string, unknown>;
        };
        if (cb.type === 'text') {
          blocks[idx] = { type: 'text', text: '' };
        } else if (cb.type === 'tool_use') {
          blocks[idx] = {
            type: 'tool_use',
            id: cb.id,
            name: cb.name,
            input: {},
          };
          partialJson[idx] = '';
        }
      } else if (type === 'content_block_delta') {
        const idx = evt.index as number;
        const delta = evt.delta as { type: string; text?: string; partial_json?: string };
        if (delta.type === 'text_delta' && delta.text) {
          const blk = blocks[idx];
          if (blk?.type === 'text') {
            blk.text += delta.text;
          }
          textForThisTurn += delta.text;
          // Emite para o front em tempo real
          controller.enqueue(
            sseEvent({ type: 'text', delta: delta.text }),
          );
        } else if (delta.type === 'input_json_delta' && delta.partial_json) {
          partialJson[idx] = (partialJson[idx] ?? '') + delta.partial_json;
        }
      } else if (type === 'content_block_stop') {
        const idx = evt.index as number;
        const blk = blocks[idx];
        if (blk?.type === 'tool_use' && partialJson[idx]) {
          try {
            blk.input = JSON.parse(partialJson[idx]) as Record<string, unknown>;
          } catch {
            blk.input = {};
          }
        }
      } else if (type === 'message_delta') {
        const delta = evt.delta as { stop_reason?: string };
        if (delta?.stop_reason) stopReason = delta.stop_reason;
      } else if (type === 'message_stop') {
        // fim do stream desta turn
      }
    }
  }

  // Reúne blocos em ordem
  const assistantBlocks = Object.keys(blocks)
    .map((k) => Number(k))
    .sort((a, b) => a - b)
    .map((i) => blocks[i]);

  return { assistantBlocks, stopReason, textForThisTurn };
}

// -----------------------------------------------------------------
// Execução de tools
// -----------------------------------------------------------------
async function executeTool(params: {
  session_id: string;
  name: string;
  input: Record<string, unknown>;
  controller: ReadableStreamDefaultController<Uint8Array>;
}): Promise<{ ok: boolean; [k: string]: unknown }> {
  const { session_id, name, input, controller } = params;

  if (name === 'register_objective') {
    return registerObjective({ session_id, input, controller });
  }
  if (name === 'register_out_of_scope_note') {
    return registerOutOfScopeNote({ session_id, input, controller });
  }
  return { ok: false, error: `Tool desconhecida: ${name}` };
}

async function registerObjective(params: {
  session_id: string;
  input: Record<string, unknown>;
  controller: ReadableStreamDefaultController<Uint8Array>;
}) {
  const { session_id, input, controller } = params;

  // Coerce e valida
  const obj = input as unknown as ObjectiveInput;
  const required = [
    'categoria',
    'titulo_curto',
    'descricao',
    'valor_presente_brl',
    'horizonte_anos',
    'prioridade',
  ] as const;
  for (const k of required) {
    if (obj[k] === undefined || obj[k] === null || obj[k] === '') {
      return { ok: false, error: `Campo obrigatório ausente: ${k}` };
    }
  }

  // Campos derivados
  const perfil = calcularPerfilRisco({
    categoria: obj.categoria,
    horizonte_anos: obj.horizonte_anos,
    flexibilidade_prazo: obj.flexibilidade_prazo,
    flexibilidade_valor: obj.flexibilidade_valor,
  });
  const { score, detalhes } = calcularSmartScore(obj);
  const ano_alvo =
    obj.ano_alvo ?? new Date().getFullYear() + obj.horizonte_anos;
  const icone = obj.icone ?? CATEGORIA_ICONE[obj.categoria] ?? '🎯';

  const sb = adminSupabase();

  // Upsert por (session_id, titulo_curto) — atualiza se já existir
  const { data: existing } = await sb
    .from('objectives')
    .select('id')
    .eq('session_id', session_id)
    .eq('titulo_curto', obj.titulo_curto)
    .maybeSingle();

  const row = {
    session_id,
    categoria: obj.categoria,
    icone,
    titulo_curto: obj.titulo_curto,
    descricao: obj.descricao,
    valor_presente_brl: obj.valor_presente_brl,
    horizonte_anos: obj.horizonte_anos,
    ano_alvo,
    prioridade: obj.prioridade,
    modalidade: obj.modalidade ?? null,
    flexibilidade_prazo: obj.flexibilidade_prazo ?? null,
    flexibilidade_valor: obj.flexibilidade_valor ?? null,
    perfil_risco_sugerido: perfil,
    completude_score: score,
    completude_detalhes: detalhes,
    trade_offs: obj.trade_offs ?? null,
    observacoes_cliente: obj.observacoes_cliente ?? null,
    sinais_atencao: obj.sinais_atencao ?? null,
    proximo_passo_planejador: obj.proximo_passo_planejador ?? null,
  };

  let saved;
  if (existing) {
    const { data, error } = await sb
      .from('objectives')
      .update(row)
      .eq('id', existing.id)
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    saved = data;
  } else {
    const { data, error } = await sb
      .from('objectives')
      .insert(row)
      .select()
      .single();
    if (error) return { ok: false, error: error.message };
    saved = data;
  }

  // Emite evento para o front (painel de mini-cards)
  controller.enqueue(
    sseEvent({ type: 'objective_registered', objective: saved }),
  );

  return {
    ok: true,
    objective_id: saved.id,
    perfil_risco_sugerido: perfil,
    completude_score: score,
    ano_alvo,
    message:
      score >= 80
        ? 'Objetivo registrado com completude suficiente para handoff.'
        : `Objetivo registrado (completude ${score}%). Para handoff, refine os pontos faltantes.`,
  };
}

async function registerOutOfScopeNote(params: {
  session_id: string;
  input: Record<string, unknown>;
  controller: ReadableStreamDefaultController<Uint8Array>;
}) {
  const { session_id, input, controller } = params;
  const nota = (input.nota as string)?.trim();
  if (!nota) return { ok: false, error: 'nota vazia' };
  const sb = adminSupabase();
  const { error } = await sb
    .from('out_of_scope_notes')
    .insert({ session_id, nota });
  if (error) return { ok: false, error: error.message };
  controller.enqueue(sseEvent({ type: 'out_of_scope_note', nota }));
  return { ok: true };
}

// -----------------------------------------------------------------
// Helpers SSE
// -----------------------------------------------------------------
const encoder = new TextEncoder();

function sseEvent(payload: Record<string, unknown>): Uint8Array {
  return encoder.encode(`data: ${JSON.stringify(payload)}\n\n`);
}

export const config = { path: '/api/chat' };
