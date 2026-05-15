import { useEffect, useMemo, useRef } from 'react';
import { Target } from 'lucide-react';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { ChatInput } from '@/components/chat/ChatInput';
import { StatusBar } from '@/components/phone/StatusBar';
import { JourneyProgress } from '@/components/JourneyProgress';
import { useChat } from '@/hooks/useChat';
import { useSessionStore } from '@/store/sessionStore';
import { deriveJourneyPhase } from '@/lib/journey';
import { getSuggestions } from '@/lib/suggestions';

interface ChatViewProps {
  /** Mobile: callback para alternar para a AppView. Ausente no desktop. */
  onShowApp?: () => void;
}

/** A conversa com a Bia — WhatsApp puro, dentro de um iPhone. */
export function ChatView({ onShowApp }: ChatViewProps) {
  const messages = useSessionStore((s) => s.messages);
  const objectives = useSessionStore((s) => s.objectives);
  const clientProfile = useSessionStore((s) => s.clientProfile);
  const endedByBia = useSessionStore((s) => s.endedByBia);
  const isStreaming = useSessionStore((s) => s.isStreaming);
  const isTyping = useSessionStore((s) => s.isTyping);
  const error = useSessionStore((s) => s.error);
  const { sendMessage } = useChat();

  const phase = deriveJourneyPhase({
    messages,
    objectives,
    clientProfile,
    endedByBia,
  });
  const suggestions = getSuggestions(phase);
  const showSuggestions =
    suggestions.length > 0 && !isStreaming && !isTyping;
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ top: el.scrollHeight, behavior: 'smooth' });
  }, [messages, isStreaming, isTyping]);

  const headerStatus: 'online' | 'digitando…' =
    isStreaming || isTyping ? 'digitando…' : 'online';

  const lastAssistantPending = useMemo(() => {
    const last = messages.at(-1);
    return last?.role === 'assistant' && isStreaming && last.content === '';
  }, [messages, isStreaming]);

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Status bar + header WhatsApp (claro) */}
      <div className="bg-[#F0F2F5] flex-shrink-0">
        <StatusBar variant="dark" />
        <ChatHeader status={headerStatus} />
      </div>

      {/* Banner de demonstração */}
      <div className="bg-[#FFF4D6] text-[#8A6D00] text-[10.5px] text-center py-1 flex-shrink-0 border-b border-[#F0E3B0]">
        🟡 Demonstração — não é o atendimento oficial do Bradesco
      </div>

      {/* Progresso da jornada — dá sensação de avanço durante a conversa */}
      <div className="flex-shrink-0 bg-white px-3 py-1.5 border-b border-gray-100">
        <JourneyProgress phase={phase} />
      </div>

      {/* Mensagens */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-y-auto whatsapp-bg px-3 py-3"
      >
        {messages
          .filter((m) => !(m.role === 'assistant' && m.content === ''))
          .map((m) => (
            <MessageBubble key={m.id} message={m} />
          ))}

        {(isTyping || lastAssistantPending) && (
          <div className="flex justify-start mb-1.5 animate-fade-in">
            <div className="bg-white rounded-lg rounded-tl-sm px-3 py-2 shadow-sm">
              <TypingIndicator />
            </div>
          </div>
        )}

        {error && (
          <div className="my-2 text-xs bg-red-50 border border-red-200 text-red-700 rounded-md px-3 py-2">
            ⚠️ {error}
          </div>
        )}
      </div>

      {/* Mobile: atalho para a visão "Meus Objetivos" */}
      {onShowApp && (
        <div className="px-3 py-2 bg-white border-t border-gray-100 flex-shrink-0">
          <button
            onClick={onShowApp}
            className="w-full bg-bradesco-red hover:bg-bradesco-red-dark text-white text-sm font-semibold py-2.5 rounded-full shadow-sm transition flex items-center justify-center gap-2"
          >
            <Target className="h-4 w-4" />
            Ver Meus Objetivos
            {objectives.length > 0 && (
              <span className="bg-white/25 rounded-full px-2 leading-5 text-xs">
                {objectives.length}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Sugestões de resposta — para o cliente nunca ficar solto */}
      {showSuggestions && (
        <div className="flex-shrink-0 bg-white border-t border-gray-100 px-3 py-2 flex flex-wrap gap-1.5">
          {suggestions.map((s) => (
            <button
              key={s.label}
              onClick={() => sendMessage(s.text)}
              className="text-[12px] px-3 py-1.5 rounded-full bg-bradesco-50 text-bradesco-red border border-bradesco-100 hover:bg-bradesco-100 transition"
            >
              {s.label}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex-shrink-0 pb-6">
        <ChatInput
          onSend={sendMessage}
          disabled={isStreaming}
          placeholder={isStreaming ? 'Aguarde a Bia responder…' : 'Mensagem'}
        />
      </div>
    </div>
  );
}
