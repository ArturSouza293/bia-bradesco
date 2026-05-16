import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneShell } from '@/components/phone/PhoneShell';
import { ChatView } from '@/components/ChatView';
import { AppView } from '@/components/AppView';
import { MobileTabs } from '@/components/MobileTabs';
import { useMediaQuery } from '@/hooks/useMediaQuery';
import { useSessionStore } from '@/store/sessionStore';

/**
 * Experiência principal:
 * - Desktop (≥ 900px): dois iPhones lado a lado (conversa + app).
 * - Mobile (< 900px): UM iPhone com tabs no topo pra alternar entre
 *   "Conversa" e "Meus Objetivos". Inicia sempre na conversa.
 */
export function Workspace() {
  const navigate = useNavigate();
  const sessionId = useSessionStore((s) => s.sessionId);
  const objectives = useSessionStore((s) => s.objectives);
  const isMobile = useMediaQuery('(max-width: 899px)');
  const [tab, setTab] = useState<'chat' | 'app'>('chat');

  useEffect(() => {
    if (!sessionId) navigate('/', { replace: true });
  }, [sessionId, navigate]);

  if (!sessionId) return null;

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
