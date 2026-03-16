import ConversationItem from "./ConversationItem";
import { useConversations } from "../../../queries/conversation.query";
import { CHAT_AI_AGENT_ID } from "../../../utils/constant.util";
import styles from "./ConversationList.module.scss";

interface ConversationListProps {
  activeId: string | null;
  onSelect: (id: string) => void;
}

export default function ConversationList({
  activeId,
  onSelect,
}: ConversationListProps) {
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useConversations();

  const conversations = (data?.pages.flatMap((p) => p.items) ?? []).filter(
    (c) => c.partner.id !== CHAT_AI_AGENT_ID
  );

  return (
    <div
      className={styles.container}
      onScroll={(e) => {
        const el = e.currentTarget;
        if (
          el.scrollTop + el.clientHeight >= el.scrollHeight - 20 &&
          hasNextPage &&
          !isFetchingNextPage
        ) {
          fetchNextPage();
        }
      }}
    >
      <div className={styles.list}>
        {conversations.map((c) => (
          <ConversationItem
            key={c.id}
            data={c}
            active={c.id === activeId}
            onClick={() => onSelect(c.id)}
          />
        ))}

        {isFetchingNextPage && (
          <div className={styles.loading}>
            Đang tải thêm...
          </div>
        )}
      </div>
    </div>
  );
}
