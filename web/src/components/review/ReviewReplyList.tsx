import { Button, Spin } from "antd";
import { useRepliesQuery } from "../../queries/review.query";
import styles from "../review/ProductReviewSection/ProductReviewSection.module.scss";

export default function ReviewReplyList({ reviewId }: { reviewId: string }) {
  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useRepliesQuery(reviewId);

  if (isLoading) return <Spin />;

  const replies = data?.pages.flatMap((page) => page.items) ?? [];

  return (
    <div className={styles.replyBox}>
      <div className={styles.replyTitle}>Phản hồi của Shop</div>

      {replies.map((reply: any) => (
        <div key={reply.id} className={styles.replyItem}>
          {reply.content}
        </div>
      ))}

      {hasNextPage && (
        <Button
          type="link"
          loading={isFetchingNextPage}
          onClick={() => fetchNextPage()}
        >
          Xem thêm phản hồi
        </Button>
      )}
    </div>
  );
}
