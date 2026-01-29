import { Avatar, Badge } from "antd";

interface ConversationItemProps {
  data: IConversationResponse;
  active?: boolean;
  onClick: () => void;
}

export default function ConversationItem({
  data,
  active,
  onClick,
}: ConversationItemProps) {
  return (
    <div
      onClick={onClick}
      style={{
        display: "flex",
        gap: 8,
        padding: 10,
        cursor: "pointer",
        background: active ? "#e6f4ff" : undefined,
        borderBottom: "1px solid #f0f0f0",
      }}
    >
      <Badge count={data.unreadCount}>
        <Avatar src={data.partner.avatarUrl}>{data.partner.fullName[0]}</Avatar>
      </Badge>

      <div style={{ flex: 1, overflow: "hidden" }}>
        <div style={{ fontWeight: 500 }}>{data.partner.fullName}</div>

        <div
          style={{
            fontSize: 12,
            color: "#888",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          {data.lastMessage?.content ?? "Chưa có tin nhắn"}
        </div>
      </div>
    </div>
  );
}
