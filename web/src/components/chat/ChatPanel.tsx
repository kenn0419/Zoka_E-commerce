import { Typography } from "antd";
import ChatMessages from "./ChatMessages";
import ChatInput from "./ChatInput";
import { Socket } from "socket.io-client";

export default function ChatPanel({
  socket,
  conversationId,
}: {
  socket: Socket;
  conversationId: string | null;
}) {
  if (!conversationId) {
    return (
      <div style={{ flex: 1, textAlign: "center", paddingTop: 100 }}>
        Chọn một cuộc trò chuyện
      </div>
    );
  }

  return (
    <div
      style={{
        flex: 1,
        display: "flex",
        flexDirection: "column",
        padding: 12,
      }}
    >
      <Typography.Title level={5}>Chat</Typography.Title>

      <ChatMessages socket={socket} conversationId={conversationId} />
      <ChatInput socket={socket} conversationId={conversationId} />
    </div>
  );
}
