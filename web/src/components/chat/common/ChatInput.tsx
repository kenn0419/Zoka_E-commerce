import { SendOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";
import type { Socket } from "socket.io-client";
import { useChatStore } from "../../../store/chat.store";
import styles from "./ChatInput.module.scss";

interface ChatInputProps {
  socket: Socket;
  conversationId?: string;
  onSend?: (content: string) => void;
}

export default function ChatInput({
  socket,
  conversationId,
  onSend,
}: ChatInputProps) {
  const [value, setValue] = useState("");
  const { activeConversationId, pendingPartner, setActiveConversationId } = useChatStore();

  const send = () => {
    if (!value.trim()) return;

    if (onSend) {
      onSend(value);
      setValue("");
      return;
    }

    const payload: any = {
      content: value,
    };

    const targetConversationId = conversationId || activeConversationId;

    if (targetConversationId) {
      payload.conversationId = targetConversationId;
    } else if (pendingPartner) {
      payload.receiverId = pendingPartner.id;
    } else {
      console.warn("⚠️ Cannot send message: No conversationId or pendingPartner");
      return;
    }

    console.log("📤 Sending message", payload);
    socket.emit("send_message", payload, (response: any) => {
      console.log("📩 Send response", response);
      if (response?.status === "ok" && response?.conversationId) {
        if (!targetConversationId) {
          setActiveConversationId(response.conversationId);
        }
      } else if (response?.error) {
        console.error("❌ Send failed:", response.error);
      }
    });

    setValue("");
  };

  return (
    <div className={styles.wrapper}>
      <Input
        className={styles.input}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={send}
        placeholder="Nhập tin nhắn..."
      />
      <Button
        className={styles.button}
        icon={<SendOutlined />}
        onClick={send}
        type="primary"
      />
    </div>
  );
}
