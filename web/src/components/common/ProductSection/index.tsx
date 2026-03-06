import { Spin, Empty } from "antd";
import { Link } from "react-router-dom";
import { PATH } from "../../../utils/path.util";
import ProductCard from "../../product/ProductCard";
import { useActiveProductsQuery } from "../../../queries/product.query";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";

import { LeftOutlined, RightOutlined } from "@ant-design/icons";

import "swiper/css";
import "swiper/css/navigation";

import styles from "./ProductSection.module.scss";

export default function ProductSection() {
  const { data, isLoading } = useActiveProductsQuery({ page: 1, limit: 20 });

  if (isLoading) return <Spin />;

  if (!data?.items?.length) {
    return <Empty description="Không có sản phẩm" />;
  }

  return (
    <div className={styles.productSection}>
      <div className={styles.productHeader}>
        <h3 className={styles.title}>Gợi ý hôm nay</h3>
        <Link to={`/${PATH.PRODUCTS}`}>Xem tất cả</Link>
      </div>

      <div className={styles.sliderWrapper}>
        <div className={styles.prevArrow}>
          <LeftOutlined />
        </div>

        <Swiper
          loop
          modules={[Navigation]}
          navigation={{
            prevEl: `.${styles.prevArrow}`,
            nextEl: `.${styles.nextArrow}`,
          }}
          spaceBetween={12}
          slidesPerView={8}
          breakpoints={{
            1200: { slidesPerView: 8 },
            992: { slidesPerView: 4 },
            768: { slidesPerView: 3 },
            576: { slidesPerView: 2 },
            0: { slidesPerView: 2 },
          }}
        >
          {data.items.map((product) => (
            <SwiperSlide key={product.id}>
              <ProductCard product={product} />
            </SwiperSlide>
          ))}
        </Swiper>

        <div className={styles.nextArrow}>
          <RightOutlined />
        </div>
      </div>
    </div>
  );
}
