import {
  ChevronLeft,
  Download,
  GraduationCap,
  RotateCcw,
  Sparkles,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { BiaAvatar } from '@/components/BiaAvatar';
import { ObjectiveCard } from '@/components/cards/ObjectiveCard';
import { JourneyProgress } from '@/components/JourneyProgress';
import { StatusBar } from '@/components/phone/StatusBar';
import { useObjectivesSync } from '@/hooks/useObjectives';
import { useSessionStore } from '@/store/sessionStore';
import { deriveJourneyPhase } from '@/lib/journey';
import { PRODUTO_ICONE, PRODUTO_LABEL, PRIORIDADE_BADGE } from '@/lib/cross-sell';

interface AppViewProps {
  /** Mobile: callback para voltar à conversa. Ausente no desktop. */
  onShowChat?: () => void;
}

/** Visão "app Bradesco" — Meus Objetivos. Preenche ao vivo durante a conversa. */
export function AppView({ onShowChat }: AppViewProps) {
  const navigate = useNavigate();
  const sessionId = useSessionStore((s) => s.sessionId);
  const startedAt = useSessionStore((s) => s.startedAt);
  const messages = useSessionStore((s) => s.messages);
  const educationTopics = useSessionStore((s) => s.educationTopics);
  const crossSells = useSessionStore((s) => s.crossSells);
  const outOfScopeNotes = useSessionStore((s) => s.outOfScopeNotes);
  const endedByBia = useSessionStore((s) => s.endedByBia);
  const reset = useSessionStore((s) => s.reset);
  const objectives = useObjectivesSync();

  const phase = deriveJourneyPhase({ messages, objectives, endedByBia });

  const dateLabel = startedAt
    ? new Date(startedAt).toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'long',
      })
    : 'sessão atual';

  function exportJson() {
    const payload = {
      session_id: sessionId,
      generated_at: new Date().toISOString(),
      objectives,
      education_topics: educationTopics,
      cross_sell_opportunities: crossSells,
      out_of_scope_notes: outOfScopeNotes,
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `bia-objetivos-${sessionId?.slice(0, 8) ?? 'sessao'}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  function restart() {
    if (window.confirm('Reiniciar? Vamos começar uma nova conversa do zero.')) {
      reset();
      navigate('/');
    }
  }

  return (
    <div className="flex flex-col h-full bg-bradesco-surface">
      {/* Header estilo app Bradesco */}
      <div className="bg-gradient-to-br from-bradesco-red via-bradesco-red to-bradesco-red-darker flex-shrink-0">
        <StatusBar variant="light" />
        <header className="text-white px-3.5 pt-0.5 pb-4">
          <div className="flex items-center gap-2">
            {onShowChat && (
              <button
                onClick={onShowChat}
                className="p-1 -ml-1 rounded-full hover:bg-white/15 transition"
                aria-label="Voltar à conversa"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}
            <span className="text-[15px] font-bold tracking-tight">
              Bradesco
            </span>
            <span className="flex-1" />
            <BiaAvatar size="sm" ring />
          </div>
          <div className="mt-3 flex items-end justify-between">
            <div>
              <h1 className="text-[22px] font-bold leading-tight">
                Meus Objetivos
              </h1>
              <p className="text-white/70 text-[12px] leading-tight mt-0.5">
                Sessão de {dateLabel} · com a Bia
              </p>
            </div>
          </div>
        </header>
      </div>

      {/* Conteúdo scrollável */}
      <div className="flex-1 overflow-y-auto px-3.5 py-3.5 space-y-3.5 pb-9">
        {/* Progresso da jornada */}
        <div className="bg-white rounded-2xl shadow-card border border-gray-100 p-3.5">
          <JourneyProgress phase={phase} />
        </div>

        {/* Resumo numérico */}
        <div className="grid grid-cols-3 gap-2.5">
          <StatChip emoji="🎯" n={objectives.length} label="objetivos" />
          <StatChip emoji="🎓" n={educationTopics.length} label="conceitos" />
          <StatChip emoji="💼" n={crossSells.length} label="oportun." />
        </div>

        {/* Objetivos */}
        {objectives.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-7 text-center shadow-card">
            <div className="text-3xl mb-1.5">🎯</div>
            <p className="text-[13px] text-gray-500 leading-relaxed">
              Conforme você conversa com a Bia, seus objetivos aparecem aqui —
              estruturados pelo método <strong>CFP</strong> e prontos para a
              próxima etapa.
            </p>
          </div>
        ) : (
          <section className="space-y-2.5">
            <SectionTitle>Objetivos de vida</SectionTitle>
            {objectives.map((o) => (
              <ObjectiveCard key={o.id} objective={o} />
            ))}
          </section>
        )}

        {/* Educação financeira — destaque */}
        {educationTopics.length > 0 && (
          <section className="rounded-2xl bg-white shadow-card border border-emerald-100 overflow-hidden">
            <div className="bg-emerald-50 px-3.5 py-2.5 flex items-center gap-1.5 border-b border-emerald-100">
              <GraduationCap className="h-4 w-4 text-emerald-700" />
              <h2 className="text-[13px] font-bold text-emerald-900">
                O que você aprendeu nesta jornada
              </h2>
            </div>
            <ul className="p-3.5 space-y-3">
              {educationTopics.map((t) => (
                <li key={t.id} className="flex gap-2.5">
                  <span className="h-5 w-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">
                    ✓
                  </span>
                  <div>
                    <div className="text-[13px] font-bold text-bradesco-ink">
                      {t.topico}
                    </div>
                    {t.resumo && (
                      <div className="text-[12px] text-gray-600 leading-snug mt-0.5">
                        {t.resumo}
                      </div>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Cross-sell — inteligência comercial (gerente de conta) */}
        {crossSells.length > 0 && (
          <section className="rounded-2xl bg-bradesco-ink text-white shadow-card overflow-hidden">
            <div className="px-3.5 py-2.5 border-b border-white/10">
              <h2 className="text-[13px] font-bold flex items-center gap-1.5">
                💼 Oportunidades para o gerente
              </h2>
              <p className="text-[10.5px] text-gray-400 mt-0.5">
                Inteligência comercial detectada pela Bia — <strong>não</strong>{' '}
                foi oferecida ao cliente na conversa.
              </p>
            </div>
            <ul className="p-3 space-y-2">
              {crossSells.map((c) => (
                <li
                  key={c.id}
                  className="bg-white/[0.06] rounded-xl p-2.5 text-[12px]"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold flex items-center gap-1.5">
                      <span>{PRODUTO_ICONE[c.produto]}</span>
                      {PRODUTO_LABEL[c.produto]}
                    </span>
                    {c.prioridade && (
                      <span className="text-[10px] text-gray-300 whitespace-nowrap">
                        {PRIORIDADE_BADGE[c.prioridade]}
                      </span>
                    )}
                  </div>
                  {c.gatilho && (
                    <div className="text-gray-300 mt-1 leading-snug">
                      <span className="text-gray-500">Gatilho:</span>{' '}
                      {c.gatilho}
                    </div>
                  )}
                  {c.racional && (
                    <div className="text-gray-300 mt-0.5 leading-snug">
                      <span className="text-gray-500">Racional:</span>{' '}
                      {c.racional}
                    </div>
                  )}
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Notas fora de escopo */}
        {outOfScopeNotes.length > 0 && (
          <section className="rounded-2xl bg-white shadow-card border border-amber-100 overflow-hidden">
            <div className="bg-amber-50 px-3.5 py-2.5 border-b border-amber-100">
              <h2 className="text-[12px] font-bold text-amber-900 uppercase tracking-wide">
                Para a etapa de planejamento financeiro
              </h2>
            </div>
            <ul className="p-3.5 space-y-1.5 text-[13px] text-gray-700">
              {outOfScopeNotes.map((n, i) => (
                <li key={i} className="flex gap-2">
                  <span className="text-amber-500">•</span>
                  <span>{n}</span>
                </li>
              ))}
            </ul>
          </section>
        )}

        {/* Fechamento — fronteira final */}
        {endedByBia && (
          <div className="rounded-2xl bg-gradient-to-br from-blue-600 to-blue-700 text-white p-3.5 shadow-card">
            <h2 className="text-[13px] font-bold mb-1 flex items-center gap-1.5">
              <Sparkles className="h-4 w-4" />
              Jornada concluída
            </h2>
            <p className="text-[12px] text-blue-50 leading-relaxed">
              Esta é a entrega da <strong>Etapa 2</strong> do planejamento
              financeiro. O próximo passo é a <strong>análise do fluxo de
              caixa</strong> — ver como tornar estes objetivos viáveis. Essa é
              a fronteira final do atendimento da Bia.
            </p>
          </div>
        )}

        {/* Ações */}
        <footer className="flex gap-2.5 pt-1">
          <button
            onClick={exportJson}
            disabled={objectives.length === 0}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-white border border-gray-200 text-bradesco-ink font-semibold text-[13px] py-2.5 rounded-xl shadow-card hover:bg-gray-50 disabled:opacity-50 transition"
          >
            <Download className="h-4 w-4" />
            Exportar JSON
          </button>
          <button
            onClick={restart}
            className="flex-1 inline-flex items-center justify-center gap-1.5 bg-bradesco-red hover:bg-bradesco-red-dark text-white font-semibold text-[13px] py-2.5 rounded-xl shadow-card transition"
          >
            <RotateCcw className="h-4 w-4" />
            Reiniciar
          </button>
        </footer>
      </div>
    </div>
  );
}

function StatChip({
  emoji,
  n,
  label,
}: {
  emoji: string;
  n: number;
  label: string;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-card px-2 py-2.5 text-center">
      <div className="text-lg leading-none">{emoji}</div>
      <div className="text-xl font-bold text-bradesco-ink mt-1 leading-none">
        {n}
      </div>
      <div className="text-[10.5px] text-gray-500 mt-0.5">{label}</div>
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-[12px] font-bold text-gray-500 uppercase tracking-wide px-0.5">
      {children}
    </h2>
  );
}
