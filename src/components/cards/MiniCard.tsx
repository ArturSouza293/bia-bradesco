import { cn } from '@/lib/utils';
import {
  perfilColor,
  perfilEmoji,
} from '@/lib/risk-profile';
import type { Objective } from '@/types/objective';

interface MiniCardProps {
  objective: Objective;
  onClick?: () => void;
  layout?: 'horizontal' | 'compact';
}

const PRIORIDADE_BADGE: Record<string, string> = {
  alta: '🔴 Alta',
  media: '🟡 Média',
  baixa: '🟢 Baixa',
};

export function MiniCard({ objective, onClick, layout = 'compact' }: MiniCardProps) {
  const pronto = objective.completude_score >= 80;

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'text-left rounded-lg border bg-white shadow-sm px-3 py-2.5 transition',
        'hover:shadow-md hover:border-bradesco-red/30 active:scale-[0.99]',
        pronto ? 'border-gray-200' : 'border-dashed border-gray-300',
        layout === 'horizontal' ? 'min-w-[200px] max-w-[240px] flex-shrink-0' : 'w-full',
      )}
    >
      <div className="flex items-start gap-2">
        <div className="text-2xl leading-none mt-0.5" aria-hidden>
          {objective.icone ?? '🎯'}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1.5">
            <h3 className="text-sm font-semibold text-gray-900 truncate">
              {objective.titulo_curto}
            </h3>
            <span className="text-[10px] font-medium text-gray-500 whitespace-nowrap">
              {PRIORIDADE_BADGE[objective.prioridade]}
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-[11px]">
            {objective.perfil_risco_sugerido && (
              <span
                className={cn(
                  'px-1.5 py-0.5 rounded-full font-medium',
                  perfilColor[objective.perfil_risco_sugerido],
                )}
              >
                {perfilEmoji[objective.perfil_risco_sugerido]}
              </span>
            )}
            <span className="text-gray-500">
              {pronto ? 'Pronto' : 'Em construção'}
            </span>
          </div>
          {/* Barra de completude */}
          <div className="mt-1.5 h-1 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={cn(
                'h-full transition-all',
                pronto ? 'bg-green-500' : 'bg-yellow-400',
              )}
              style={{ width: `${objective.completude_score}%` }}
            />
          </div>
        </div>
      </div>
    </button>
  );
}
