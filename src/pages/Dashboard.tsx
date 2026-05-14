import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, RotateCcw, Sparkles } from 'lucide-react';
import { BiaAvatar } from '@/components/BiaAvatar';
import { ObjectiveCard } from '@/components/cards/ObjectiveCard';
import { StatusBar } from '@/components/phone/StatusBar';
import { useObjectivesSync } from '@/hooks/useObjectives';
import { useSessionStore } from '@/store/sessionStore';

export function Dashboard() {
  const navigate = useNavigate();
  const sessionId = useSessionStore((s) => s.sessionId);
  const startedAt = useSessionStore((s) => s.startedAt);
  const reset = useSessionStore((s) => s.reset);
  const outOfScopeNotes = useSessionStore((s) => s.outOfScopeNotes);
  const objectives = useObjectivesSync();

  useEffect(() => {
    if (!sessionId) navigate('/', { replace: true });
  }, [sessionId, navigate]);

  const dateLabel = startedAt
    ? new Date(startedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      })
    : '';

  function exportJson() {
    const payload = {
      session_id: sessionId,
      generated_at: new Date().toISOString(),
      objectives,
      out_of_scope_notes: outOfScopeNotes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `objetivos-bia-${sessionId?.slice(0, 8) ?? 'sessao'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function restart() {
    if (
      window.confirm(
        'Reiniciar? Os cards atuais ficam salvos no banco, mas vamos começar uma nova conversa.',
      )
    ) {
      reset();
      navigate('/');
    }
  }

  if (!sessionId) return null;

  return (
    <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-white">
      {/* Status bar + header com bg vermelho contínuo */}
      <div className="bg-gradient-to-r from-bradesco-red to-bradesco-red-dark flex-shrink-0">
        <StatusBar variant="light" />
        <header className="text-white">
          <div className="flex items-center gap-3 px-4 py-3">
            <button
              onClick={() => navigate('/chat')}
              className="p-1.5 rounded-full hover:bg-white/15 active:bg-white/25 transition"
              aria-label="Voltar pro chat"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <BiaAvatar size="md" className="ring-2 ring-white/30" />
            <div className="flex-1 min-w-0">
              <h1 className="text-base font-semibold leading-tight">
                Seus objetivos
              </h1>
              <p className="text-white/80 text-[12px] leading-tight">
                {dateLabel || 'Sessão atual'}
              </p>
            </div>
          </div>
        </header>
      </div>

      {/* Conteúdo scrollável */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-4 pb-10">
        {/* Banner */}
        <div className="rounded-xl bg-blue-50 border border-blue-200 p-3 flex items-start gap-2.5">
          <Sparkles className="h-4 w-4 text-blue-700 flex-shrink-0 mt-0.5" />
          <p className="text-[12px] text-blue-900 leading-relaxed">
            <strong>Esta é a entrega desta etapa.</strong> O próximo passo —
            planejamento financeiro completo — será conduzido por um{' '}
            <strong>planejador CFP</strong>.
          </p>
        </div>

        {/* Cards (1 coluna dentro do iPhone) */}
        {objectives.length === 0 ? (
          <div className="rounded-xl border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
            Nenhum objetivo registrado nesta sessão ainda.
            <br />
            <button
              onClick={() => navigate('/chat')}
              className="mt-2 text-bradesco-red font-medium hover:underline"
            >
              Voltar para a conversa
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {objectives.map((o) => (
              <ObjectiveCard key={o.id} objective={o} />
            ))}
          </div>
        )}

        {/* Out-of-scope notes */}
        {outOfScopeNotes.length > 0 && (
          <section className="rounded-xl bg-yellow-50 border border-yellow-200 p-3">
            <h2 className="text-[12px] font-semibold text-yellow-900 mb-1.5 uppercase tracking-wide">
              Para o planejador retomar
            </h2>
            <ul className="space-y-1 text-sm text-yellow-900">
              {outOfScopeNotes.map((n, i) => (
                <li key={i} className="flex gap-2">
                  <span>•</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Footer actions */}
        <footer className="flex gap-2 pt-2">
          <button
            onClick={exportJson}
            disabled={objectives.length === 0}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white border border-gray-300 text-gray-800 font-medium text-sm py-2.5 rounded-lg hover:bg-gray-50 disabled:opacity-50 transition"
          >
            <Download className="h-4 w-4" />
            Exportar JSON
          </button>
          <button
            onClick={restart}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-bradesco-red hover:bg-bradesco-red-dark text-white font-medium text-sm py-2.5 rounded-lg transition"
          >
            <RotateCcw className="h-4 w-4" />
            Reiniciar
          </button>
        </footer>

        <p className="text-[10px] text-gray-400 text-center pt-2">
          Demonstração técnica — não é o atendimento oficial do Bradesco
        </p>
      </main>
    </div>
  );
}
