import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { connectSocket } from "../../services/socket.service";
import ConversationList from "./ConversationList";
import { Divider } from "antd";
import ChatPanel from "./ChatPanel";
import notificationSound from "../../assets/sounds/notification_sound.wav";

export default function ChatPopup() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [activeConversationId, setActiveConversationId] = useState<
    string | null
  >(null);

  const queryClient = useQueryClient();

  useEffect(() => {
    const s = connectSocket();
    setSocket(s);
  }, []);

  useEffect(() => {
    if (!socket) return;

    const onNewMessage = (msg: any) => {
      // update conversation list
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
                        : c.unreadCount + 1,
                    lastMessage: msg,
                  }
                : c,
            ),
          })),
        };
      });

      // append message realtime
      queryClient.setQueryData(["messages", msg.conversationId], (old: any) => {
        if (!old) return old;

        const lastPage = old.pages[old.pages.length - 1];
        lastPage.items.push(msg);
        return { ...old };
      });

      if (activeConversationId !== msg.conversationId) {
        new Audio(notificationSound).play();
      }
    };

    socket.on("new_message", onNewMessage);
    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [socket, activeConversationId]);

  if (!socket) return <div style={{ padding: 20 }}>Đang kết nối chat...</div>;

  return (
    <div style={{ width: 620, height: 460, display: "flex" }}>
      <ConversationList
        activeId={activeConversationId}
        onSelect={setActiveConversationId}
      />
      <Divider type="vertical" style={{ height: "100%", margin: 0 }} />
      <ChatPanel socket={socket} conversationId={activeConversationId} />
    </div>
  );
}
