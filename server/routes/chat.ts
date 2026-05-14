import express from 'express';
import type { Request, Response } from 'express';
import {
  countUserMessages,
  getSession,
  insertMessage,
} from '../lib/store.ts';
import { runConversation } from '../lib/engine.ts';
import type { SSEEvent } from '../lib/engine.ts';
import type { ChatMessage } from '../lib/types.ts';

export const chatRouter = express.Router();

// Trava de segurança contra loop (não é rate limit de produto — é só
// para um teste local não disparar chamadas infinitas ao Claude).
const MAX_MESSAGES_PER_SESSION = 60;

// POST /api/chat — body { session_id, messages: [{role, content}] }
// Resposta: stream SSE (text / objective_registered / education_note /
// out_of_scope_note / error / done)
chatRouter.post('/chat', async (req: Request, res: Response) => {
  const body = req.body ?? {};
  const session_id = body.session_id as string | undefined;
  const messages = body.messages as
    | { role: string; content: string }[]
    | undefined;

  if (!session_id || typeof session_id !== 'string') {
    res.status(400).json({ error: 'session_id é obrigatório' });
    return;
  }
  if (!Array.isArray(messages) || messages.length === 0) {
    res.status(400).json({ error: 'messages não pode ser vazio' });
    return;
  }

  const session = getSession(session_id);
  if (!session) {
    res.status(404).json({ error: 'Sessão não encontrada' });
    return;
  }
  if (session.status !== 'active') {
    res.status(409).json({ error: 'Sessão já encerrada' });
    return;
  }
  if (countUserMessages(session_id) >= MAX_MESSAGES_PER_SESSION) {
    res.status(429).json({
      error: `Limite de ${MAX_MESSAGES_PER_SESSION} mensagens por sessão. Reinicie para continuar.`,
    });
    return;
  }

  const last = messages[messages.length - 1];
  if (!last || last.role !== 'user') {
    res.status(400).json({ error: 'A última mensagem precisa ser do usuário' });
    return;
  }
  insertMessage(session_id, 'user', String(last.content));

  // Stream SSE
  res.setHeader('Content-Type', 'text/event-stream; charset=utf-8');
  res.setHeader('Cache-Control', 'no-cache, no-transform');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('X-Accel-Buffering', 'no');
  res.flushHeaders();

  const emit = (event: SSEEvent) => {
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  };

  try {
    const conversation: ChatMessage[] = messages.map((m) => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: String(m.content ?? ''),
    }));
    const { assistantText } = await runConversation({
      sessionId: session_id,
      conversation,
      emit,
    });
    if (assistantText.trim().length > 0) {
      insertMessage(session_id, 'assistant', assistantText);
    }
  } catch (e) {
    emit({
      type: 'error',
      message: e instanceof Error ? e.message : 'Erro inesperado no servidor',
    });
  } finally {
    emit({ type: 'done' });
    res.end();
  }
});
