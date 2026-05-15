import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { PhoneShell } from '@/components/phone/PhoneShell';
import { ChatView } from '@/components/ChatView';
import { AppView } from '@/components/AppView';
import { useSessionStore } from '@/store/sessionStore';

/**
 * Experiência principal — SEMPRE dois iPhones lado a lado:
 * conversa com a Bia à esquerda + app "Meus Objetivos" à direita.
 * O CSS adapta o tamanho do bezel para caber 2 em qualquer viewport.
 */
export function Workspace() {
  const navigate = useNavigate();
  const sessionId = useSessionStore((s) => s.sessionId);

  useEffect(() => {
    if (!sessionId) navigate('/', { replace: true });
  }, [sessionId, navigate]);

  if (!sessionId) return null;

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
