import type { ProdutoCrossSell } from '@/types/objective';

export const PRODUTO_LABEL: Record<ProdutoCrossSell, string> = {
  previdencia_privada: 'Previdência Privada',
  seguro_de_vida: 'Seguro de Vida',
  seguro_residencial: 'Seguro Residencial',
  seguro_auto: 'Seguro Auto',
  consorcio: 'Consórcio',
  financiamento_imobiliario: 'Financiamento Imobiliário',
  credito: 'Crédito',
  investimentos: 'Investimentos',
  cartao: 'Cartão de Crédito',
  capitalizacao: 'Capitalização',
  conta_pj: 'Conta PJ',
  outro: 'Outro produto',
};

export const PRODUTO_ICONE: Record<ProdutoCrossSell, string> = {
  previdencia_privada: '🪙',
  seguro_de_vida: '🛟',
  seguro_residencial: '🏡',
  seguro_auto: '🚙',
  consorcio: '🤝',
  financiamento_imobiliario: '🏦',
  credito: '💵',
  investimentos: '📈',
  cartao: '💳',
  capitalizacao: '🎟️',
  conta_pj: '🏢',
  outro: '💼',
};

export const PRIORIDADE_BADGE: Record<string, string> = {
  alta: '🔴 Alta',
  media: '🟡 Média',
  baixa: '🟢 Baixa',
};
