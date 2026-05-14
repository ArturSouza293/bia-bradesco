import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import type { Objective } from '@/types/objective';

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
  messages: UIMessage[];
  objectives: Objective[];
  outOfScopeNotes: string[];
  isStreaming: boolean;
  isTyping: boolean;        // controlado pelos openers (delay artificial)
  error: string | null;
  endedByBia: boolean;       // Bia sinalizou encerramento
}

interface SessionActions {
  setSession: (params: { id: string; started_at: string }) => void;
  setStatus: (s: SessionState['sessionStatus']) => void;
  addMessage: (m: UIMessage) => void;
  appendToLastAssistant: (delta: string) => void;
  upsertObjective: (o: Objective) => void;
  addOutOfScopeNote: (n: string) => void;
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
  messages: [],
  objectives: [],
  outOfScopeNotes: [],
  isStreaming: false,
  isTyping: false,
  error: null,
  endedByBia: false,
};

export const useSessionStore = create<SessionState & SessionActions>()(
  persist(
    (set) => ({
      ...initialState,
      setSession: ({ id, started_at }) =>
        set({ sessionId: id, startedAt: started_at, sessionStatus: 'active' }),
      setStatus: (s) => set({ sessionStatus: s }),
      addMessage: (m) =>
        set((state) => ({ messages: [...state.messages, m] })),
      appendToLastAssistant: (delta) =>
        set((state) => {
          const msgs = [...state.messages];
          for (let i = msgs.length - 1; i >= 0; i--) {
            if (msgs[i].role === 'assistant') {
              msgs[i] = { ...msgs[i], content: msgs[i].content + delta };
              break;
            }
          }
          return { messages: msgs };
        }),
      upsertObjective: (o) =>
        set((state) => {
          const idx = state.objectives.findIndex((x) => x.id === o.id);
          if (idx >= 0) {
            const copy = [...state.objectives];
            copy[idx] = o;
            return { objectives: copy };
          }
          return { objectives: [...state.objectives, o] };
        }),
      addOutOfScopeNote: (n) =>
        set((state) => ({ outOfScopeNotes: [...state.outOfScopeNotes, n] })),
      setStreaming: (v) => set({ isStreaming: v }),
      setTyping: (v) => set({ isTyping: v }),
      setError: (e) => set({ error: e }),
      setEndedByBia: (v) => set({ endedByBia: v }),
      reset: () => set(initialState),
    }),
    {
      name: 'bia-bradesco-session-v1',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => ({
        sessionId: s.sessionId,
        sessionStatus: s.sessionStatus,
        startedAt: s.startedAt,
        messages: s.messages,
        objectives: s.objectives,
        outOfScopeNotes: s.outOfScopeNotes,
        endedByBia: s.endedByBia,
      }),
    },
  ),
);
