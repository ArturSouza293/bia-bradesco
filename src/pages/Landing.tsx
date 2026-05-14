import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { GraduationCap, MessageCircle, ShieldCheck, Target } from 'lucide-react';
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

          <div className="flex-1 overflow-y-auto flex flex-col items-center px-6 pb-9">
            {/* Topo: marca + tag de demo */}
            <div className="w-full flex items-center justify-between mt-1">
              <div className="text-bradesco-red font-bold tracking-tight text-lg">
                Bradesco
              </div>
              <span className="text-[10px] bg-amber-50 text-amber-700 font-semibold px-2 py-0.5 rounded-full border border-amber-200">
                Demonstração
              </span>
            </div>

            {/* Centro */}
            <div className="flex-1 flex flex-col items-center justify-center text-center gap-5 w-full">
              <div className="relative">
                <div className="absolute inset-0 -m-3 rounded-full bg-bradesco-red/10 blur-xl" />
                <BiaAvatar size="xl" className="relative" />
              </div>
              <div>
                <h1 className="text-[27px] font-bold text-bradesco-ink leading-tight">
                  Bia
                  <span className="text-gray-300 font-normal"> · </span>
                  <span className="text-bradesco-red">Objetivos de Vida</span>
                </h1>
                <p className="mt-2 text-[14.5px] text-gray-600 leading-relaxed max-w-xs mx-auto">
                  Sua planejadora <strong>CFP®</strong> para transformar
                  sonhos em metas concretas.
                </p>
              </div>

              <div className="w-full max-w-xs flex flex-col gap-2">
                <Feature
                  icon={<Target className="h-4 w-4 text-bradesco-red" />}
                  text="Descobrimos seus objetivos juntos"
                />
                <Feature
                  icon={
                    <GraduationCap className="h-4 w-4 text-emerald-600" />
                  }
                  text="Educação financeira pelo caminho"
                />
                <Feature
                  icon={<ShieldCheck className="h-4 w-4 text-blue-600" />}
                  text="Método CFP — começo, meio e fim"
                />
              </div>
            </div>

            {/* CTA */}
            <div className="w-full flex flex-col gap-2.5 mt-4">
              {error && (
                <div className="text-sm text-bradesco-red bg-bradesco-50 border border-bradesco-100 rounded-lg px-3 py-2">
                  {error}
                </div>
              )}
              <button
                onClick={startConversation}
                disabled={loading}
                className="w-full bg-bradesco-red hover:bg-bradesco-red-dark active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed text-white font-semibold text-base py-4 rounded-2xl shadow-card transition flex items-center justify-center gap-2"
              >
                <MessageCircle className="h-5 w-5" />
                {loading ? 'Iniciando…' : 'Conversar com a Bia'}
              </button>

              {sessionId && (
                <button
                  onClick={() => navigate('/app')}
                  className="text-sm text-bradesco-red font-medium hover:underline"
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

function Feature({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-2.5 bg-bradesco-surface rounded-xl px-3 py-2">
      <span className="flex-shrink-0">{icon}</span>
      <span className="text-[13px] text-gray-700">{text}</span>
    </div>
  );
}
