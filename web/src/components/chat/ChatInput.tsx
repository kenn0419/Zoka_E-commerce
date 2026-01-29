import { SendOutlined } from "@ant-design/icons";
import { Button, Input } from "antd";
import { useState } from "react";
import type { Socket } from "socket.io-client";

export default function ChatInput({
  socket,
  conversationId,
}: {
  socket: Socket;
  conversationId: string;
}) {
  const [value, setValue] = useState("");

  const send = () => {
    if (!value.trim()) return;
    console.log(value);
    socket.emit("send_message", {
      conversationId,
      content: value,
    });

    setValue("");
  };

  return (
    <div style={{ display: "flex", gap: 8 }}>
      <Input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onPressEnter={send}
      />
      <Button icon={<SendOutlined />} onClick={send} />
    </div>
  );
}
