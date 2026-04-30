import { create } from 'zustand'

type Msg = { role: 'user' | 'assistant'; content: string }

type ChatState = { sessionId?: number; messages: Msg[]; add: (m: Msg) => void; setSession: (id: number) => void }

export const useChatStore = create<ChatState>((set) => ({
  sessionId: undefined,
  messages: [{ role: 'assistant', content: 'Describe your automation to begin.' }],
  add: (m) => set((s) => ({ messages: [...s.messages, m] })),
  setSession: (id) => set({ sessionId: id }),
}))
