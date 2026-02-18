import { Button, Pagination, Rate, Spin } from "antd";
import { useState } from "react";
import { useReviewsQuery } from "../../../queries/review.query";
import styles from "./ProductReviewSection.module.scss";
import ReviewItem from "../ReviewItem";

interface Props {
  avgRating?: number;
  productSlug: string;
}

const ratingOptions = [
  { value: undefined, label: "Tất cả" },
  { value: 5, label: "5 Sao" },
  { value: 4, label: "4 Sao" },
  { value: 3, label: "3 Sao" },
  { value: 2, label: "2 Sao" },
  { value: 1, label: "1 Sao" },
];

export default function ProductReviewSection({
  productSlug,
  avgRating,
}: Props) {
  const [ratingFilter, setRatingFilter] = useState<number | undefined>();
  const [page, setPage] = useState(1);
  const limit = 5;

  const { data, isLoading } = useReviewsQuery(productSlug, {
    page,
    limit,
    rating: ratingFilter,
  });

  const handleChangePage = (page: number) => {
    setPage(page);
  };

  const handleChangeRating = (value: number | undefined) => {
    setPage(1);
    setRatingFilter(value);
  };

  if (isLoading) return <Spin />;

  const averageRating = avgRating ?? 0;
  const totalReviews = data?.meta?.totalItems ?? 0;

  return (
    <div className={styles.wrapper}>
      <h2 className={styles.title}>ĐÁNH GIÁ SẢN PHẨM</h2>

      {/* Summary */}
      <div className={styles.summary}>
        <div className={styles.score}>
          <span className={styles.scoreNumber}>{averageRating.toFixed(1)}</span>
          <span className={styles.scoreTotal}>/5</span>
        </div>

        <Rate disabled allowHalf value={averageRating} />

        <div className={styles.total}>{totalReviews} đánh giá</div>
      </div>

      {/* Filter */}
      <div className={styles.filter}>
        {ratingOptions.map((item) => (
          <Button
            key={item.label}
            type={ratingFilter === item.value ? "primary" : "default"}
            onClick={() => handleChangeRating(item.value)}
          >
            {item.label}
          </Button>
        ))}
      </div>

      {/* Reviews */}
      <div className={styles.list}>
        {data?.items?.map((review: any) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </div>

      {/* Pagination */}
      {data?.meta && (
        <div className={styles.pagination}>
          <Pagination
            current={data.meta.currentPage}
            total={data.meta.totalItems}
            pageSize={limit}
            onChange={handleChangePage}
            showSizeChanger={false}
          />
        </div>
      )}
    </div>
  );
}
