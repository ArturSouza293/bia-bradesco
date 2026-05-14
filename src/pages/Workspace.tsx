import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneShell } from '@/components/phone/PhoneShell';
import { ChatView } from '@/components/ChatView';
import { AppView } from '@/components/AppView';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSessionStore } from '@/store/sessionStore';

/**
 * A experiência principal.
 * - Desktop (≥ 1280px): DOIS iPhones lado a lado — conversa + app "Meus Objetivos".
 * - Abaixo disso: UM iPhone, alternando entre conversa e app por um toggle.
 */
export function Workspace() {
  const navigate = useNavigate();
  const sessionId = useSessionStore((s) => s.sessionId);
  const isDualPhone = useMediaQuery('(min-width: 1280px)');
  const [mobileView, setMobileView] = useState<'chat' | 'app'>('chat');

  useEffect(() => {
    if (!sessionId) navigate('/', { replace: true });
  }, [sessionId, navigate]);

  if (!sessionId) return null;

  if (isDualPhone) {
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

  return (
    <div className="phone-stage">
      <PhoneShell>
        {mobileView === 'chat' ? (
          <ChatView onShowApp={() => setMobileView('app')} />
        ) : (
          <AppView onShowChat={() => setMobileView('chat')} />
        )}
      </PhoneShell>
    </div>
  );
}
