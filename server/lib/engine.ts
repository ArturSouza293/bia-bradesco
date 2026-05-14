// =================================================================
// Motor de conversa — interface comum + seletor real/mock
// =================================================================

import type { ChatMessage, EducationTopic, Objective } from './types.ts';
import { runRealConversation } from './anthropic.ts';
import { runMockConversation } from './mock.ts';

export type SSEEvent =
  | { type: 'text'; delta: string }
  | { type: 'objective_registered'; objective: Objective }
  | { type: 'education_note'; topic: EducationTopic }
  | { type: 'out_of_scope_note'; nota: string }
  | { type: 'error'; message: string }
  | { type: 'done' };

export interface RunConversationParams {
  sessionId: string;
  conversation: ChatMessage[];
  emit: (event: SSEEvent) => void;
}

export interface ConversationResult {
  assistantText: string;
}

/**
 * Decide se roda em modo mock (offline, scriptado) ou real (Claude).
 * Mock quando: MOCK_LLM=true OU não há ANTHROPIC_API_KEY válida.
 * Isso faz o app funcionar offline out-of-the-box.
 */
export function isMockMode(): boolean {
  const flag = process.env.MOCK_LLM?.trim().toLowerCase();
  if (flag === 'true' || flag === '1') return true;
  const key = process.env.ANTHROPIC_API_KEY?.trim();
  if (!key || !key.startsWith('sk-ant-') || key.includes('COLE_AQUI')) {
    return true;
  }
  return false;
}

export async function runConversation(
  params: RunConversationParams,
): Promise<ConversationResult> {
  return isMockMode()
    ? runMockConversation(params)
    : runRealConversation(params);
}
