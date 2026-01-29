import { MessageOutlined } from "@ant-design/icons";
import { Badge, FloatButton, Popover } from "antd";
import { useState } from "react";
import ChatPopup from "./ChatPopup";

export default function ChatFloatButton() {
  const [open, setOpen] = useState(false);

  return (
    <Popover
      content={<ChatPopup />}
      trigger="click"
      open={open}
      onOpenChange={setOpen}
      placement="topRight"
    >
      <FloatButton
        icon={
          <Badge dot>
            <MessageOutlined />
          </Badge>
        }
        style={{ right: 24, bottom: 24 }}
      />
    </Popover>
  );
}
