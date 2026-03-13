import { useEffect, useRef } from "react";
import { useMessages } from "../../queries/message.query";
import { Socket } from "socket.io-client";

import { useQueryClient } from "@tanstack/react-query";

export default function ChatMessages({
  socket,
  conversationId,
}: {
  socket: Socket;
  conversationId: string;
}) {
  const queryClient = useQueryClient();
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useMessages(conversationId);

  const messages = data?.pages.slice().reverse().flatMap((p) => p.items) ?? [];
  const containerRef = useRef<HTMLDivElement>(null);

  // ✅ JOIN ROOM
  useEffect(() => {
    if (!conversationId) return;

    socket.emit("join_conversation", conversationId);

    return () => {
      socket.emit("leave_conversation", conversationId);
    };
  }, [conversationId, socket]);

  // ✅ LISTEN REALTIME
  useEffect(() => {
    const onNewMessage = (msg: any) => {
      if (msg.conversationId !== conversationId) return;

      console.log("📩 realtime message", msg);
      
      queryClient.setQueryData(["messages", conversationId], (old: any) => {
        if (!old || !old.pages || old.pages.length === 0) return old;

        // Clone the pages to avoid mutating the cache directly
        const newPages = [...old.pages];
        
        // Push the new message to the END of the FIRST page (newest message at bottom)
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
