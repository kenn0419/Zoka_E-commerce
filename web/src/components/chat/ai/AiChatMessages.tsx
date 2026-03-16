import { useEffect, useRef, useState } from "react";
import { useMessages } from "../../../queries/message.query";
import { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import ChatProductCard from "../common/ChatProductCard";
import { Link } from "react-router-dom";
import { PATH } from "../../../utils/path.util";
import { CHAT_AI_AGENT_ID } from "../../../utils/constant.util";
import { RobotOutlined } from "@ant-design/icons";
import styles from "./AiChatMessages.module.scss";
import commonStyles from "../common/ChatMessages.module.scss";
import clsx from "clsx";

interface AiChatMessagesProps {
  socket: Socket;
  conversationId: string;
}

export default function AiChatMessages({
  socket,
  conversationId,
}: AiChatMessagesProps) {
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessages(conversationId);

  const [isThinking, setIsThinking] = useState(false);

  const messages =
    data?.pages
      .slice()
      .reverse()
      .flatMap((p) => p.items) ?? [];
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ Socket Listeners
  useEffect(() => {
    if (!socket || !conversationId) return;

    const onNewMessage = (msg: any) => {
      if (msg.conversationId !== conversationId) return;

      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old || !old.pages || old.pages.length === 0) return old;

        const newPages = [...old.pages];
        const firstPage = { ...newPages[0] };
        firstPage.items = [...firstPage.items, msg];
        newPages[0] = firstPage;

        return { ...old, pages: newPages };
      });
    };

    const onAiThinking = (data: { conversationId: string; thinking: boolean }) => {
      if (data.conversationId === conversationId) {
        setIsThinking(data.thinking);
      }
    };

    socket.on("new_message", onNewMessage);
    socket.on("ai_thinking", onAiThinking);

    return () => {
      socket.off("new_message", onNewMessage);
      socket.off("ai_thinking", onAiThinking);
    };
  }, [conversationId, socket, queryClient]);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length, isThinking]);

  return (
    <div
      ref={containerRef}
      className={commonStyles.container}
      onScroll={(e) => {
        const el = e.currentTarget;
        if (el.scrollTop < 50 && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
    >
      {isFetchingNextPage && <div className={commonStyles.loading}>Đang tải tin nhắn cũ...</div>}

      <div style={{ flex: 1 }} />

      {messages.map((m: any) => {
        const isAi = m.senderId === CHAT_AI_AGENT_ID;
        const products = m.metadata?.products?.[0]?.result?.items || [];
        const isError = m.metadata?.type === "error";

        return (
          <div
            key={m.id}
            className={clsx(commonStyles.messageWrapper, {
              [commonStyles.isMe]: !isAi,
              [commonStyles.isPartner]: isAi,
              [styles.aiBubble]: isAi,
              [styles.errorBubble]: isError,
            })}
          >
            {isAi && (
              <div className={commonStyles.avatar}>
                <RobotOutlined style={{ fontSize: 24, color: isError ? "#f5222d" : "#1890ff" }} />
              </div>
            )}

            <div className={commonStyles.messageContent}>
              <div className={commonStyles.bubble}>
                {isAi && (
                  <div className={styles.senderInfo}>
                    <RobotOutlined style={{ fontSize: 14 }} />
                    <span>Zoka AI Assistant</span>
                  </div>
                )}
                <div style={{ wordBreak: "break-word", lineHeight: 1.5 }}>{m.content}</div>
              </div>

              {products.length > 0 && (
                <div className={commonStyles.productList}>
                  {products.map((p: any) => (
                    <div key={p.id} style={{ minWidth: 160 }}>
                      <ChatProductCard product={p} />
                    </div>
                  ))}
                  <div className={commonStyles.viewMore}>
                    <Link to={`/${PATH.PRODUCTS}`}>Xem thêm</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {isThinking && (
        <div className={styles.thinking}>
          <RobotOutlined style={{ color: "#1890ff" }} />
          <div style={{ display: "flex", gap: 3 }}>
            <span className={styles.thinkingDot}>.</span>
            <span className={styles.thinkingDot}>.</span>
            <span className={styles.thinkingDot}>.</span>
          </div>
        </div>
      )}
    </div>
  );
}
