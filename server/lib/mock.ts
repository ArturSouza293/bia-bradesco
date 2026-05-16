// =================================================================
// Motor mock — conversa scriptada para testar design + fluxo offline.
// Sem internet, sem custo. Cada mensagem do usuário avança o roteiro.
// Roteiro segue as 4 fases: Boas-vindas → Seu Perfil (anamnese) →
// Descoberta dos objetivos → Fechamento.
// =================================================================

import {
  registerUserForSession,
  upsertClientProfile,
  upsertCrossSell,
  insertEducationTopic,
  upsertObjective,
} from './store.ts';
import type {
  ConversationResult,
  RunConversationParams,
  SSEEvent,
} from './engine.ts';
import type {
  ClientProfileInput,
  CrossSellInput,
  ObjectiveInput,
} from './types.ts';

interface MockStep {
  text: string;
  user?: string; // nome do cliente — registra/recupera o usuário (memória por pessoa)
  clientProfile?: ClientProfileInput;
  education?: { topico: string; resumo: string }[];
  crossSells?: CrossSellInput[];
  objectives?: ObjectiveInput[];
}

const SCRIPT: MockStep[] = [
  // ---- FASE 1 : aceite → pergunta o nome ----
  {
    text: 'Combinado! 😊 Antes de começar, como você gostaria de ser chamado(a)?',
  },
  // ---- FASE 1→2 : registra o usuário + inicia a anamnese 360° ----
  {
    text: 'Prazer, João! 👋 Antes de sonhar junto com você, preciso te conhecer rapidinho.\n\nMe conta três coisinhas: **qual a sua idade**, seu **estado civil**, e se você tem **dependentes** (filhos, por exemplo)?',
    user: 'João',
  },
  // ---- FASE 2 : anamnese — profissão + renda ----
  {
    text: 'Anotado, João! 📝 Agora sobre o seu dia a dia: **qual é a sua profissão** e em que **faixa de renda mensal** você se encaixa? Pode ser por faixa, fica à vontade.',
  },
  // ---- FASE 2 : anamnese — experiência + tolerância (suitability) ----
  {
    text: 'Perfeito. Última pergunta pra eu te conhecer, João: você **já investe** hoje? E quando você imagina um investimento seu **caindo de valor** por alguns meses — você fica tranquilo ou isso te incomoda bastante?',
  },
  // ---- FASE 2→3 : registra perfil + transição para objetivos ----
  {
    text: 'Show, João, agora te conheço! 🎯 Já montei seu **perfil 360°** aqui ao lado — dá uma olhada.\n\nVamos ao que interessa: quando você pensa nos próximos **5 a 10 anos**, o que você gostaria de conquistar?',
    clientProfile: {
      idade: 32,
      estado_civil: 'casado',
      dependentes: 2,
      profissao: 'Analista de marketing',
      renda_mensal_faixa: 'de_6k_a_10k',
      experiencia_investimentos: 'iniciante',
      tolerancia_risco: 'media',
      observacoes:
        'Casado, 2 filhos pequenos. Já investe pouco (poupança e um CDB). Reage com calma a oscilações moderadas.',
    },
  },
  // ---- FASE 3 : explora 1º objetivo + educação (valor presente) ----
  {
    text: 'Adorei, João! 🏠 Pra uma família com 2 filhos, sair do aluguel costuma ser prioridade mesmo. Antes de avançar, um conceito rápido: vou trabalhar sempre com **valor de hoje** — quanto custaria agora — pra não complicar com inflação nesta etapa.\n\nVocê tem ideia de quanto custaria esse imóvel hoje, e em quanto tempo gostaria de realizar?',
    education: [
      {
        topico: 'Valor presente',
        resumo:
          'Estimamos os objetivos em valores de hoje para simplificar; a correção pela inflação entra na etapa de planejamento financeiro.',
      },
    ],
  },
  // ---- FASE 3 : registra objetivo 1 + cross-sell ----
  {
    text: 'Perfeito, anotei. 📝 Pronto, João, **objetivo 1 estruturado**: casa própria, ~R$ 600 mil, em 7 anos. Já apareceu no seu resumo.\n\nTem mais algum objetivo importante? Pode ser aposentadoria, uma viagem, um carro...',
    objectives: [
      {
        categoria: 'casa_propria',
        classe_objetivo: 'desejo',
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
    crossSells: [
      {
        produto: 'financiamento_imobiliario',
        gatilho: 'Cliente quer comprar imóvel de ~R$ 600 mil em 7 anos',
        racional:
          'Objetivo de casa própria conecta diretamente com financiamento imobiliário e consórcio.',
        prioridade: 'alta',
      },
      {
        produto: 'seguro_residencial',
        gatilho: 'Aquisição de imóvel para a família',
        racional:
          'Seguro residencial protege o principal patrimônio do cliente após a compra.',
        prioridade: 'media',
      },
    ],
  },
  // ---- FASE 3 : explora 2º objetivo + educação (horizonte) ----
  {
    text: 'Faz todo sentido pensar na aposentadoria, João. 👴 E você tem o tempo a favor: aos 32, o **horizonte** é longo — quanto mais distante a data, mais espaço pra estratégias de longo prazo.\n\nVocê imagina se aposentar com mais ou menos quantos anos, e que padrão de vida gostaria de manter?',
    education: [
      {
        topico: 'Horizonte do objetivo',
        resumo:
          'O prazo muda a estratégia: objetivos longos toleram mais oscilação, objetivos curtos pedem mais segurança.',
      },
    ],
  },
  // ---- FASE 3 : registra objetivo 2 + cross-sell ----
  {
    text: 'Ótimo, João, **objetivo 2 estruturado**: aposentadoria mantendo o padrão de vida, num horizonte longo. 👴\n\nDeixa eu te perguntar uma coisa importante antes de fecharmos...',
    objectives: [
      {
        categoria: 'aposentadoria',
        classe_objetivo: 'necessidade',
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
    crossSells: [
      {
        produto: 'previdencia_privada',
        gatilho: 'Cliente quer renda complementar ao INSS na aposentadoria',
        racional:
          'Previdência privada (PGBL/VGBL) é o produto natural para o objetivo de aposentadoria, com benefício tributário.',
        prioridade: 'alta',
      },
    ],
  },
  // ---- FASE 3 : reserva de emergência proativa + educação + cross-sell ----
  {
    text: 'Você me trouxe ótimos objetivos, João, mas faltou um que vem **antes** de todos: a **reserva de emergência**. 🛡️\n\nCom 2 filhos, ela é ainda mais essencial — é um dinheiro guardado só pra imprevistos, que protege todos os outros planos. Registrei como prioridade alta, sugerindo ~6 meses das suas despesas.',
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
        classe_objetivo: 'necessidade',
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
    crossSells: [
      {
        produto: 'investimentos',
        gatilho: 'Necessidade de montar reserva de emergência líquida',
        racional:
          'A reserva precisa ficar em produtos de alta liquidez e baixo risco — oportunidade de conta investimento / CDB liquidez diária.',
        prioridade: 'media',
      },
    ],
  },
  // ---- FASE 4 : recapitulação explícita + encaminhamento ----
  {
    text:
      'Acho que já tenho um quadro bom dos seus objetivos, João. Deixa eu **recapitular** com você. 📋\n\n' +
      'Você estruturou **3 objetivos**:\n' +
      '1. 🏠 Casa própria — R$ 600 mil, 7 anos\n' +
      '2. 👴 Aposentadoria — manter o padrão de vida, 25 anos\n' +
      '3. 🛡️ Reserva de emergência — R$ 36 mil, prioridade alta\n\n' +
      'E pelo caminho você aprendeu **3 conceitos de educação financeira**:\n' +
      '• **Valor presente** — estimar objetivos em valores de hoje\n' +
      '• **Horizonte do objetivo** — o prazo muda a estratégia de cada meta\n' +
      '• **Reserva de emergência** — o colchão que protege todos os planos\n\n' +
      'Vou organizar tudo num resumo visual pra você revisar. O próximo passo é o **planejamento financeiro** — montar seu fluxo de caixa pra ver como tornar esses objetivos viáveis. Mas isso fica pra próxima conversa. 😊',
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
    await sleep(15);
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
  await sleep(340);
  await streamText(step.text, emit);

  if (step.user) {
    const memory = registerUserForSession(sessionId, step.user);
    emit({
      type: 'user_identified',
      user: memory.user,
      display_tag: memory.display_tag,
      is_returning: memory.is_returning,
    });
    await sleep(140);
  }
  if (step.clientProfile) {
    const profile = upsertClientProfile(sessionId, step.clientProfile);
    emit({ type: 'client_profile', profile });
    await sleep(140);
  }
  for (const ed of step.education ?? []) {
    const topic = insertEducationTopic(sessionId, ed.topico, ed.resumo);
    console.log(
      `[learning] session=${sessionId.slice(0, 8)} topico="${ed.topico}"${
        ed.resumo ? ` resumo="${ed.resumo}"` : ''
      }`,
    );
    emit({ type: 'education_note', topic });
    await sleep(130);
  }
  for (const obj of step.objectives ?? []) {
    const saved = upsertObjective(sessionId, obj);
    emit({ type: 'objective_registered', objective: saved });
    await sleep(130);
  }
  for (const cs of step.crossSells ?? []) {
    const opportunity = upsertCrossSell(sessionId, cs);
    emit({ type: 'cross_sell', opportunity });
    await sleep(130);
  }

  return { assistantText: step.text };
}
