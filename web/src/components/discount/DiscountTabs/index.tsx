import { Tabs } from "antd";

export default function DiscountTabs() {
  return (
    <Tabs
      items={[
        { key: "all", label: "All Vouchers" },
        { key: "latest", label: "Latest" },
        { key: "popular", label: "Popular" },
        { key: "expiring", label: "Expiring Soon" },
      ]}
    />
  );
}
