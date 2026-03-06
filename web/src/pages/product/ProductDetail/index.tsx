import { useParams } from "react-router-dom";
import { useState } from "react";
import { Spin } from "antd";

import styles from "./ProductDetail.module.scss";
import ProductGallery from "../../../components/product/ProductGallery";
import ProductInfo from "../../../components/product/ProductInfo";
import ProductAction from "../../../components/product/ProductAction";
import ProductDescription from "../../../components/product/ProductDescription";
import RelatedProducts from "../../../components/product/RelatedProducts";
import VariantSelector from "../../../components/product/VariantSelector";
import QuantitySelector from "../../../components/product/QuantitySelector";
import { useProductDetailBySlugQuery } from "../../../queries/product.query";
import { useDetailShopByProductSlugQuery } from "../../../queries/shop.query";
import ShopHeader from "../../shop/ShopPage/components/ShopHeader";
import ProductReviewSection from "../../../components/review/ProductReviewSection";

const ProductDetailPage = () => {
  const { productSlug } = useParams<{ productSlug: string }>();

  const [selectedVariant, setSelectedVariant] = useState(0);
  const [selectedQuantity, setSelectedQuantity] = useState(1);

  const { data: shop, isLoading: shopLoading } =
    useDetailShopByProductSlugQuery(productSlug!);
  const { data: product, isLoading: productLoading } =
    useProductDetailBySlugQuery(productSlug);

  if (productLoading || !product) {
    return <Spin />;
  }

  const variant = product.variants[selectedVariant];

  return (
    <div className={styles.wrapper}>
      <div className={styles.container}>
        <div className={styles.left}>
          <ProductGallery images={variant.images} />
        </div>

        <div className={styles.right}>
          <ProductInfo
            product={product}
            originalPrice={variant.originalPrice}
            displayPrice={variant.displayPrice}
            isFlashSale={variant.isFlashSale}
          />

          <VariantSelector
            variants={product.variants}
            selected={selectedVariant}
            onChange={setSelectedVariant}
          />

          <QuantitySelector
            stock={variant.stock}
            quantity={selectedQuantity}
            updateQuantity={setSelectedQuantity}
          />

          <ProductAction variantId={variant.id} quantity={selectedQuantity} />
        </div>
      </div>

      <ShopHeader shop={shop!} isLoading={shopLoading} />
      <ProductDescription description={product.description} />
      <ProductReviewSection
        avgRating={product.avgRating}
        productSlug={product.slug}
      />
      <RelatedProducts categorySlug={product.category.slug} />
    </div>
  );
};

export default ProductDetailPage;
