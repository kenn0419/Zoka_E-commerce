import styles from "./HomePage.module.scss";
import CategorySection from "../../../components/common/CategorySection";
import FlashSale from "../../../components/common/FlashSale";
import { useAvailableCouponsQuery } from "../../../queries/coupon.query";
import CouponSection from "../../../components/coupon/CouponSection";
import { useAuthStore } from "../../../store/auth.store";
import HeroBanner from "../../../components/layout/MainLayout/BannerCarousel";
import ProductSection from "../../../components/common/ProductSection";

export default function HomePage() {
  const user = useAuthStore((state) => state.user);
  const { data: coupons, isLoading: couponsLoading } = useAvailableCouponsQuery(
    {
      page: 1,
      limit: 5,
    },
    !!user,
  );

  return (
    <div className={styles.home}>
      <HeroBanner />
      <CouponSection
        coupons={coupons?.items ?? []}
        isLoading={couponsLoading}
      />
      <CategorySection />
      <FlashSale />
      <ProductSection />
    </div>
  );
}
