import { create } from "zustand";

interface IChatPartner {
  id: string;
  fullName: string;
  avatarUrl: string;
}

interface ChatState {
  isOpen: boolean;
  activeConversationId: string | null;
  pendingPartner: IChatPartner | null;
  setOpen: (isOpen: boolean) => void;
  setActiveConversationId: (id: string | null) => void;
  setPendingPartner: (partner: IChatPartner | null) => void;
  openChatWithConversation: (conversationId: string) => void;
  openChatWithPartner: (partner: IChatPartner) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  isOpen: false,
  activeConversationId: null,
  pendingPartner: null,
  setOpen: (isOpen) => set({ isOpen }),
  setActiveConversationId: (id) => set({ activeConversationId: id, pendingPartner: null }),
  setPendingPartner: (partner) => set({ pendingPartner: partner, activeConversationId: null }),
  openChatWithConversation: (conversationId) =>
    set({ isOpen: true, activeConversationId: conversationId, pendingPartner: null }),
  openChatWithPartner: (partner) =>
    set({ isOpen: true, pendingPartner: partner, activeConversationId: null }),
}));
