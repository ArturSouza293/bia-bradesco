import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Target } from 'lucide-react';
import { ChatHeader } from '@/components/chat/ChatHeader';
import { MessageBubble } from '@/components/chat/MessageBubble';
import { TypingIndicator } from '@/components/chat/TypingIndicator';
import { ChatInput } from '@/components/chat/ChatInput';
import { MiniCard } from '@/components/cards/MiniCard';
import { StatusBar } from '@/components/phone/StatusBar';
import { useChat } from '@/hooks/useChat';
import { useSessionStore } from '@/store/sessionStore';
import { cn } from '@/lib/utils';

export function Chat() {
  const navigate = useNavigate();
  const sessionId = useSessionStore((s) => s.sessionId);
  const messages = useSessionStore((s) => s.messages);
  const objectives = useSessionStore((s) => s.objectives);
  const isStreaming = useSessionStore((s) => s.isStreaming);
  const isTyping = useSessionStore((s) => s.isTyping);
  const error = useSessionStore((s) => s.error);
  const endedByBia = useSessionStore((s) => s.endedByBia);

  const { sendMessage } = useChat();
  const scrollRef = useRef<HTMLDivElement>(null);
  const [mobileObjectivesOpen, setMobileObjectivesOpen] = useState(false);

  useEffect(() => {
    if (!sessionId) navigate('/', { replace: true });
  }, [sessionId, navigate]);

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

  const canShowGoToDashboard =
    objectives.length >= 1 &&
    (endedByBia || objectives.some((o) => o.completude_score >= 80));

  async function finalizeAndGoToDashboard() {
    try {
      if (sessionId) {
        await fetch(`/api/sessions/${sessionId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: 'completed' }),
        });
      }
    } catch {
      // ignora — segue pro dashboard
    }
    navigate('/dashboard');
  }

  if (!sessionId) return null;

  return (
    <div className="flex flex-col h-full bg-white">
      {/* Status bar + chat header com mesmo bg vermelho (visual contínuo) */}
      <div className="bg-gradient-to-r from-bradesco-red to-bradesco-red-dark flex-shrink-0">
        <StatusBar variant="light" />
        <ChatHeader status={headerStatus} />
      </div>

      {/* Mensagens (scroll) */}
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

      {/* Drawer de objetivos (collapsible) */}
      {objectives.length > 0 && (
        <div className="border-t border-gray-200 bg-white flex-shrink-0">
          <button
            onClick={() => setMobileObjectivesOpen((v) => !v)}
            className="w-full flex items-center justify-between px-3 py-2 text-sm text-gray-700"
          >
            <span className="flex items-center gap-2">
              <Target className="h-4 w-4 text-bradesco-red" />
              {objectives.length}{' '}
              {objectives.length === 1 ? 'objetivo' : 'objetivos'} em andamento
            </span>
            <ChevronRight
              className={cn(
                'h-4 w-4 transition-transform',
                mobileObjectivesOpen && 'rotate-90',
              )}
            />
          </button>
          {mobileObjectivesOpen && (
            <div className="px-3 pb-3 flex gap-2 overflow-x-auto">
              {objectives.map((o) => (
                <MiniCard key={o.id} objective={o} layout="horizontal" />
              ))}
            </div>
          )}
        </div>
      )}

      {/* CTA pro dashboard */}
      {canShowGoToDashboard && (
        <div className="px-3 py-2 bg-white border-t border-gray-100 flex-shrink-0">
          <button
            onClick={finalizeAndGoToDashboard}
            className="w-full bg-bradesco-red hover:bg-bradesco-red-dark text-white text-sm font-semibold py-2.5 rounded-full shadow-sm transition flex items-center justify-center gap-2"
          >
            Ver meus objetivos
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Input com espaço extra para o home indicator */}
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
