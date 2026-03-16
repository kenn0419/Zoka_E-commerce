import { useNavigate } from "react-router-dom";
import styles from "./ChatProductCard.module.scss";
import { PATH } from "../../../utils/path.util";

interface ChatProductCardProps {
  product: IProductListItemResponse;
}

export default function ChatProductCard({ product }: ChatProductCardProps) {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/${PATH.PRODUCTS}/${product.slug}`);
  };

  return (
    <div className={styles.container} onClick={handleClick}>
      <img src={product.thumbnail} alt={product.name} />
      <div className={styles.info}>
        <div className={styles.name}>{product.name}</div>
        <div className={styles.price}>{product.minPrice.toLocaleString()}₫</div>
      </div>
    </div>
  );
}
