import { Input } from "antd";
import { useState } from "react";
import { useSellerStore } from "../../../store/seller.store";
import { useFlashSalesByShopQuery } from "../../../queries/flash-sale.query";
import FlashSaleTable from "./components/FlashSaleTable";
import { FlashSaleCreateModal } from "./components/FlashSaleCreateModal";

export default function FlashSaleManagement() {
  const currentShopId = useSellerStore((state) => state.currentShopId);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");

  const { data, isLoading } = useFlashSalesByShopQuery(currentShopId ?? "", {
    page,
    limit,
    search,
  });

  return (
    <div style={{ padding: 24 }}>
      <FlashSaleTable
        data={data?.items ?? []}
        loading={isLoading}
        page={page}
        limit={limit}
        total={data?.meta?.totalItems}
        onPageChange={(p, l) => {
          setPage(p);
          setLimit(l);
        }}
        toolbar={[
          <Input.Search
            key="search"
            placeholder="Tìm kiếm chương trình..."
            onSearch={(v) => {
              setSearch(v);
              setPage(1);
            }}
            style={{ width: 250 }}
          />,
          <FlashSaleCreateModal key="create" />,
        ]}
      />
    </div>
  );
}
