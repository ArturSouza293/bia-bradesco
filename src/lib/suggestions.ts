import type { JourneyPhase } from './journey';

// Sugestões de resposta clicáveis — para o cliente nunca ficar solto.
// Aparecem abaixo do chat conforme a fase da jornada e dão um caminho
// de "menor resistência" quando a pessoa hesita.

export interface Suggestion {
  label: string;
  text: string; // o que será enviado como mensagem do usuário
}

const SUGGESTIONS: Record<JourneyPhase, Suggestion[]> = {
  boas_vindas: [
    { label: '👍 Podemos começar!', text: 'Sim, podemos começar!' },
  ],
  perfil: [],
  objetivos: [
    { label: '🏠 Comprar minha casa', text: 'Queria comprar uma casa própria.' },
    {
      label: '👴 Aposentadoria',
      text: 'Quero me planejar para a aposentadoria.',
    },
    { label: '✈️ Uma viagem', text: 'Tenho uma viagem em mente.' },
    {
      label: '🎓 Educação dos filhos',
      text: 'Quero garantir a educação dos meus filhos.',
    },
    {
      label: '🛡️ Reserva de emergência',
      text: 'Preciso montar uma reserva de emergência.',
    },
    {
      label: '🤔 Não sei por onde começar',
      text: 'Não sei muito bem por onde começar.',
    },
  ],
  fechamento: [
    {
      label: '🙏 Obrigado(a)!',
      text: 'Obrigado(a), era exatamente isso que eu queria!',
    },
  ],
};

export function getSuggestions(phase: JourneyPhase): Suggestion[] {
  return SUGGESTIONS[phase] ?? [];
}
