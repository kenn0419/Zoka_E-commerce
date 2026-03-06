interface CategoryItemProps {
  category: ICategoryResponse;
}

import { Button } from "antd";
import styles from "./CategoryCard.module.scss";
import { useNavigate } from "react-router-dom";
import { PATH } from "../../../utils/path.util";

export default function CategoryCard({ category }: CategoryItemProps) {
  const navigate = useNavigate();

  const handleClickCategory = () => {
    navigate(`/${PATH.PRODUCTS}?category=${category.slug}`);
  };
  return (
    <div className={styles.card}>
      <div
        onClick={handleClickCategory}
        className={styles.background}
        style={{ backgroundImage: `url(${category.thumbnailUrl})` }}
      />

      <div className={styles.gradientOverlay} />

      <div className={styles.content}>
        <div className={styles.tagRow}>
          {category.name}
          <span>{category.slug}</span>
        </div>

        <h3>{category.name}</h3>
        <p>{category.description}</p>
      </div>

      <div className={styles.subOverlay}>
        <div className={styles.subContent}>
          <div className={styles.bigIcon}>{category.name}</div>

          <ul>
            {category?.children &&
              category.children?.map((sub, index) => (
                <li key={index}>
                  <a href={sub.name || "#"}>{sub.name}</a>
                </li>
              ))}
          </ul>

          <Button type="primary" shape="round">
            {category.name}
          </Button>
        </div>
      </div>
    </div>
  );
}
