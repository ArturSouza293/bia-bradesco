// =================================================================
// Motor mock — conversa scriptada para testar design + fluxo offline
// Sem internet, sem custo. Cada mensagem do usuário avança o roteiro.
// =================================================================

import { insertEducationTopic, upsertObjective } from './store.ts';
import type {
  ConversationResult,
  RunConversationParams,
  SSEEvent,
} from './engine.ts';
import type { ObjectiveInput } from './types.ts';

interface MockStep {
  text: string;
  education?: { topico: string; resumo: string }[];
  objectives?: ObjectiveInput[];
}

const SCRIPT: MockStep[] = [
  // Passo 1 — primeira pergunta de descoberta
  {
    text: 'Que bom que topou! 🎯\n\nVamos começar simples: quando você pensa nos próximos **5 a 10 anos**, o que você gostaria de conquistar?',
  },
  // Passo 2 — explora 1º objetivo + educação (valor presente)
  {
    text: 'Adorei! 🏠 Antes de avançar, um conceito importante: vou trabalhar sempre com **valor de hoje** — quanto custaria agora — pra não complicar com inflação nesta etapa.\n\nVocê tem ideia de quanto custaria esse imóvel hoje, e em quanto tempo gostaria de realizar?',
    education: [
      {
        topico: 'Valor presente',
        resumo:
          'Estimamos os objetivos em valores de hoje para simplificar; a correção pela inflação entra na etapa de planejamento financeiro.',
      },
    ],
  },
  // Passo 3 — registra objetivo 1 (casa própria)
  {
    text: 'Perfeito, anotei. 📝 Então temos seu **primeiro objetivo** estruturado: casa própria, na faixa de R$ 600 mil, em uns 7 anos. Já deixei registrado aqui do lado.\n\nTem mais algum objetivo importante pra você? Pode ser aposentadoria, uma viagem, um carro...',
    objectives: [
      {
        categoria: 'casa_propria',
        titulo_curto: 'Casa própria — apê 2 quartos zona sul SP',
        descricao:
          'Apartamento de 2 quartos na zona sul de São Paulo para morar com a família',
        valor_presente_brl: 600000,
        horizonte_anos: 7,
        prioridade: 'alta',
        modalidade: 'financiamento',
        flexibilidade_prazo: 'flexivel',
        flexibilidade_valor: 'rigido',
        observacoes_cliente: 'Sonho antigo da família, querem sair do aluguel',
        proximo_passo_planejador:
          'Avaliar capacidade de entrada vs. financiamento no fluxo de caixa',
      },
    ],
  },
  // Passo 4 — explora 2º objetivo + educação (horizonte)
  {
    text: 'Faz todo sentido pensar na aposentadoria. 👴 Aqui entra outro conceito: o **horizonte** do objetivo — quanto mais longe a data, mais espaço pra estratégias de longo prazo.\n\nVocê imagina se aposentar com mais ou menos quantos anos, e que padrão de vida gostaria de manter?',
    education: [
      {
        topico: 'Horizonte do objetivo',
        resumo:
          'O prazo muda a estratégia: objetivos longos toleram mais oscilação, objetivos curtos pedem mais segurança.',
      },
    ],
  },
  // Passo 5 — registra objetivo 2 (aposentadoria)
  {
    text: 'Ótimo, registrei seu **segundo objetivo**: aposentadoria mantendo o padrão de vida, num horizonte longo. 👴\n\nDeixa eu te perguntar uma coisa importante antes de fecharmos...',
    objectives: [
      {
        categoria: 'aposentadoria',
        titulo_curto: 'Aposentadoria — manter padrão de vida',
        descricao:
          'Aposentar-se mantendo o padrão de vida atual, com renda complementar à previdência pública',
        valor_presente_brl: 1200000,
        horizonte_anos: 25,
        prioridade: 'media',
        flexibilidade_prazo: 'flexivel',
        flexibilidade_valor: 'flexivel',
        observacoes_cliente:
          'Quer tranquilidade na terceira idade, sem depender só do INSS',
        proximo_passo_planejador:
          'Dimensionar aporte mensal necessário no fluxo de caixa',
      },
    ],
  },
  // Passo 6 — sugere reserva de emergência proativamente + educação
  {
    text: 'Você me trouxe ótimos objetivos, mas faltou um que vem **antes** de todos: a **reserva de emergência**. 🛡️\n\nÉ um dinheiro guardado só pra imprevistos — sem ela, qualquer susto faz você sacar dos outros objetivos. Já registrei como prioridade alta, sugerindo algo em torno de 6 meses das suas despesas.',
    education: [
      {
        topico: 'Reserva de emergência',
        resumo:
          'É o primeiro objetivo a montar: um colchão para imprevistos que protege todos os outros planos. Regra geral: 6 meses de despesas.',
      },
    ],
    objectives: [
      {
        categoria: 'reserva_emergencia',
        titulo_curto: 'Reserva de emergência',
        descricao:
          'Colchão de segurança equivalente a cerca de 6 meses de despesas para imprevistos',
        valor_presente_brl: 36000,
        horizonte_anos: 1,
        prioridade: 'alta',
        flexibilidade_prazo: 'flexivel',
        flexibilidade_valor: 'flexivel',
        observacoes_cliente:
          'Cliente não havia pensado nisso — sugerido proativamente pela Bia',
        sinais_atencao: [
          'Valor é estimativa — confirmar despesas mensais reais no fluxo de caixa',
        ],
        proximo_passo_planejador:
          'Levantar despesas mensais fixas para dimensionar a reserva com precisão',
      },
    ],
  },
  // Passo 7+ — encerramento (fronteira final)
  {
    text: 'Acho que já tenho um quadro bom dos seus objetivos. Vou organizar tudo num resumo visual pra você revisar. 😊\n\nO próximo passo é o **planejamento financeiro** — montar seu fluxo de caixa pra ver como tornar esses objetivos viáveis. Mas isso fica pra próxima conversa.\n\nPode olhar o resumo com calma e, se quiser ajustar algo, é só avisar!',
  },
];

function sleep(ms: number): Promise<void> {
  return new Promise((r) => setTimeout(r, ms));
}

async function streamText(
  text: string,
  emit: (e: SSEEvent) => void,
): Promise<void> {
  const chunks = text.match(/[\s\S]{1,4}/g) ?? [];
  for (const c of chunks) {
    emit({ type: 'text', delta: c });
    await sleep(16);
  }
}

export async function runMockConversation(
  params: RunConversationParams,
): Promise<ConversationResult> {
  const { sessionId, conversation, emit } = params;

  const userCount = conversation.filter(
    (m) => m.role === 'user' && m.content.trim().length > 0,
  ).length;
  const stepIndex = Math.min(Math.max(userCount - 1, 0), SCRIPT.length - 1);
  const step = SCRIPT[stepIndex];

  // pequeno "pensando..." antes de responder
  await sleep(380);
  await streamText(step.text, emit);

  for (const ed of step.education ?? []) {
    const topic = insertEducationTopic(sessionId, ed.topico, ed.resumo);
    emit({ type: 'education_note', topic });
    await sleep(140);
  }
  for (const obj of step.objectives ?? []) {
    const saved = upsertObjective(sessionId, obj);
    emit({ type: 'objective_registered', objective: saved });
    await sleep(140);
  }

  return { assistantText: step.text };
}
