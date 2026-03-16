import { Typography } from "antd";
import ChatInput from "./ChatInput";
import ChatMessages from "./ChatMessages";
import { Socket } from "socket.io-client";
import { useChatStore } from "../../../store/chat.store";
import styles from "./ChatPanel.module.scss";
import { MessageOutlined } from "@ant-design/icons";
import { useQueryClient } from "@tanstack/react-query";

interface ChatPanelProps {
  socket: Socket;
  conversationId?: string;
  partnerName?: string;
  MessagesComponent?: React.ComponentType<any>;
}

export default function ChatPanel({
  socket,
  conversationId: propConversationId,
  partnerName: propPartnerName,
  MessagesComponent = ChatMessages,
}: ChatPanelProps) {
  const { activeConversationId, pendingPartner } = useChatStore();
  const queryClient = useQueryClient();

  const conversationId = propConversationId || activeConversationId;

  // Resolve partner name
  let partnerName = propPartnerName || pendingPartner?.fullName;

  if (!partnerName && conversationId) {
    const conversations = queryClient.getQueryData<{
      pages: { items: any[] }[];
    }>(["conversations"]);
    
    const currentConv = conversations?.pages
      .flatMap((p) => p.items)
      .find((c) => c.id === conversationId);
      
    if (currentConv) {
      partnerName = currentConv.partner.fullName;
    }
  }

  if (!conversationId && !pendingPartner) {
    return (
      <div className={styles.empty}>
        <MessageOutlined />
        <span>Chọn một cuộc trò chuyện</span>
      </div>
    );
  }

  partnerName = partnerName || "Chat";

  return (
    <div className={styles.wrapper}>
      <div className={styles.header}>
        <Typography.Title level={5}>{partnerName}</Typography.Title>
      </div>

      <div className={styles.body}>
        {conversationId ? (
          <>
            <MessagesComponent socket={socket} conversationId={conversationId} />
            <ChatInput socket={socket} conversationId={conversationId} />
          </>
        ) : (
          <>
            <div style={{ flex: 1 }} />
            <ChatInput socket={socket} />
          </>
        )}
      </div>
    </div>
  );
}
