import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GraduationCap, MessageCircle, Target } from 'lucide-react';
import { BiaAvatar } from '@/components/BiaAvatar';
import { PhoneShell } from '@/components/phone/PhoneShell';
import { StatusBar } from '@/components/phone/StatusBar';
import { useSessionStore } from '@/store/sessionStore';

export function Landing() {
  const navigate = useNavigate();
  const reset = useSessionStore((s) => s.reset);
  const setSession = useSessionStore((s) => s.setSession);
  const addMessage = useSessionStore((s) => s.addMessage);
  const setTyping = useSessionStore((s) => s.setTyping);
  const sessionId = useSessionStore((s) => s.sessionId);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startConversation() {
    setLoading(true);
    setError(null);
    try {
      reset();
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(
          (body as { error?: string }).error ?? `HTTP ${res.status}`,
        );
      }
      const data = (await res.json()) as {
        id: string;
        started_at: string;
        opening_messages: { delay_ms: number; text: string }[];
      };

      setSession({ id: data.id, started_at: data.started_at });
      navigate('/app');

      data.opening_messages.forEach((m, idx) => {
        if (m.delay_ms > 0) {
          setTimeout(() => setTyping(true), Math.max(0, m.delay_ms - 800));
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="phone-stage">
      <PhoneShell>
        <div className="flex flex-col h-full bg-white">
          <StatusBar variant="dark" />

          <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pb-10">
            {/* Topo */}
            <div className="w-full flex items-center justify-between mt-1">
              <div className="text-bradesco-red font-bold tracking-tight text-lg">
                Bradesco
              </div>
              <span className="text-[10px] bg-yellow-100 text-yellow-800 font-medium px-2 py-0.5 rounded-full border border-yellow-200">
                🟡 Demo
              </span>
            </div>

            {/* Centro */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 w-full">
              <BiaAvatar size="xl" />
              <div>
                <h1 className="text-[26px] font-bold text-gray-900 leading-tight">
                  Bia
                  <span className="text-gray-400 font-normal"> · </span>
                  <span className="text-bradesco-red">Objetivos de Vida</span>
                </h1>
                <p className="mt-2.5 text-[15px] text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Vamos transformar seus <strong>sonhos</strong> em metas
                  concretas, juntos.
                </p>
              </div>

              <div className="flex flex-col gap-2.5 text-[13px] text-gray-500 max-w-xs">
                <div className="flex items-center gap-2 justify-center">
                  <Target className="h-4 w-4 text-bradesco-red" />
                  <span>Descobrimos seus objetivos juntos</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <GraduationCap className="h-4 w-4 text-emerald-600" />
                  <span>Com educação financeira pelo caminho</span>
                </div>
                <div className="flex items-center gap-2 justify-center">
                  <MessageCircle className="h-4 w-4 text-blue-600" />
                  <span>Conversa rápida, 10–15 minutinhos</span>
                </div>
              </div>
            </div>

            {/* CTA */}
            <div className="w-full flex flex-col gap-2.5 mt-4">
              {error && (
                <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md px-3 py-2">
                  {error}
                </div>
              )}
              <button
                onClick={startConversation}
                disabled={loading}
                className="w-full bg-whatsapp-send hover:opacity-95 active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base py-4 rounded-full shadow-md transition"
              >
                {loading ? 'Iniciando…' : 'Conversar com a Bia'}
              </button>

              {sessionId && (
                <button
                  onClick={() => navigate('/app')}
                  className="text-sm text-bradesco-red hover:underline"
                >
                  Continuar conversa anterior
                </button>
              )}

              <p className="text-[10px] text-gray-400 text-center mt-1">
                Demonstração técnica — não é o atendimento oficial do Bradesco
              </p>
            </div>
          </div>
        </div>
      </PhoneShell>
    </div>
  );
}
