import type { Objective, ClientProfile } from '@/types/objective';
import type { UIMessage } from '@/store/sessionStore';

// As 4 fases da jornada com a Bia — começo, meio e fim.
export type JourneyPhase =
  | 'boas_vindas'
  | 'perfil'
  | 'objetivos'
  | 'fechamento';

export const JOURNEY_PHASES: {
  key: JourneyPhase;
  label: string;
  hint: string;
}[] = [
  { key: 'boas_vindas', label: 'Boas-vindas', hint: 'Conhecendo a jornada' },
  { key: 'perfil', label: 'Seu perfil', hint: 'Anamnese rápida' },
  { key: 'objetivos', label: 'Objetivos', hint: 'Estruturando objetivos' },
  { key: 'fechamento', label: 'Fechamento', hint: 'Resumo e próximos passos' },
];

/**
 * Deriva a fase atual da jornada a partir do estado da sessão.
 * - fechamento: a Bia sinalizou encerramento
 * - objetivos: já há perfil registrado ou objetivos
 * - perfil: cliente aceitou e está na anamnese
 * - boas_vindas: ainda no aceite inicial
 */
export function deriveJourneyPhase(params: {
  messages: UIMessage[];
  objectives: Objective[];
  clientProfile: ClientProfile | null;
  endedByBia: boolean;
}): JourneyPhase {
  if (params.endedByBia) return 'fechamento';
  if (params.clientProfile || params.objectives.length > 0) return 'objetivos';
  const userMsgs = params.messages.filter((m) => m.role === 'user').length;
  if (userMsgs >= 1) return 'perfil';
  return 'boas_vindas';
}

export function phaseIndex(phase: JourneyPhase): number {
  return JOURNEY_PHASES.findIndex((p) => p.key === phase);
}
