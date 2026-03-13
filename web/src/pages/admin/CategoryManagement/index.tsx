import { Input } from "antd";
import { useState } from "react";
import { useAdminCategoriesQuery } from "../../../queries/category.query";
import { CategoryTable } from "./components/CategoryTable";
import CategoryCreateModal from "./components/CategoryCreateModal";

const CategoryManagement = () => {
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<string>("CREATED_AT_DESC");

  const { data, isLoading } = useAdminCategoriesQuery({
    page,
    limit,
    search,
    sort,
  });

  return (
    <CategoryTable
      data={data?.items ?? []}
      loading={isLoading}
      page={page}
      limit={limit}
      total={data?.meta?.totalItems}
      onPageChange={(p, l) => {
        setPage(p);
        setLimit(l);
      }}
      onSortChange={setSort}
      onSearch={(v) => {
        setSearch(v);
        setPage(1);
      }}
      toolbar={[
        <Input.Search
          key="search"
          placeholder="Search category..."
          onSearch={(v) => {
            setSearch(v);
            setPage(1);
          }}
        />,
        <CategoryCreateModal key="create" />,
      ]}
    />
  );
};

export default CategoryManagement;

