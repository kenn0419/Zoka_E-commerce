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
      <div className={styles.main}>
        <ProductGallery images={variant.images} />

        <div className={styles.right}>
          <ProductInfo product={product} price={variant.price} />

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

      <ProductDescription description={product.description} />
      <ShopHeader shop={shop!} isLoading={shopLoading} />
      <RelatedProducts categorySlug={product.category.slug} />
    </div>
  );
};

export default ProductDetailPage;
