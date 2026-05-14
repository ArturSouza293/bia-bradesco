import { cn } from '@/lib/utils';
import { JOURNEY_PHASES, phaseIndex, type JourneyPhase } from '@/lib/journey';

interface JourneyProgressProps {
  phase: JourneyPhase;
}

/**
 * Stepper das 3 fases da jornada (Boas-vindas → Descoberta → Fechamento).
 * Dá ao cliente o "sentimento de progresso" — onde ele está e o que falta.
 */
export function JourneyProgress({ phase }: JourneyProgressProps) {
  const current = phaseIndex(phase);
  const currentPhase = JOURNEY_PHASES[current];

  return (
    <div>
      <div className="flex items-center gap-1.5">
        {JOURNEY_PHASES.map((p, i) => {
          const done = i < current;
          const active = i === current;
          return (
            <div
              key={p.key}
              className={cn(
                'h-1.5 flex-1 rounded-full transition-colors',
                done && 'bg-emerald-500',
                active && 'bg-bradesco-red',
                !done && !active && 'bg-gray-200',
              )}
            />
          );
        })}
      </div>
      <div className="mt-1.5 flex items-center justify-between">
        <span className="text-[11px] text-gray-400">
          Fase {current + 1} de {JOURNEY_PHASES.length}
        </span>
        <span className="text-[11px] font-semibold text-gray-700">
          {currentPhase.label}
          <span className="text-gray-400 font-normal">
            {' · '}
            {currentPhase.hint}
          </span>
        </span>
      </div>
    </div>
  );
}
