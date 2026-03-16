import { Avatar, Badge } from "antd";
import styles from "./ConversationItem.module.scss";
import clsx from "clsx";
import dayjs from "dayjs";

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
      className={clsx(styles.wrapper, { [styles.active]: active })}
      onClick={onClick}
    >
      <Badge count={data.unreadCount} offset={[-2, 32]}>
        <Avatar src={data.partner.avatarUrl} size={48}>
          {data.partner.fullName[0]}
        </Avatar>
      </Badge>

      <div className={styles.content}>
        <div className={styles.top}>
          <div className={styles.name}>{data.partner.fullName}</div>
          <div className={styles.time}>
            {data.updatedAt ? dayjs(data.updatedAt).format("HH:mm") : ""}
          </div>
        </div>

        <div className={styles.bottom}>
          <div className={styles.lastMessage}>
            {data.lastMessage?.content ?? "Chưa có tin nhắn"}
          </div>
        </div>
      </div>
    </div>
  );
}
