// Tipos compartilhados do servidor (espelham src/types/objective.ts)

export type Categoria =
  | 'casa_propria'
  | 'aposentadoria'
  | 'educacao_filhos'
  | 'educacao_propria'
  | 'reserva_emergencia'
  | 'viagem'
  | 'veiculo'
  | 'negocio'
  | 'casamento'
  | 'sucessao'
  | 'outro';

export type Prioridade = 'alta' | 'media' | 'baixa';
export type Flexibilidade = 'rigido' | 'flexivel';
export type PerfilRisco =
  | 'conservador'
  | 'moderado'
  | 'moderado_arrojado'
  | 'arrojado';
export type SessionStatus = 'active' | 'completed' | 'abandoned';
export type Role = 'user' | 'assistant' | 'system';

export interface CompletudeDetalhes {
  especifico: boolean;
  mensuravel: boolean;
  alcancavel: boolean;
  relevante: boolean;
  temporal: boolean;
}

export interface ObjectiveInput {
  categoria: Categoria;
  icone?: string;
  titulo_curto: string;
  descricao: string;
  valor_presente_brl: number;
  horizonte_anos: number;
  ano_alvo?: number;
  prioridade: Prioridade;
  modalidade?: string;
  flexibilidade_prazo?: Flexibilidade;
  flexibilidade_valor?: Flexibilidade;
  trade_offs?: string;
  observacoes_cliente?: string;
  sinais_atencao?: string[];
  proximo_passo_planejador?: string;
}

export interface Objective {
  id: string;
  session_id: string;
  categoria: Categoria;
  icone: string | null;
  titulo_curto: string;
  descricao: string | null;
  valor_presente_brl: number | null;
  horizonte_anos: number | null;
  ano_alvo: number | null;
  prioridade: Prioridade;
  modalidade: string | null;
  flexibilidade_prazo: Flexibilidade | null;
  flexibilidade_valor: Flexibilidade | null;
  perfil_risco_sugerido: PerfilRisco | null;
  completude_score: number;
  completude_detalhes: CompletudeDetalhes | null;
  trade_offs: string | null;
  observacoes_cliente: string | null;
  sinais_atencao: string[] | null;
  proximo_passo_planejador: string | null;
  created_at: string;
  updated_at: string;
}

export interface EducationTopic {
  id: string;
  session_id: string;
  topico: string;
  resumo: string | null;
  created_at: string;
}

export interface SessionRow {
  id: string;
  started_at: string;
  ended_at: string | null;
  status: SessionStatus;
  duration_minutes: number | null;
  created_at: string;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
