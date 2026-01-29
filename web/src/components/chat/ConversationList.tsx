import ConversationItem from "./ConversationItem";
import { useConversations } from "../../queries/conversation.query";

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

  const conversations = data?.pages.flatMap((p) => p.items) ?? [];

  return (
    <div
      style={{
        width: 200,
        height: 460,
        overflowY: "auto",
        borderRight: "1px solid #eee",
      }}
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
      {conversations.map((c) => (
        <ConversationItem
          key={c.id}
          data={c}
          active={c.id === activeId}
          onClick={() => onSelect(c.id)}
        />
      ))}

      {isFetchingNextPage && (
        <div style={{ padding: 8, textAlign: "center", fontSize: 12 }}>
          Đang tải thêm...
        </div>
      )}
    </div>
  );
}
