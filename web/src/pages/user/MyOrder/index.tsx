import { Tabs, Input } from "antd";
import styles from "./MyOrder.module.scss";
import OrderCard from "../../../components/common/OrderCard";

export const fakeOrders = [
  {
    id: "ORD-1001",
    shop: "Tech Gadgets Official",
    status: "completed",
    deliveryStatus: "Delivered",
    total: 199,
    items: [
      {
        id: "1",
        name: "Premium Noise Cancelling Wireless Headphones",
        variation: "Midnight Black",
        price: 199,
        oldPrice: 299,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400",
      },
    ],
  },
  {
    id: "ORD-1002",
    shop: "Luxe Home Essentials",
    status: "shipping",
    deliveryStatus: "Arriving by Thursday",
    total: 94,
    items: [
      {
        id: "1",
        name: "Minimalist LED Desk Lamp",
        variation: "Matte White",
        price: 45,
        quantity: 1,
        image:
          "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400",
      },
      {
        id: "2",
        name: "Retro Decorative Camera Figurine",
        variation: "Brown Leather",
        price: 24.5,
        quantity: 2,
        image:
          "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400",
      },
    ],
  },
];

const { Search } = Input;

export default function MyOrderPage() {
  return (
    <div className={styles.container}>
      <Tabs
        defaultActiveKey="all"
        items={[
          { key: "all", label: "All" },
          { key: "pay", label: "To Pay" },
          { key: "ship", label: "To Ship" },
          { key: "receive", label: "To Receive" },
          { key: "completed", label: "Completed" },
          { key: "cancelled", label: "Cancelled" },
        ]}
      />

      <Search
        placeholder="Search by Shop Name, Order ID or Product"
        className={styles.search}
      />

      <div className={styles.list}>
        {fakeOrders.map((order) => (
          <OrderCard key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
