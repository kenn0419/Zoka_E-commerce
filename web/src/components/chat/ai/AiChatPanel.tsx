import { useEffect, useState } from "react";
import type { Socket } from "socket.io-client";
import { connectSocket } from "../../../services/socket.service";
import { conversationService } from "../../../services/conversation.service";
import ChatPanel from "../common/ChatPanel";
import AiChatMessages from "./AiChatMessages";
import { Modal, Spin } from "antd";
import { RobotOutlined } from "@ant-design/icons";

interface AiChatPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function AiChatPanel({ open, onClose }: AiChatPanelProps) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!open) return;

    const s = connectSocket();
    setSocket(s);

    const init = async () => {
      try {
        const conv = await conversationService.fetchAiConversation();
        setConversationId(conv.id);
      } catch (error) {
        console.error("Failed to fetch AI conversation", error);
      } finally {
        setLoading(false);
      }
    };

    init();

    return () => {
      s.disconnect();
    };
  }, [open]);

  return (
    <Modal
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <RobotOutlined style={{ color: "#1890ff" }} />
          <span>Zoka AI Assistant</span>
        </div>
      }
      open={open}
      onCancel={onClose}
      footer={null}
      width={450}
      styles={{ body: { height: 500, padding: 0 } }}
      centered
    >
      {loading ? (
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100%" }}>
          <Spin tip="Đang kết nối với trợ lý AI..." />
        </div>
      ) : socket && conversationId ? (
        <ChatPanel
          socket={socket}
          conversationId={conversationId}
          partnerName="Zoka AI Assistant"
          MessagesComponent={AiChatMessages}
        />
      ) : (
        <div style={{ padding: 20, textAlign: "center" }}>
          Không thể kết nối với AI. Vui lòng thử lại sau.
        </div>
      )}
    </Modal>
  );
}
