import { Input } from "antd";
import { useState } from "react";
import { useAdminProductsQuery } from "../../../queries/product.query";
import { ProductTable } from "./components/ProductTable";

const ProductManagement = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<IProductSort>("newest");

  const { data, isLoading } = useAdminProductsQuery({
    page,
    limit,
    search,
    sort,
  });

  return (
    <ProductTable
      data={data?.items ?? []}
      loading={isLoading}
      page={page}
      limit={limit}
      total={data?.meta?.totalItems}
      onPageChange={(p, l) => {
        setPage(p);
        setLimit(l);
      }}
      onSortChange={(sort) => setSort(sort as IProductSort)}
      onSearch={(v) => {
        setSearch(v);
        setPage(1);
      }}
      toolbar={[
        <Input.Search
          key="search"
          placeholder="Search product..."
          onSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />,
      ]}
    />
  );
};

export default ProductManagement;
