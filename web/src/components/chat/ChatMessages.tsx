import { useEffect, useRef } from "react";
import { useMessages } from "../../queries/message.query";
import { Socket } from "socket.io-client";

export default function ChatMessages({
  socket,
  conversationId,
}: {
  socket: Socket;
  conversationId: string;
}) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessages(conversationId);

  const messages = data?.pages.flatMap((p) => p.items) ?? [];
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ JOIN ROOM
  useEffect(() => {
    if (!conversationId) return;

    console.log("📤 join_conversation", conversationId);
    socket.emit("join_conversation", conversationId);

    return () => {
      console.log("🚪 leave_conversation", conversationId);
      socket.emit("leave_conversation", conversationId);
    };
  }, [conversationId, socket]);

  // ✅ LISTEN REALTIME
  useEffect(() => {
    const onNewMessage = (msg: any) => {
      if (msg.conversationId !== conversationId) return;

      // TODO: append message to react-query cache
      console.log("📩 realtime message", msg);
    };

    socket.on("new_message", onNewMessage);

    return () => {
      socket.off("new_message", onNewMessage);
    };
  }, [conversationId, socket]);

  // scroll bottom on first load
  useEffect(() => {
    containerRef.current?.scrollTo({
      top: containerRef.current.scrollHeight,
    });
  }, [conversationId]);

  return (
    <div
      ref={containerRef}
      style={{ flex: 1, overflowY: "auto", padding: 12 }}
      onScroll={(e) => {
        const el = e.currentTarget;
        if (el.scrollTop < 50 && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
    >
      {isFetchingNextPage && <div>Đang tải...</div>}

      {messages.map((m) => (
        <div key={m.id} style={{ marginBottom: 8 }}>
          <b>{m.sender.fullName}</b>: {m.content}
          {m.isRead && <small> · Đã xem</small>}
        </div>
      ))}
    </div>
  );
}
