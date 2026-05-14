import { useState } from 'react';
import {
  AlertTriangle,
  ChevronDown,
  Clock,
  DollarSign,
  Lock,
  LockOpen,
} from 'lucide-react';
import { cn, formatBRL, formatHorizonte } from '@/lib/utils';
import { perfilColor, perfilEmoji, perfilLabel } from '@/lib/risk-profile';
import type { Objective, Flexibilidade } from '@/types/objective';

interface ObjectiveCardProps {
  objective: Objective;
  defaultOpen?: boolean;
}

const PRIORIDADE_LABEL: Record<string, string> = {
  alta: '🔴 Alta',
  media: '🟡 Média',
  baixa: '🟢 Baixa',
};

function flexIcon(value: Flexibilidade | null) {
  if (!value) return null;
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

export function ObjectiveCard({ objective, defaultOpen = false }: ObjectiveCardProps) {
  const [open, setOpen] = useState(defaultOpen);
  const pronto = objective.completude_score >= 80;

  return (
    <article
      className={cn(
        'rounded-2xl bg-white shadow-sm border overflow-hidden',
        pronto ? 'border-gray-200' : 'border-dashed border-yellow-300',
      )}
    >
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-br from-gray-50 to-white">
        <div className="text-3xl leading-none" aria-hidden>
          {objective.icone ?? '🎯'}
        </div>
        <h2 className="flex-1 text-base font-semibold text-gray-900 truncate">
          {objective.titulo_curto}
        </h2>
        <span className="text-xs font-medium text-gray-700 whitespace-nowrap">
          {PRIORIDADE_LABEL[objective.prioridade]}
        </span>
      </div>

      <div className="px-4 pb-4 pt-2 space-y-3">
        {/* Descrição */}
        {objective.descricao && (
          <p className="text-sm text-gray-700 leading-relaxed">
            {objective.descricao}
          </p>
        )}

        {/* Valor + horizonte */}
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-2 text-gray-700">
            <DollarSign className="h-4 w-4 text-green-600" />
            <div>
              <div className="font-semibold">
                {formatBRL(objective.valor_presente_brl)}
              </div>
              <div className="text-[11px] text-gray-500">valor de hoje</div>
            </div>
          </div>
          <div className="flex items-center gap-2 text-gray-700">
            <Clock className="h-4 w-4 text-blue-600" />
            <div>
              <div className="font-semibold">
                {formatHorizonte(objective.horizonte_anos)}
              </div>
              <div className="text-[11px] text-gray-500">
                {objective.ano_alvo ? `até ${objective.ano_alvo}` : '—'}
              </div>
            </div>
          </div>
        </div>

        {/* Perfil */}
        {objective.perfil_risco_sugerido && (
          <div className="text-sm flex items-center justify-between">
            <span className="text-gray-600">Perfil sugerido</span>
            <span
              className={cn(
                'px-2 py-0.5 rounded-full font-medium text-[12px]',
                perfilColor[objective.perfil_risco_sugerido],
              )}
            >
              {perfilEmoji[objective.perfil_risco_sugerido]}{' '}
              {perfilLabel[objective.perfil_risco_sugerido]}
            </span>
          </div>
        )}

        {/* Completude */}
        <div>
          <div className="flex items-center justify-between text-[12px] text-gray-600 mb-1">
            <span>Completude</span>
            <span className="font-semibold">{objective.completude_score}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                pronto ? 'bg-green-500' : 'bg-yellow-400',
              )}
              style={{ width: `${objective.completude_score}%` }}
            />
          </div>
        </div>

        {/* Botão expandir */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full mt-1 flex items-center justify-center gap-1 text-sm text-bradesco-red font-medium py-1.5 rounded-md hover:bg-red-50 transition"
        >
          {open ? 'Ocultar detalhes' : 'Ver detalhes'}
          <ChevronDown
            className={cn(
              'h-4 w-4 transition-transform',
              open && 'rotate-180',
            )}
          />
        </button>

        {/* Expandido */}
        {open && (
          <div className="pt-2 space-y-3 text-sm border-t border-gray-100 animate-slide-up">
            {objective.modalidade && (
              <Row label="Modalidade pretendida">{objective.modalidade}</Row>
            )}
            <Row label="Flexibilidade do prazo">
              {flexIcon(objective.flexibilidade_prazo) ?? '—'}
            </Row>
            <Row label="Flexibilidade do valor">
              {flexIcon(objective.flexibilidade_valor) ?? '—'}
            </Row>
            {objective.trade_offs && (
              <Row label="Trade-offs sinalizados">{objective.trade_offs}</Row>
            )}
            {objective.observacoes_cliente && (
              <Row label="Observações">{objective.observacoes_cliente}</Row>
            )}
            {objective.sinais_atencao && objective.sinais_atencao.length > 0 && (
              <div>
                <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-1.5">
                  Sinais de atenção
                </div>
                <ul className="space-y-1">
                  {objective.sinais_atencao.map((s, i) => (
                    <li
                      key={i}
                      className="flex items-start gap-2 text-yellow-800 bg-yellow-50 border border-yellow-200 rounded-md px-2 py-1.5"
                    >
                      <AlertTriangle className="h-3.5 w-3.5 mt-0.5 flex-shrink-0" />
                      <span>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {objective.proximo_passo_planejador && (
              <Row label="Próximo passo sugerido p/ planejador">
                {objective.proximo_passo_planejador}
              </Row>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[11px] uppercase tracking-wide text-gray-500 mb-0.5">
        {label}
      </div>
      <div className="text-gray-800">{children}</div>
    </div>
  );
}
