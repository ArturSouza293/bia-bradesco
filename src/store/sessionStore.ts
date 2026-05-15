import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type {
  Objective,
  EducationTopic,
  CrossSellOpportunity,
  ClientProfile,
  User,
} from '@/types/objective';

export interface UIMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  created_at: string;
  pending?: boolean; // assistant message ainda sendo streamado
}

export interface OpeningMessage {
  delay_ms: number;
  text: string;
}

interface SessionState {
  sessionId: string | null;
  sessionStatus: 'idle' | 'active' | 'completed' | 'abandoned';
  startedAt: string | null;
  user: User | null;
  userIsReturning: boolean;
  messages: UIMessage[];
  clientProfile: ClientProfile | null;
  objectives: Objective[];
  educationTopics: EducationTopic[];
  crossSells: CrossSellOpportunity[];
  outOfScopeNotes: string[];
  isStreaming: boolean;
  isTyping: boolean; // controlado pelos openers (delay artificial)
  error: string | null;
  endedByBia: boolean; // Bia sinalizou encerramento
}

interface SessionActions {
  setSession: (params: { id: string; started_at: string }) => void;
  setStatus: (s: SessionState['sessionStatus']) => void;
  setUser: (params: { user: User; isReturning: boolean }) => void;
  addMessage: (m: UIMessage) => void;
  appendToLastAssistant: (delta: string) => void;
  setClientProfile: (p: ClientProfile) => void;
  upsertObjective: (o: Objective) => void;
  upsertEducationTopic: (t: EducationTopic) => void;
  upsertCrossSell: (c: CrossSellOpportunity) => void;
  addOutOfScopeNote: (n: string) => void;
  hydrateFromServer: (data: {
    user: User | null;
    clientProfile: ClientProfile | null;
    objectives: Objective[];
    educationTopics: EducationTopic[];
    crossSells: CrossSellOpportunity[];
    outOfScopeNotes: string[];
  }) => void;
  setStreaming: (v: boolean) => void;
  setTyping: (v: boolean) => void;
  setError: (e: string | null) => void;
  setEndedByBia: (v: boolean) => void;
  reset: () => void;
}

const initialState: SessionState = {
  sessionId: null,
  sessionStatus: 'idle',
  startedAt: null,
  user: null,
  userIsReturning: false,
  messages: [],
  clientProfile: null,
  objectives: [],
  educationTopics: [],
  crossSells: [],
  outOfScopeNotes: [],
  isStreaming: false,
  isTyping: false,
  error: null,
  endedByBia: false,
};

function upsertById<T extends { id: string }>(list: T[], item: T): T[] {
  const idx = list.findIndex((x) => x.id === item.id);
  if (idx >= 0) {
    const copy = [...list];
    copy[idx] = item;
    return copy;
  }
  return [...list, item];
}

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set) => ({
      ...initialState,
      setSession: ({ id, started_at }) =>
        set({ sessionId: id, startedAt: started_at, sessionStatus: 'active' }),
      setStatus: (s) => set({ sessionStatus: s }),
      setUser: ({ user, isReturning }) =>
        set({ user, userIsReturning: isReturning }),
      addMessage: (m) => set((state) => ({ messages: [...state.messages, m] })),
      appendToLastAssistant: (delta) =>
        set((state) => {
          const msgs = [...state.messages];
          for (let i = msgs.length - 1; i >= 0; i--) {
            if (msgs[i].role === 'assistant') {
              msgs[i] = {
                ...msgs[i],
                content: msgs[i].content + delta,
                pending: false,
              };
              break;
            }
          }
          return { messages: msgs };
        }),
      setClientProfile: (p) => set({ clientProfile: p }),
      upsertObjective: (o) =>
        set((state) => ({ objectives: upsertById(state.objectives, o) })),
      upsertEducationTopic: (t) =>
        set((state) => ({
          educationTopics: upsertById(state.educationTopics, t),
        })),
      upsertCrossSell: (c) =>
        set((state) => ({ crossSells: upsertById(state.crossSells, c) })),
      addOutOfScopeNote: (n) =>
        set((state) =>
          state.outOfScopeNotes.includes(n)
            ? {}
            : { outOfScopeNotes: [...state.outOfScopeNotes, n] },
        ),
      hydrateFromServer: (data) =>
        set({
          user: data.user,
          clientProfile: data.clientProfile,
          objectives: data.objectives,
          educationTopics: data.educationTopics,
          crossSells: data.crossSells,
          outOfScopeNotes: data.outOfScopeNotes,
        }),
      setStreaming: (v) => set({ isStreaming: v }),
      setTyping: (v) => set({ isTyping: v }),
      setError: (e) => set({ error: e }),
      setEndedByBia: (v) => set({ endedByBia: v }),
      reset: () => set(initialState),
    }),
    {
      name: 'bia-bradesco-session-v4',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        sessionId: s.sessionId,
        sessionStatus: s.sessionStatus,
        startedAt: s.startedAt,
        user: s.user,
        userIsReturning: s.userIsReturning,
        messages: s.messages,
        clientProfile: s.clientProfile,
        objectives: s.objectives,
        educationTopics: s.educationTopics,
        crossSells: s.crossSells,
        outOfScopeNotes: s.outOfScopeNotes,
        endedByBia: s.endedByBia,
      }),
    },
  ),
);
