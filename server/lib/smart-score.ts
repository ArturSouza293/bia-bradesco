import type { CompletudeDetalhes, ObjectiveInput } from './types.ts';

export const HANDOFF_THRESHOLD = 80;

/**
 * Checklist SMART — 20 pontos cada (total 100).
 * Específico · Mensurável · Alcançável · Relevante · Temporal
 */
export function calcularSmartScore(input: ObjectiveInput): {
  score: number;
  detalhes: CompletudeDetalhes;
} {
  const especifico = Boolean(
    input.descricao && input.descricao.trim().length >= 12,
  );
  const mensuravel =
    Number.isFinite(input.valor_presente_brl) && input.valor_presente_brl > 0;
  const alcancavel =
    mensuravel &&
    Number.isFinite(input.horizonte_anos) &&
    input.horizonte_anos > 0;
  const relevante = Boolean(
    (input.observacoes_cliente && input.observacoes_cliente.trim().length > 0) ||
      (input.trade_offs && input.trade_offs.trim().length > 0) ||
      (input.proximo_passo_planejador &&
        input.proximo_passo_planejador.trim().length > 0),
  );
  const temporal =
    Number.isFinite(input.horizonte_anos) && input.horizonte_anos > 0;

  const detalhes: CompletudeDetalhes = {
    especifico,
    mensuravel,
    alcancavel,
    relevante,
    temporal,
  };
  const score =
    (especifico ? 20 : 0) +
    (mensuravel ? 20 : 0) +
    (alcancavel ? 20 : 0) +
    (relevante ? 20 : 0) +
    (temporal ? 20 : 0);

  return { score, detalhes };
}

export const CATEGORIA_ICONE: Record<string, string> = {
  casa_propria: '🏠',
  aposentadoria: '👴',
  educacao_filhos: '🎓',
  educacao_propria: '📚',
  reserva_emergencia: '🛡️',
  viagem: '✈️',
  veiculo: '🚗',
  negocio: '💼',
  casamento: '💍',
  sucessao: '👨‍👩‍👧',
  outro: '🎯',
};
