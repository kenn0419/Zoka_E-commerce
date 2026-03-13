import { ProTable, type ProColumns } from "@ant-design/pro-components";
import { Image, Tag } from "antd";

type Props = {
  data: IProductListItemResponse[];
  loading: boolean;
  page: number;
  limit: number;
  total?: number;
  onPageChange: (page: number, limit: number) => void;
  onSortChange: (sort: string) => void;
  onSearch: (value: string) => void;
  toolbar: React.ReactNode[];
};

export const ProductTable = ({
  data,
  loading,
  page,
  limit,
  total,
  onPageChange,
  onSortChange,
  toolbar,
}: Props) => {
  const columns: ProColumns<IProductListItemResponse>[] = [
    {
      title: "Thumbnail",
      dataIndex: "thumbnail",
      render: (_, record) =>
        record.thumbnail ? (
          <Image
            src={record.thumbnail}
            width={50}
            height={50}
            style={{ objectFit: "cover" }}
          />
        ) : null,
    },
    { title: "Name", dataIndex: "name", sorter: true },
    { title: "Slug", dataIndex: "slug" },
    {
      title: "Avg Rating",
      dataIndex: "avgRating",
      render: (_, record) => (
        <span>{Number(record.avgRating).toFixed(1)} / 5</span>
      ),
    },
    {
      title: "Stock",
      dataIndex: "hasStock",
      render: (_, record) => (
        <Tag color={record.hasStock ? "green" : "red"}>
          {record.hasStock ? "In Stock" : "Out of Stock"}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      render: (_, record) => {
        const colorMap: Record<string, string> = {
          ACTIVE: "green",
          INACTIVE: "default",
          PENDING: "orange",
          REJECTED: "red",
          BANNED: "red",
        };
        const status = record.status || "UNKNOWN";
        return <Tag color={colorMap[status] || "default"}>{status}</Tag>;
      },
    },
  ];

  return (
    <ProTable
      rowKey="id"
      headerTitle="Product Management"
      loading={loading}
      search={false}
      columns={columns}
      dataSource={data}
      pagination={{
        current: page,
        pageSize: limit,
        total,
        onChange: onPageChange,
      }}
      onChange={(_, __, sorter) => {
        if (!Array.isArray(sorter) && sorter.field === "name") {
          onSortChange(sorter.order === "ascend" ? "NAME_ASC" : "NAME_DESC");
        }
      }}
      toolBarRender={() => toolbar}
      options={{
        reload: false,
        setting: true,
      }}
    />
  );
};
