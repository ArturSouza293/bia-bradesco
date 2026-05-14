import { useEffect } from 'react';
import { useSessionStore } from '@/store/sessionStore';
import type { Objective, EducationTopic } from '@/types/objective';

interface ObjectivesResponse {
  objectives: Objective[];
  education_topics: EducationTopic[];
  out_of_scope_notes: string[];
}

/**
 * Sincroniza objetivos, conceitos de educação financeira e notas
 * fora de escopo com o servidor. Usado ao montar o Dashboard para
 * garantir consistência mesmo que algum evento SSE tenha se perdido.
 */
export function useObjectivesSync() {
  const sessionId = useSessionStore((s) => s.sessionId);
  const objectives = useSessionStore((s) => s.objectives);
  const hydrate = useSessionStore((s) => s.hydrateFromServer);

  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch(
          `/api/objectives?session_id=${encodeURIComponent(sessionId)}`,
        );
        if (!res.ok) return;
        const data = (await res.json()) as ObjectivesResponse;
        if (cancelled) return;
        hydrate({
          objectives: data.objectives ?? [],
          educationTopics: data.education_topics ?? [],
          outOfScopeNotes: data.out_of_scope_notes ?? [],
        });
      } catch {
        // silencioso — front mantém o que tem em memória
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId, hydrate]);

  return objectives;
}
