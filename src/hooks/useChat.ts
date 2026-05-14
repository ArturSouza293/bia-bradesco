import { useCallback } from 'react';
import { useSessionStore, type UIMessage } from '@/store/sessionStore';

const CLOSING_PHRASE_FRAGMENT = 'já tenho um quadro bom';

function uid() {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

interface ChatEvent {
  type: 'text' | 'objective_registered' | 'out_of_scope_note' | 'error' | 'done';
  delta?: string;
  objective?: unknown;
  nota?: string;
  message?: string;
}

export function useChat() {
  const sendMessage = useCallback(async (content: string) => {
    const trimmed = content.trim();
    const state = useSessionStore.getState();
    const sessionId = state.sessionId;
    if (!trimmed || !sessionId) return;

    state.setError(null);

    const now = new Date().toISOString();
    const userMsg: UIMessage = {
      id: uid(),
      role: 'user',
      content: trimmed,
      created_at: now,
    };
    state.addMessage(userMsg);

    // Histórico até a mensagem do usuário recém-adicionada (NÃO inclui o
    // balão pending do assistente, que adicionamos só pra UI logo depois).
    // Filtra mensagens com conteúdo vazio (ex.: balões pending de turnos
    // anteriores que falharam) — o servidor também normaliza por segurança.
    const payloadMessages = [...state.messages, userMsg]
      .filter((m) => m.content.trim().length > 0)
      .map((m) => ({ role: m.role, content: m.content }));

    // Cria balão do assistente vazio (será preenchido pelo stream)
    state.addMessage({
      id: uid(),
      role: 'assistant',
      content: '',
      created_at: new Date().toISOString(),
      pending: true,
    });

    state.setStreaming(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          messages: payloadMessages,
        }),
      });

      if (!res.ok || !res.body) {
        const errText = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status} ${errText.slice(0, 200)}`);
      }

      await consumeSSE(res.body, (evt) => {
        const s = useSessionStore.getState();
        if (evt.type === 'text' && evt.delta) {
          s.appendToLastAssistant(evt.delta);
        } else if (evt.type === 'objective_registered' && evt.objective) {
          s.upsertObjective(evt.objective as never);
        } else if (evt.type === 'out_of_scope_note' && evt.nota) {
          s.addOutOfScopeNote(evt.nota);
        } else if (evt.type === 'error' && evt.message) {
          s.setError(evt.message);
        }
      });

      // Detecção de encerramento pela Bia (heurística por trecho da fala)
      const last = useSessionStore.getState().messages.at(-1);
      if (
        last?.role === 'assistant' &&
        last.content.toLowerCase().includes(CLOSING_PHRASE_FRAGMENT)
      ) {
        useSessionStore.getState().setEndedByBia(true);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro inesperado';
      useSessionStore.getState().setError(msg);
    } finally {
      useSessionStore.getState().setStreaming(false);
    }
  }, []);

  return { sendMessage };
}

async function consumeSSE(
  body: ReadableStream<Uint8Array>,
  onEvent: (evt: ChatEvent) => void,
) {
  const reader = body.getReader();
  const decoder = new TextDecoder('utf-8');
  let buffer = '';
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
      if (!json) continue;
      try {
        onEvent(JSON.parse(json) as ChatEvent);
      } catch {
        // ignora linha mal formada
      }
    }
  }
}
