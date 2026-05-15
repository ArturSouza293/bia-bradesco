import { useEffect } from 'react';
import { useSessionStore } from '@/store/sessionStore';
import type {
  Objective,
  EducationTopic,
  CrossSellOpportunity,
  ClientProfile,
  User,
} from '@/types/objective';

interface ObjectivesResponse {
  user: User | null;
  client_profile: ClientProfile | null;
  objectives: Objective[];
  education_topics: EducationTopic[];
  cross_sell: CrossSellOpportunity[];
  out_of_scope_notes: string[];
}

/**
 * Sincroniza perfil 360°, objetivos, conceitos de educação financeira,
 * oportunidades de cross-sell e notas fora de escopo com o servidor.
 * Usado ao montar a AppView para garantir consistência mesmo que algum
 * evento SSE tenha se perdido.
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
          user: data.user ?? null,
          clientProfile: data.client_profile ?? null,
          objectives: data.objectives ?? [],
          educationTopics: data.education_topics ?? [],
          crossSells: data.cross_sell ?? [],
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
