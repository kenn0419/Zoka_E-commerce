import { FloatButton, Tooltip } from "antd";
import { RobotOutlined } from "@ant-design/icons";
import { useState } from "react";
import AiChatPanel from "./AiChatPanel";

export default function AiChatFloatButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Tooltip title="Chat với AI Assistant" placement="left">
        <FloatButton
          icon={<RobotOutlined />}
          onClick={() => setOpen(true)}
          type="primary"
          style={{ bottom: 100 }}
        />
      </Tooltip>

      <AiChatPanel open={open} onClose={() => setOpen(false)} />
    </>
  );
}
