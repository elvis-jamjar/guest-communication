import { create } from "zustand";

// chat bot store
interface ChatBotState {
  isOpen: boolean;
  toggleIsOpen: () => void;
}

export const useChatBotStore = create<ChatBotState>()((set) => ({
  isOpen: false,
  toggleIsOpen: () => set((state) => ({ isOpen: !state.isOpen })),
}));
