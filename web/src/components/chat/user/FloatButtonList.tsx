import { FloatButton } from "antd";
import { useEffect, useState } from "react";
import ChatFloatButton from "./ChatFloatButton";
import { CustomerServiceOutlined } from "@ant-design/icons";
import AiChatFloatButton from "../ai/AiChatFloatButton";
import { useChatStore } from "../../../store/chat.store";

export default function FloatButtonList() {
  const [open, setOpen] = useState(false);
  const isOpen = useChatStore((state) => state.isOpen);

  useEffect(() => {
    if (isOpen) {
      setOpen(true);
    }
  }, [isOpen]);

  return (
    <FloatButton.Group
      open={open || isOpen}
      trigger="click"
      icon={<CustomerServiceOutlined />}
      onClick={() => setOpen((prev) => !prev)}
    >
      <ChatFloatButton />
      <AiChatFloatButton />
    </FloatButton.Group>
  );
}
