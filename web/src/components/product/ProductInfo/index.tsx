import { Rate } from "antd";
import styles from "./ProductInfo.module.scss";

interface ProductInfoProps {
  product: IProductDetailResponse;
  originalPrice: number;
  displayPrice: number;
  isFlashSale: boolean;
}

export default function ProductInfo({
  product,
  originalPrice,
  displayPrice,
  isFlashSale,
}: ProductInfoProps) {
  return (
    <div className={styles.info}>
      <h1 className={styles.name}>{product.name}</h1>
      <div className={styles.rating}>
        <Rate value={product.avgRating} />
        <span>{`(${product.avgRating})`}</span>
      </div>

      <div className={styles.price}>
        {isFlashSale && (
          <span className={styles.old}>{originalPrice.toLocaleString()}</span>
        )}
        <span className={styles.new}>{displayPrice.toLocaleString()}</span>
        {isFlashSale && (
          <span className={styles.rateDifference}>
            {Math.round((displayPrice / originalPrice) * 100)}% savings
          </span>
        )}
      </div>
    </div>
  );
}
