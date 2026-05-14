import type {
  Categoria,
  Flexibilidade,
  HorizonteClasse,
  PerfilRisco,
} from './types.ts';

/**
 * Perfil de risco que o OBJETIVO demanda (não o suitability do cliente).
 * Tabela horizonte × flexibilidade. Reserva de emergência é sempre conservador.
 */
export function calcularPerfilRisco(input: {
  categoria: Categoria;
  horizonte_anos: number;
  flexibilidade_prazo?: Flexibilidade;
  flexibilidade_valor?: Flexibilidade;
}): PerfilRisco {
  if (input.categoria === 'reserva_emergencia') return 'conservador';

  const h = input.horizonte_anos;
  const rigido =
    input.flexibilidade_prazo === 'rigido' ||
    input.flexibilidade_valor === 'rigido';

  if (h < 2) return 'conservador';
  if (h < 5) return rigido ? 'conservador' : 'moderado';
  if (h < 10) return rigido ? 'moderado' : 'moderado_arrojado';
  return 'arrojado';
}

/**
 * Classificação CFP do horizonte temporal do objetivo:
 * curto (< 2 anos) · médio (2 a 5 anos) · longo (> 5 anos).
 */
export function classificarHorizonte(horizonte_anos: number): HorizonteClasse {
  if (horizonte_anos < 2) return 'curto';
  if (horizonte_anos <= 5) return 'medio';
  return 'longo';
}
