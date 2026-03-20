import { Avatar, Rate, Button } from "antd";
import { useState, memo } from "react";
import dayjs from "dayjs";
import styles from "../ProductReviewSection/ProductReviewSection.module.scss";
import ReviewReplyList from "../ReviewReplyList";

const ReviewItem = memo(function ReviewItem({ review }: any) {
  const [showReplies, setShowReplies] = useState(false);

  return (
    <div className={styles.reviewItem}>
      <div className={styles.reviewHeader}>
        <Avatar size={40} src={review.buyer.avatarUrl} />

        <div className={styles.reviewInfo}>
          <div className={styles.name}>{review.buyer.fullName}</div>

          <div className={styles.meta}>
            <Rate disabled value={review.rating} />
            <span className={styles.date}>
              {dayjs(review.createdAt).format("DD-MM-YYYY")}
            </span>
          </div>

          {review.variantName && (
            <div className={styles.variant}>
              Phân loại: {review.variantName}
            </div>
          )}
        </div>
      </div>

      <div className={styles.content}>{review.content}</div>

      {review._count?.replies > 0 && (
        <Button type="link" onClick={() => setShowReplies(!showReplies)}>
          {showReplies
            ? "Ẩn phản hồi"
            : `Xem ${review._count.replies} phản hồi`}
        </Button>
      )}

      {showReplies && <ReviewReplyList reviewId={review.id} />}
    </div>
  );
});
export default ReviewItem;
