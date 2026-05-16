import { useEffect, useRef, useState } from 'react';
import { PhoneShell } from '@/components/phone/PhoneShell';
import { ChatView } from '@/components/ChatView';
import { AppView } from '@/components/AppView';
import { MobileTabs } from '@/components/MobileTabs';
import { BiaAvatar } from '@/components/BiaAvatar';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSessionStore } from '@/store/sessionStore';

/**
 * Experiência principal — sem tela intermediária. Se ainda não houver
 * sessão, cria automaticamente e mostra a conversa direto.
 *
 * - Desktop (≥ 900px): dois iPhones lado a lado (conversa + app).
 * - Mobile (< 900px): UM iPhone com tabs no topo (Conversa | Meus
 *   Objetivos), inicia sempre na conversa.
 */
export function Workspace() {
  const sessionId = useSessionStore((s) => s.sessionId);
  const setSession = useSessionStore((s) => s.setSession);
  const addMessage = useSessionStore((s) => s.addMessage);
  const setTyping = useSessionStore((s) => s.setTyping);
  const objectives = useSessionStore((s) => s.objectives);
  const isMobile = useMediaQuery('(max-width: 899px)');
  const [tab, setTab] = useState<'chat' | 'app'>('chat');
  const [startError, setStartError] = useState<string | null>(null);
  const startingRef = useRef(false);

  // Cria sessão automaticamente se não houver. O ref evita criar
  // duas sessões em React StrictMode (useEffect que roda 2x).
  useEffect(() => {
    if (sessionId || startingRef.current) return;
    startingRef.current = true;
    (async () => {
      try {
        const res = await fetch('/api/sessions', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: '{}',
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as {
          id: string;
          started_at: string;
          opening_messages: { delay_ms: number; text: string }[];
        };
        setSession({ id: data.id, started_at: data.started_at });
        data.opening_messages.forEach((m, idx) => {
          if (m.delay_ms > 0) {
            setTimeout(
              () => setTyping(true),
              Math.max(0, m.delay_ms - 800),
            );
          }
          setTimeout(() => {
            if (idx === data.opening_messages.length - 1) setTyping(false);
            addMessage({
              id: `opener-${idx}-${Date.now()}`,
              role: 'assistant',
              content: m.text,
              created_at: new Date().toISOString(),
            });
          }, m.delay_ms);
        });
      } catch (e) {
        setStartError(e instanceof Error ? e.message : 'Erro inesperado');
        startingRef.current = false; // permite retry no próximo render
      }
    })();
  }, [sessionId, setSession, addMessage, setTyping]);

  // Loading mínimo enquanto cria a sessão
  if (!sessionId) {
    return (
      <div className="phone-stage">
        <div className="text-center text-white/70">
          {startError ? (
            <>
              <div className="text-base font-semibold mb-1">
                Não consegui iniciar a conversa.
              </div>
              <div className="text-xs text-red-300">{startError}</div>
            </>
          ) : (
            <>
              <BiaAvatar size="lg" />
              <div className="mt-3 text-sm">Carregando…</div>
            </>
          )}
        </div>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="phone-stage phone-stage-mobile">
        <div className="w-full px-3 pt-2 flex-shrink-0">
          <MobileTabs
            current={tab}
            onChange={setTab}
            objectivesCount={objectives.length}
          />
        </div>
        <PhoneShell>{tab === 'chat' ? <ChatView /> : <AppView />}</PhoneShell>
      </div>
    );
  }

  return (
    <div className="phone-stage">
      <PhoneShell label="Conversa com a Bia">
        <ChatView />
      </PhoneShell>
      <PhoneShell label="App · Meus Objetivos">
        <AppView />
      </PhoneShell>
    </div>
  );
}
