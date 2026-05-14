import type { Categoria, Flexibilidade, PerfilRisco } from '@/types/objective';

export interface RiskProfileInput {
  categoria: Categoria;
  horizonte_anos: number;
  flexibilidade_prazo?: Flexibilidade;
  flexibilidade_valor?: Flexibilidade;
}

export function calcularPerfilRisco(input: RiskProfileInput): PerfilRisco {
  if (input.categoria === 'reserva_emergencia') {
    return 'conservador';
  }

  const horizonte = input.horizonte_anos;
  const rigido =
    input.flexibilidade_prazo === 'rigido' ||
    input.flexibilidade_valor === 'rigido';

  if (horizonte < 2) return 'conservador';

  if (horizonte < 5) {
    return rigido ? 'conservador' : 'moderado';
  }

  if (horizonte < 10) {
    return rigido ? 'moderado' : 'moderado_arrojado';
  }

  return 'arrojado';
}

export const perfilLabel: Record<PerfilRisco, string> = {
  conservador: 'Conservador',
  moderado: 'Moderado',
  moderado_arrojado: 'Moderado-arrojado',
  arrojado: 'Arrojado',
};

export const perfilEmoji: Record<PerfilRisco, string> = {
  conservador: '🟢',
  moderado: '🟡',
  moderado_arrojado: '🟠',
  arrojado: '🔴',
};

export const perfilColor: Record<PerfilRisco, string> = {
  conservador: 'text-green-700 bg-green-100',
  moderado: 'text-yellow-800 bg-yellow-100',
  moderado_arrojado: 'text-orange-700 bg-orange-100',
  arrojado: 'text-red-700 bg-red-100',
};
