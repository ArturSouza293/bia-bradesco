// =================================================================
// Motor real — streaming da Anthropic API + tool use (multi-turn)
// =================================================================

import { BIA_SYSTEM_PROMPT, TOOLS } from './bia.ts';
import {
  registerUserForSession,
  upsertClientProfile,
  upsertCrossSell,
  insertEducationTopic,
  insertOutOfScopeNote,
  upsertObjective,
} from './store.ts';
import type {
  ConversationResult,
  RunConversationParams,
  SSEEvent,
} from './engine.ts';
import type {
  ClientProfileInput,
  CrossSellInput,
  ObjectiveInput,
} from './types.ts';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/messages';
const ANTHROPIC_VERSION = '2023-06-01';
const MAX_TOOL_ITERATIONS = 6;
// Folga para uma mensagem curta da Bia + várias tool calls no mesmo turno
// (objetivo + cross-sells + educação). 1024 cortava as tools no meio.
const MAX_TOKENS = 4096;

type ContentBlock =
  | { type: 'text'; text: string }
  | {
      type: 'tool_use';
      id: string;
      name: string;
      input: Record<string, unknown>;
    }
  | {
      type: 'tool_result';
      tool_use_id: string;
      content: string;
      is_error?: boolean;
    };

type AnthropicMessage =
  | { role: 'user'; content: string | ContentBlock[] }
  | { role: 'assistant'; content: ContentBlock[] };

export async function runRealConversation(
  params: RunConversationParams,
): Promise<ConversationResult> {
  const { sessionId, conversation, emit } = params;
  const apiKey = process.env.ANTHROPIC_API_KEY as string;
  const model = process.env.ANTHROPIC_MODEL?.trim() || 'claude-opus-4-7';

  // Normalização para a Anthropic:
  // 1) tira mensagens vazias
  // 2) começa na primeira mensagem 'user' (descarta openers do assistente)
  // 3) mescla mensagens consecutivas de mesma role
  const trimmed = conversation.filter(
    (m) => m.content && m.content.trim().length > 0,
  );
  const firstUser = trimmed.findIndex((m) => m.role === 'user');
  if (firstUser < 0) {
    throw new Error('Nenhuma mensagem de usuário na conversa');
  }
  const merged: { role: 'user' | 'assistant'; content: string }[] = [];
  for (const m of trimmed.slice(firstUser)) {
    const last = merged[merged.length - 1];
    if (last && last.role === m.role) {
      last.content = `${last.content}\n\n${m.content}`;
    } else {
      merged.push({ role: m.role, content: m.content });
    }
  }

  let messages: AnthropicMessage[] = merged.map((m) =>
    m.role === 'user'
      ? { role: 'user', content: m.content }
      : { role: 'assistant', content: [{ type: 'text', text: m.content }] },
  );

  let assistantText = '';

  for (let iter = 0; iter < MAX_TOOL_ITERATIONS; iter++) {
    const { blocks, text } = await streamTurn({
      apiKey,
      model,
      messages,
      emit,
    });
    assistantText += text;
    messages = [...messages, { role: 'assistant', content: blocks }];

    const toolUses = blocks.filter(
      (b): b is Extract<ContentBlock, { type: 'tool_use' }> =>
        b.type === 'tool_use',
    );
    // Sem tools (stop_reason end_turn) → encerra. Com tools (stop_reason
    // tool_use OU max_tokens com tools) → executa e continua o loop.
    if (toolUses.length === 0) break;

    const results: ContentBlock[] = [];
    for (const tu of toolUses) {
      const result = executeTool(sessionId, tu.name, tu.input, emit);
      results.push({
        type: 'tool_result',
        tool_use_id: tu.id,
        content: JSON.stringify(result),
        is_error: !result.ok,
      });
    }
    messages = [...messages, { role: 'user', content: results }];
  }

  return { assistantText };
}

