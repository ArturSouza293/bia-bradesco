import { useEffect } from 'react';
import { useSessionStore } from '@/store/sessionStore';
import type { Objective } from '@/types/objective';

/**
 * Hook para garantir que os objetivos da sessão estão sincronizados
 * com o backend. Útil ao montar a tela de Dashboard caso o front
 * tenha perdido algum evento `objective_registered`.
 */
export function useObjectivesSync() {
  const sessionId = useSessionStore((s) => s.sessionId);
  const objectives = useSessionStore((s) => s.objectives);
  const upsert = useSessionStore((s) => s.upsertObjective);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/objectives?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as { objectives: Objective[] };
        if (cancelled) return;
        for (const o of data.objectives) upsert(o);
      } catch {
        // silencioso — front mantém o que tem
      }
    })();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId]);

  return objectives;
}
