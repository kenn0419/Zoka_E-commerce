import { MessageOutlined } from "@ant-design/icons";
import { Badge, FloatButton, Popover } from "antd";
import ChatPopup from "./ChatPopup";
import { useChatStore } from "../../../store/chat.store";

export default function ChatFloatButton() {
  const { isOpen, setOpen } = useChatStore();

  return (
    <Popover
      content={<ChatPopup />}
      trigger="click"
      open={isOpen}
      onOpenChange={setOpen}
      placement="leftBottom"
      overlayInnerStyle={{ padding: 0 }}
    >
      <FloatButton
        icon={
          <Badge dot={true}>
            <MessageOutlined />
          </Badge>
        }
      />
    </Popover>
  );
}
