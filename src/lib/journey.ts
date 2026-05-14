import type { Objective } from '@/types/objective';
import type { UIMessage } from '@/store/sessionStore';

// As 3 fases da jornada com a Bia — começo, meio e fim.
export type JourneyPhase = 'boas_vindas' | 'descoberta' | 'fechamento';

export const JOURNEY_PHASES: {
  key: JourneyPhase;
  label: string;
  hint: string;
}[] = [
  { key: 'boas_vindas', label: 'Boas-vindas', hint: 'Conhecendo a jornada' },
  { key: 'descoberta', label: 'Descoberta', hint: 'Estruturando objetivos' },
  { key: 'fechamento', label: 'Fechamento', hint: 'Resumo e próximos passos' },
];

/**
 * Deriva a fase atual da jornada a partir do estado da sessão.
 * - fechamento: a Bia sinalizou encerramento
 * - descoberta: cliente já interagiu ou já há objetivos
 * - boas_vindas: ainda no aceite inicial
 */
export function deriveJourneyPhase(params: {
  messages: UIMessage[];
  objectives: Objective[];
  endedByBia: boolean;
}): JourneyPhase {
  if (params.endedByBia) return 'fechamento';
  const userMsgs = params.messages.filter((m) => m.role === 'user').length;
  if (userMsgs >= 1 || params.objectives.length > 0) return 'descoberta';
  return 'boas_vindas';
}

export function phaseIndex(phase: JourneyPhase): number {
  return JOURNEY_PHASES.findIndex((p) => p.key === phase);
}
