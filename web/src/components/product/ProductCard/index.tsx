import { memo } from "react";
import { Card, Rate, Skeleton } from "antd";
import styles from "./ProductCard.module.scss";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../utils/path.util";

interface ProductCardProps {
  product: IProductListItemResponse;
}

const ProductCard = memo(function ProductCard({ product }: ProductCardProps) {
  const navigate = useNavigate();
  if (!product) {
    return <Skeleton active />;
  }

  const handleClickProduct = () => {
    navigate(`/${PATH.PRODUCTS}/${product.slug}`);
  };
  return (
    <Card
      hoverable
      className={styles.card}
      cover={<img src={product.thumbnail} alt={product.name} />}
      onClick={handleClickProduct}
    >
      <div className={styles.cardBody}>
        <h4 className={styles.title}>{product.name}</h4>
        <p className={styles.price}>{product.minPrice.toLocaleString()}₫</p>
      </div>
      <div className={styles.rating}>
        <Rate disabled allowHalf value={product.avgRating} />
        <span>({product.avgRating})</span>
      </div>
    </Card>
  );
});
export default ProductCard;
