import styles from "./RelatedProducts.module.scss";
import { useRelatedProductsQuery } from "../../../queries/product.query";
import ProductGrid from "../ProductGrid";
import { Skeleton } from "antd";

interface RelatedProductsProps {
  categorySlug: string;
}

export default function RelatedProducts({
  categorySlug,
}: RelatedProductsProps) {
  const { data, isLoading } = useRelatedProductsQuery(categorySlug);

  if (isLoading) return <Skeleton active />;

  return (
    <div className={styles.container}>
      <h2>Sản phẩm liên quan</h2>

      <ProductGrid
        products={data?.items ?? []}
        isLoading={isLoading}
        skeletonCount={6}
      />
    </div>
  );
}
