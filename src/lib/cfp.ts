import type { ClasseObjetivo, HorizonteClasse } from '@/types/objective';

// ---- Classe do objetivo (necessidade vs desejo) — conceito CFP ----
export const CLASSE_LABEL: Record<ClasseObjetivo, string> = {
  necessidade: 'Necessidade',
  desejo: 'Desejo',
};

export const CLASSE_HINT: Record<ClasseObjetivo, string> = {
  necessidade: 'Essencial à segurança financeira',
  desejo: 'Importante, mas não essencial',
};

export const CLASSE_STYLE: Record<ClasseObjetivo, string> = {
  necessidade: 'text-amber-800 bg-amber-50 border border-amber-200',
  desejo: 'text-sky-700 bg-sky-50 border border-sky-200',
};

export const CLASSE_ICON: Record<ClasseObjetivo, string> = {
  necessidade: '🔓',
  desejo: '✨',
};

// ---- Horizonte temporal — conceito CFP ----
export const HORIZONTE_LABEL: Record<HorizonteClasse, string> = {
  curto: 'Curto prazo',
  medio: 'Médio prazo',
  longo: 'Longo prazo',
};

export const HORIZONTE_HINT: Record<HorizonteClasse, string> = {
  curto: 'até 2 anos',
  medio: '2 a 5 anos',
  longo: 'acima de 5 anos',
};
