import { useEffect, useRef } from "react";
import { useMessages } from "../../queries/message.query";
import { Socket } from "socket.io-client";
import { useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { PATH } from "../../utils/path.util";
import { useAuthStore } from "../../store/auth.store";
import { Avatar, Tooltip } from "antd";
import { UserOutlined } from "@ant-design/icons";
import ChatProductCard from "./common/ChatProductCard";

interface ChatMessagesProps {
  socket: Socket;
  conversationId: string;
}

export default function ChatMessages({
  socket,
  conversationId,
}: ChatMessagesProps) {
  const queryClient = useQueryClient();
  const currentUser = useAuthStore((state) => state.user);
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessages(conversationId);

  const messages =
    data?.pages
      .slice()
      .reverse()
      .flatMap((p) => p.items) ?? [];
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!conversationId) return;

    socket.emit("join_conversation", conversationId);

    return () => {
      socket.emit("leave_conversation", conversationId);
    };
  }, [conversationId, socket]);

  useEffect(() => {
    const onNewMessage = (msg: any) => {
      if (msg.conversationId !== conversationId) return;

      console.log("📩 realtime message", msg);

      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old || !old.pages || old.pages.length === 0) return old;

        const newPages = [...old.pages];
        const firstPage = { ...newPages[0] };
        firstPage.items = [...firstPage.items, msg];
        newPages[0] = firstPage;

        return {
          ...old,
          pages: newPages,
        };
      });
    };

    socket.on("new_message", onNewMessage);

    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [conversationId, socket, queryClient]);

  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages.length]);

  return (
    <div
      ref={containerRef}
      style={{
        flex: 1,
        overflowY: "auto",
        padding: "16px 12px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
      }}
      onScroll={(e) => {
        const el = e.currentTarget;
        if (el.scrollTop < 50 && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
    >
      {isFetchingNextPage && (
        <div style={{ textAlign: "center", fontSize: 12, color: "#999" }}>
          Đang tải...
        </div>
      )}

      <div style={{ flex: 1 }} />

      {messages.map((m: any) => {
        const isMe = m.senderId === currentUser?.id;
        const products = m.metadata?.products?.[0]?.result?.items || [];

        return (
          <div
            key={m.id}
            style={{
              display: "flex",
              flexDirection: isMe ? "row-reverse" : "row",
              gap: 8,
              alignItems: "flex-end",
            }}
          >
            <Tooltip title={m.sender.fullName}>
              <Avatar
                size={32}
                src={m.sender.avatarUrl}
                icon={<UserOutlined />}
                style={{ flexShrink: 0 }}
              />
            </Tooltip>

            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: isMe ? "flex-end" : "flex-start",
                maxWidth: "75%",
              }}
            >
              <div
                style={{
                  padding: "8px 12px",
                  borderRadius: "16px",
                  borderBottomRightRadius: isMe ? "4px" : "16px",
                  borderBottomLeftRadius: isMe ? "16px" : "4px",
                  background: isMe ? "#1890ff" : "#f0f2f5",
                  color: isMe ? "#fff" : "#000",
                  fontSize: "14px",
                  boxShadow: "0 1px 2px rgba(0,0,0,0.1)",
                }}
              >
                <div>{m.content}</div>
              </div>

              {m.isRead && isMe && (
                <small
                  style={{ fontSize: "10px", color: "#8c8c8c", marginTop: 2 }}
                >
                  Đã xem
                </small>
              )}

              {products.length > 0 && (
                <div
                  style={{
                    display: "flex",
                    gap: 12,
                    overflowX: "auto",
                    paddingBottom: 8,
                    paddingTop: 8,
                    width: "100%",
                  }}
                >
                  {products.map((p: any) => (
                    <div key={p.id} style={{ minWidth: 160 }}>
                      <ChatProductCard product={p} />
                    </div>
                  ))}
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      padding: "0 12px",
                      background: "#f9f9f9",
                      borderRadius: 8,
                      fontSize: 12,
                      whiteSpace: "nowrap",
                      cursor: "pointer",
                      border: "1px solid #eee",
                    }}
                  >
                    <Link to={`/${PATH.PRODUCTS}`}>Xem thêm</Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
