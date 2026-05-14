import type {
  ExperienciaInvestimentos,
  PerfilSuitability,
  ToleranciaRisco,
} from './types.ts';

/**
 * Suitability — perfil de investidor do CLIENTE.
 * Diferente do "perfil de risco do objetivo" (que é o risco que cada
 * objetivo demanda). O suitability combina experiência + tolerância +
 * capacidade (aproximada pela idade — quanto mais jovem, mais capacidade
 * de assumir risco no longo prazo).
 *
 * Numa versão integrada isto viria de um questionário CVM completo;
 * aqui é uma derivação simplificada da anamnese rápida.
 */
export function calcularSuitability(input: {
  experiencia_investimentos: ExperienciaInvestimentos;
  tolerancia_risco: ToleranciaRisco;
  idade: number;
}): PerfilSuitability {
  const expScore: Record<ExperienciaInvestimentos, number> = {
    nenhuma: 0,
    iniciante: 1,
    intermediaria: 2,
    experiente: 3,
  };
  const tolScore: Record<ToleranciaRisco, number> = {
    baixa: 0,
    media: 1,
    alta: 2,
  };
  const idadeFator = input.idade < 35 ? 1 : input.idade > 55 ? -1 : 0;

  const score =
    expScore[input.experiencia_investimentos] +
    tolScore[input.tolerancia_risco] +
    idadeFator;

  if (score <= 1) return 'conservador';
  if (score <= 3) return 'moderado';
  return 'arrojado';
}
