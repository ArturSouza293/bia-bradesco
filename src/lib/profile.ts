import type {
  EstadoCivil,
  ExperienciaInvestimentos,
  PerfilSuitability,
  RendaFaixa,
  ToleranciaRisco,
} from '@/types/objective';

export const ESTADO_CIVIL_LABEL: Record<EstadoCivil, string> = {
  solteiro: 'Solteiro(a)',
  casado: 'Casado(a)',
  uniao_estavel: 'União estável',
  divorciado: 'Divorciado(a)',
  viuvo: 'Viúvo(a)',
};

export const RENDA_FAIXA_LABEL: Record<RendaFaixa, string> = {
  ate_3k: 'Até R$ 3 mil',
  de_3k_a_6k: 'R$ 3 mil a R$ 6 mil',
  de_6k_a_10k: 'R$ 6 mil a R$ 10 mil',
  de_10k_a_20k: 'R$ 10 mil a R$ 20 mil',
  acima_20k: 'Acima de R$ 20 mil',
};

export const EXPERIENCIA_LABEL: Record<ExperienciaInvestimentos, string> = {
  nenhuma: 'Nunca investiu',
  iniciante: 'Iniciante',
  intermediaria: 'Intermediária',
  experiente: 'Experiente',
};

export const TOLERANCIA_LABEL: Record<ToleranciaRisco, string> = {
  baixa: 'Baixa',
  media: 'Média',
  alta: 'Alta',
};

// Suitability — perfil de investidor do cliente
export const SUITABILITY_LABEL: Record<PerfilSuitability, string> = {
  conservador: 'Conservador',
  moderado: 'Moderado',
  arrojado: 'Arrojado',
};

export const SUITABILITY_EMOJI: Record<PerfilSuitability, string> = {
  conservador: '🟢',
  moderado: '🟡',
  arrojado: '🔴',
};

export const SUITABILITY_STYLE: Record<PerfilSuitability, string> = {
  conservador: 'text-green-700 bg-green-100',
  moderado: 'text-amber-800 bg-amber-100',
  arrojado: 'text-red-700 bg-red-100',
};