// ----------------------------------------------------------------
// Um turno de streaming da Anthropic
// ----------------------------------------------------------------
async function streamTurn(params: {
  apiKey: string;
  model: string;
  messages: AnthropicMessage[];
  emit: (e: SSEEvent) => void;
}): Promise<{ blocks: ContentBlock[]; stopReason: string; text: string }> {
  const { apiKey, model, messages, emit } = params;

  const res = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'x-api-key': apiKey,
      'anthropic-version': ANTHROPIC_VERSION,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      model,
      max_tokens: MAX_TOKENS,
      system: BIA_SYSTEM_PROMPT,
      tools: TOOLS,
      messages,
      stream: true,
    }),
  });

  if (!res.ok || !res.body) {
    const errText = await res.text().catch(() => '');
    throw new Error(`Anthropic API ${res.status}: ${errText.slice(0, 400)}`);
  }

  const reader = res.body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
  const blocks: Record<number, ContentBlock> = {};
  const partialJson: Record<number, string> = {};
  let stopReason = 'end_turn';
  let text = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let sep: number;
    while ((sep = buffer.indexOf('\n\n')) >= 0) {
      const raw = buffer.slice(0, sep);
      buffer = buffer.slice(sep + 2);
      const line = raw.split('\n').find((l) => l.startsWith('data: '));
      if (!line) continue;
      const json = line.slice(6).trim();
      if (!json || json === '[DONE]') continue;

      let evt: Record<string, unknown>;
      try {
        evt = JSON.parse(json);
      } catch {
        continue;
      }

      const t = evt.type as string;
      if (t === 'content_block_start') {
        const idx = evt.index as number;
        const cb = evt.content_block as {
          type: string;
          id?: string;
          name?: string;
        };
        if (cb.type === 'text') {
          blocks[idx] = { type: 'text', text: '' };
        } else if (cb.type === 'tool_use') {
          blocks[idx] = {
            type: 'tool_use',
            id: cb.id as string,
            name: cb.name as string,
            input: {},
          };
          partialJson[idx] = '';
        }
      } else if (t === 'content_block_delta') {
        const idx = evt.index as number;
        const d = evt.delta as {
          type: string;
          text?: string;
          partial_json?: string;
        };
        if (d.type === 'text_delta' && d.text) {
          const b = blocks[idx];
          if (b?.type === 'text') b.text += d.text;
          text += d.text;
          emit({ type: 'text', delta: d.text });
        } else if (d.type === 'input_json_delta' && d.partial_json) {
          partialJson[idx] = (partialJson[idx] ?? '') + d.partial_json;
        }
      } else if (t === 'content_block_stop') {
        const idx = evt.index as number;
        const b = blocks[idx];
        if (b?.type === 'tool_use' && partialJson[idx]) {
          try {
            b.input = JSON.parse(partialJson[idx]) as Record<string, unknown>;
          } catch {
            b.input = {};
          }
        }
      } else if (t === 'message_delta') {
        const d = evt.delta as { stop_reason?: string } | undefined;
        if (d?.stop_reason) stopReason = d.stop_reason;
      }
    }
  }

  // Finaliza tool_use cujo content_block_stop não chegou (ex.: corte por
  // max_tokens) — tenta parsear o JSON parcial acumulado.
  for (const key of Object.keys(partialJson)) {
    const i = Number(key);
    const b = blocks[i];
    if (
      b?.type === 'tool_use' &&
      Object.keys(b.input).length === 0 &&
      partialJson[i]
    ) {
      try {
        b.input = JSON.parse(partialJson[i]) as Record<string, unknown>;
      } catch {
        // JSON incompleto — input fica {} e executeTool rejeita graciosamente
      }
    }
  }

  const ordered = Object.keys(blocks)
    .map(Number)
    .sort((a, b) => a - b)
    .map((i) => blocks[i]);

  return { blocks: ordered, stopReason, text };
}

// ----------------------------------------------------------------
// Execução de ferramentas (síncrono — node:sqlite é síncrono)
// ----------------------------------------------------------------
function executeTool(
  sessionId: string,
  name: string,
  input: Record<string, unknown>,
  emit: (e: SSEEvent) => void,
): { ok: boolean; [k: string]: unknown } {
  try {
    if (name === 'register_user') {
      const nome = String(input.nome ?? '').trim();
      if (!nome) return { ok: false, error: 'nome vazio' };
      const memory = registerUserForSession(sessionId, nome);
      emit({
        type: 'user_identified',
        user: memory.user,
        display_tag: memory.display_tag,
        is_returning: memory.is_returning,
      });
      return {
        ok: true,
        display_tag: memory.display_tag,
        is_returning: memory.is_returning,
        past_sessions: memory.past_sessions,
        past_objectives: memory.past_objectives,
        last_profile: memory.last_profile,
        message: memory.is_returning
          ? `Cliente recorrente: ${memory.display_tag}, com ${memory.past_objectives.length} objetivo(s) de sessões anteriores. Cumprimente pelo nome e referencie o histórico com naturalidade.`
          : `Novo cliente: ${memory.display_tag}. Use o primeiro nome ao longo da conversa.`,
      };
    }
    if (name === 'register_client_profile') {
      const profile = upsertClientProfile(
        sessionId,
        input as unknown as ClientProfileInput,
      );
      emit({ type: 'client_profile', profile });
      return {
        ok: true,
        perfil_suitability: profile.perfil_suitability,
        message: `Perfil registrado. Suitability derivado: ${profile.perfil_suitability}.`,
      };
    }
    if (name === 'register_objective') {
      const obj = upsertObjective(sessionId, input as unknown as ObjectiveInput);
      emit({ type: 'objective_registered', objective: obj });
      return {
        ok: true,
        objective_id: obj.id,
        completude_score: obj.completude_score,
        perfil_risco_sugerido: obj.perfil_risco_sugerido,
        message:
          obj.completude_score >= 80
            ? 'Objetivo registrado com completude suficiente.'
            : `Objetivo registrado (completude ${obj.completude_score}%).`,
      };
    }
    if (name === 'register_education_note') {
      const topico = String(input.topico ?? '').trim();
      if (!topico) return { ok: false, error: 'topico vazio' };
      const resumo = input.resumo ? String(input.resumo) : null;
      const topic = insertEducationTopic(sessionId, topico, resumo);
      // Metadado de aprendizado — também vai pros logs do servidor.
      console.log(
        `[learning] session=${sessionId.slice(0, 8)} topico="${topico}"${
          resumo ? ` resumo="${resumo}"` : ''
        }`,
      );
      emit({ type: 'education_note', topic });
      return { ok: true };
    }
    if (name === 'register_cross_sell') {
      const produto = String(input.produto ?? '').trim();
      if (!produto) return { ok: false, error: 'produto vazio' };
      const opportunity = upsertCrossSell(
        sessionId,
        input as unknown as CrossSellInput,
      );
      emit({ type: 'cross_sell', opportunity });
      return { ok: true };
    }
    if (name === 'register_out_of_scope_note') {
      const nota = String(input.nota ?? '').trim();
      if (!nota) return { ok: false, error: 'nota vazia' };
      insertOutOfScopeNote(sessionId, nota);
      emit({ type: 'out_of_scope_note', nota });
      return { ok: true };
    }
    return { ok: false, error: `tool desconhecida: ${name}` };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'erro' };
  }
}
