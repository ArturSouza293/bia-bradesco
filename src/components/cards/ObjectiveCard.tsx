import { useState } from 'react';
import {
  AlertTriangle,
  Banknote,
  ChevronDown,
  Clock,
  Lock,
  LockOpen,
} from 'lucide-react';
import { cn, formatBRL, formatHorizonte } from '@/lib/utils';
import { perfilColor, perfilEmoji, perfilLabel } from '@/lib/risk-profile';
import { CLASSE_LABEL, CLASSE_STYLE, HORIZONTE_LABEL } from '@/lib/cfp';
import type { Objective, Flexibilidade } from '@/types/objective';

interface ObjectiveCardProps {
  objective: Objective;
  defaultOpen?: boolean;
}

const PRIORIDADE_STYLE: Record<string, string> = {
  alta: 'text-bradesco-red bg-bradesco-50',
  media: 'text-amber-800 bg-amber-50',
  baixa: 'text-slate-600 bg-slate-100',
};
const PRIORIDADE_LABEL: Record<string, string> = {
  alta: 'Alta',
  media: 'Média',
  baixa: 'Baixa',
};

function flexIcon(value: Flexibilidade | null) {
  if (!value) return <span className="text-gray-400">—</span>;
  return value === 'rigido' ? (
    <span className="inline-flex items-center gap-1">
      <Lock className="h-3 w-3" /> rígido
    </span>
  ) : (
    <span className="inline-flex items-center gap-1">
      <LockOpen className="h-3 w-3" /> flexível
    </span>
  );
}

export function ObjectiveCard({
  objective,
  defaultOpen = false,
}: ObjectiveCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const pronto = objective.completude_score >= 80;

  return (
    <article className="rounded-2xl bg-white shadow-card border border-gray-100 overflow-hidden">
      {/* Cabeçalho: ícone + título + prioridade */}
      <div className="flex items-start gap-3 px-3.5 pt-3.5 pb-2.5">
        <div
          className="h-11 w-11 rounded-xl bg-bradesco-50 flex items-center justify-center text-2xl flex-shrink-0"
          aria-hidden
        >
          {objective.icone ?? '🎯'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-[15px] font-bold text-bradesco-ink leading-snug">
              {objective.titulo_curto}
            </h3>
            <span
              className={cn(
                'text-[10px] font-semibold px-1.5 py-0.5 rounded-md whitespace-nowrap mt-0.5',
                PRIORIDADE_STYLE[objective.prioridade],
              )}
            >
              {PRIORIDADE_LABEL[objective.prioridade]}
            </span>
          </div>
          {/* Classificações CFP: necessidade/desejo + horizonte */}
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            {objective.classe_objetivo && (
              <span
                className={cn(
                  'text-[10.5px] font-semibold px-2 py-0.5 rounded-full',
                  CLASSE_STYLE[objective.classe_objetivo],
                )}
              >
                {CLASSE_LABEL[objective.classe_objetivo]}
              </span>
            )}
            {objective.horizonte_classe && (
              <span className="text-[10.5px] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">
                {HORIZONTE_LABEL[objective.horizonte_classe]}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="px-3.5 pb-3.5 space-y-3">
        {objective.descricao && (
          <p className="text-[13px] text-gray-600 leading-relaxed">
            {objective.descricao}
          </p>
        )}

        {/* Valor + horizonte */}
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl bg-bradesco-surface px-3 py-2">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Banknote className="h-3.5 w-3.5" />
              valor de hoje
            </div>
            <div className="text-[15px] font-bold text-bradesco-ink mt-0.5">
              {formatBRL(objective.valor_presente_brl)}
            </div>
          </div>
          <div className="rounded-xl bg-bradesco-surface px-3 py-2">
            <div className="flex items-center gap-1.5 text-[11px] text-gray-500">
              <Clock className="h-3.5 w-3.5" />
              prazo
            </div>
            <div className="text-[15px] font-bold text-bradesco-ink mt-0.5">
              {formatHorizonte(objective.horizonte_anos)}
              {objective.ano_alvo && (
                <span className="text-[11px] font-normal text-gray-400">
                  {' '}
                  · {objective.ano_alvo}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Perfil de risco do objetivo */}
        {objective.perfil_risco_sugerido && (
          <div className="flex items-center justify-between text-[13px]">
            <span className="text-gray-500">Perfil de risco do objetivo</span>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full font-semibold text-[11.5px]',
                perfilColor[objective.perfil_risco_sugerido],
              )}
            >
              {perfilEmoji[objective.perfil_risco_sugerido]}{' '}
              {perfilLabel[objective.perfil_risco_sugerido]}
            </span>
          </div>
        )}

        {/* Completude SMART */}
        <div>
          <div className="flex items-center justify-between text-[12px] mb-1">
            <span className="text-gray-500">Completude SMART</span>
            <span
              className={cn(
                'font-bold',
                pronto ? 'text-emerald-600' : 'text-amber-600',
              )}
            >
              {objective.completude_score}%
            </span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                pronto ? 'bg-emerald-500' : 'bg-amber-400',
              )}
              style={{ width: `${objective.completude_score}%` }}
            />
          </div>
        </div>

        {/* Expandir */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex items-center justify-center gap-1 text-[13px] text-bradesco-red font-semibold py-1.5 rounded-lg hover:bg-bradesco-50 transition"
        >
          {open ? 'Ocultar detalhes' : 'Ver detalhes'}
          <ChevronDown
            className={cn('h-4 w-4 transition-transform', open && 'rotate-180')}
          />
        </button>

        {open && (
          <div className="pt-2.5 space-y-3 text-[13px] border-t border-gray-100 animate-slide-up">
            {objective.modalidade && (
              <Row label="Modalidade pretendida">{objective.modalidade}</Row>
            )}
            <div className="grid grid-cols-2 gap-3">
              <Row label="Flexibilidade do prazo">
                {flexIcon(objective.flexibilidade_prazo)}
              </Row>
              <Row label="Flexibilidade do valor">
                {flexIcon(objective.flexibilidade_valor)}
              </Row>
            </div>
            {objective.trade_offs && (
              <Row label="Trade-offs sinalizados">{objective.trade_offs}</Row>
            )}
            {objective.observacoes_cliente && (
              <Row label="Observações do cliente">
                {objective.observacoes_cliente}
              </Row>
            )}
            {objective.sinais_atencao &&
              objective.sinais_atencao.length > 0 && (
                <div>
                  <div className="text-[11px] uppercase tracking-wide text-gray-400 mb-1.5">
                    Sinais de atenção
                  </div>
                  <ul className="space-y-1">
                    {objective.sinais_atencao.map((s, i) => (
                      <li
                        key={i}
                        className="flex items-start gap-2 text-amber-800 bg-amber-50 border border-amber-200 rounded-lg px-2 py-1.5"
                      >
                        <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                        <span>{s}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            {objective.proximo_passo_planejador && (
              <Row label="Próximo passo para o planejador">
                {objective.proximo_passo_planejador}
              </Row>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-gray-400 mb-0.5">
        {label}
      </div>
      <div className="text-gray-700">{children}</div>
    </div>
  );
}
