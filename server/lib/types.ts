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
// Classificação CFP: necessidade (essencial) vs desejo (importante, não essencial)
export type ClasseObjetivo = 'necessidade' | 'desejo';
// Classificação CFP por horizonte temporal
export type HorizonteClasse = 'curto' | 'medio' | 'longo';
export type SessionStatus = 'active' | 'completed' | 'abandoned';
export type Role = 'user' | 'assistant' | 'system';

// ---- Perfil 360° do cliente (anamnese) ----
export type EstadoCivil =
  | 'solteiro'
  | 'casado'
  | 'uniao_estavel'
  | 'divorciado'
  | 'viuvo';
export type RendaFaixa =
  | 'ate_3k'
  | 'de_3k_a_6k'
  | 'de_6k_a_10k'
  | 'de_10k_a_20k'
  | 'acima_20k';
export type ExperienciaInvestimentos =
  | 'nenhuma'
  | 'iniciante'
  | 'intermediaria'
  | 'experiente';
export type ToleranciaRisco = 'baixa' | 'media' | 'alta';
// Suitability — perfil de investidor do CLIENTE (≠ perfil de risco do objetivo)
export type PerfilSuitability = 'conservador' | 'moderado' | 'arrojado';

export interface ClientProfileInput {
  idade: number;
  estado_civil: EstadoCivil;
  dependentes: number;
  profissao: string;
  renda_mensal_faixa: RendaFaixa;
  experiencia_investimentos: ExperienciaInvestimentos;
  tolerancia_risco: ToleranciaRisco;
  observacoes?: string;
}

export interface ClientProfile {
  session_id: string;
  idade: number | null;
  estado_civil: EstadoCivil | null;
  dependentes: number | null;
  profissao: string | null;
  renda_mensal_faixa: RendaFaixa | null;
  experiencia_investimentos: ExperienciaInvestimentos | null;
  tolerancia_risco: ToleranciaRisco | null;
  perfil_suitability: PerfilSuitability | null;
  observacoes: string | null;
  created_at: string;
  updated_at: string;
}

export interface CompletudeDetalhes {
  especifico: boolean;
  mensuravel: boolean;
  alcancavel: boolean;
  relevante: boolean;
  temporal: boolean;
}

export interface ObjectiveInput {
  categoria: Categoria;
  classe_objetivo: ClasseObjetivo;
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
  classe_objetivo: ClasseObjetivo | null;
  horizonte_classe: HorizonteClasse | null;
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

export type ProdutoCrossSell =
  | 'previdencia_privada'
  | 'seguro_de_vida'
  | 'seguro_residencial'
  | 'seguro_auto'
  | 'consorcio'
  | 'financiamento_imobiliario'
  | 'credito'
  | 'investimentos'
  | 'cartao'
  | 'capitalizacao'
  | 'conta_pj'
  | 'outro';

export interface CrossSellInput {
  produto: ProdutoCrossSell;
  gatilho: string;
  racional: string;
  prioridade: Prioridade;
}

export interface CrossSellOpportunity {
  id: string;
  session_id: string;
  produto: ProdutoCrossSell;
  gatilho: string | null;
  racional: string | null;
  prioridade: Prioridade | null;
  created_at: string;
}

export interface SessionRow {
  id: string;
  user_id: number | null;
  started_at: string;
  ended_at: string | null;
  status: SessionStatus;
  duration_minutes: number | null;
  created_at: string;
}

// ---- Usuário da demo (memória por pessoa) ----
export interface User {
  id: number;
  nome: string;
  created_at: string;
}

// Resumo de um objetivo registrado numa sessão anterior do mesmo usuário
export interface PastObjective {
  titulo_curto: string;
  categoria: Categoria;
  valor_presente_brl: number | null;
  horizonte_anos: number | null;
}

// O que register_user devolve: o usuário + a memória das sessões passadas
export interface UserMemory {
  user: User;
  display_tag: string; // "Maria #7"
  is_returning: boolean; // já existia antes desta sessão
  past_sessions: number; // nº de sessões anteriores do mesmo usuário
  past_objectives: PastObjective[];
  last_profile: ClientProfile | null;
}

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}
