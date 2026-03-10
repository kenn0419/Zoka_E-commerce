import styles from "./DiscountGrid.module.scss";
import DiscountCard from "../DiscountCard";

export interface Discount {
  id: string;
  type: "percent" | "cashback" | "shipping";
  value: number;
  title: string;
  description: string;
  expireAt: string;
  status?: "valid" | "new" | "popular" | "expiring";
}

export const discountsMock: Discount[] = [
  {
    id: "V001",
    type: "percent",
    value: 20,
    title: "Storewide Discount",
    description: "Minimum spend $50. Valid for all categories",
    expireAt: "31 Dec 2024",
    status: "valid",
  },
  {
    id: "V002",
    type: "cashback",
    value: 15,
    title: "Summer Collection",
    description: "Applicable for Summer collection",
    expireAt: "15 Aug 2024",
    status: "new",
  },
  {
    id: "V003",
    type: "shipping",
    value: 0,
    title: "Free Shipping",
    description: "Free shipping for orders over $100",
    expireAt: "30 Sep 2024",
    status: "popular",
  },
  {
    id: "V004",
    type: "percent",
    value: 10,
    title: "Flash Sale Apparel",
    description: "Applicable to clothing category",
    expireAt: "Today 23:59",
    status: "expiring",
  },
];

export default function DiscountGrid() {
  return (
    <div className={styles.grid}>
      {discountsMock.map((voucher) => (
        <DiscountCard key={voucher.id} discount={voucher} />
      ))}
    </div>
  );
}
