import { useEffect, useState } from "react";
import { useChatStore } from "../../../store/chat.store";
import type { Socket } from "socket.io-client";
import { connectSocket } from "../../../services/socket.service";
import ConversationList from "../common/ConversationList";
import ChatPanel from "../common/ChatPanel";
import notificationSound from "../../../assets/sounds/notification_sound.wav";
import { useQueryClient } from "@tanstack/react-query";

export default function ChatPopup() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const { activeConversationId, setActiveConversationId } = useChatStore();

  const queryClient = useQueryClient();

  useEffect(() => {
    const s = connectSocket();
    setSocket(s);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg: any) => {
      queryClient.setQueryData(["conversations"], (old: any) => {
        if (!old) return old;

        return {
          ...old,
          pages: old.pages.map((page: any) => ({
            ...page,
            items: page.items.map((c: any) =>
              c.id === msg.conversationId
                ? {
                    ...c,
                    updatedAt: msg.createdAt,
                    unreadCount:
                      activeConversationId === msg.conversationId
                        ? 0
                        : (c.unreadCount || 0) + 1,
                    lastMessage: msg,
                  }
                : c,
            ),
          })),
        };
      });

      if (activeConversationId !== msg.conversationId) {
        new Audio(notificationSound).play();
      }
    };

    socket.on("new_message", onNewMessage);
    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [socket, activeConversationId, queryClient]);

  if (!socket) return <div style={{ padding: 20 }}>Đang kết nối chat...</div>;

  return (
    <div style={{ width: 800, height: 550, display: "flex", backgroundColor: "#fff", borderRadius: 4, overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.15)" }}>
      <ConversationList
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
      />
      <ChatPanel socket={socket} />
    </div>
  );
}
