import { Table, Tag } from "antd";
import type { ColumnsType } from "antd/es/table";
import { useSearchParams } from "react-router-dom";
import { getStatusColor, renderStatus } from "../../../utils/helper.util";
import { useMyOrdersQuery } from "../../../queries/order.query";
import dayjs from "dayjs";

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export default function MyOrdersPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const status = (searchParams.get("status") || "ALL") as IOrderStatus | "ALL";

  const page = Number(searchParams.get("page") || DEFAULT_PAGE);
  const limit = Number(searchParams.get("limit") || DEFAULT_LIMIT);

  const { data, isLoading } = useMyOrdersQuery({
    status: status === "ALL" ? undefined : status,
    page,
    limit,
  } as any);

  const columns: ColumnsType<IOrderResponse> = [
    {
      title: "Mã đơn",
      dataIndex: "code",
      width: 140,
    },
    {
      title: "Shop",
      render: (_, record) => record.shop.name,
    },
    {
      title: "Thanh toán",
      dataIndex: "paymentMethod",
      width: 120,
    },
    {
      title: "Tổng tiền",
      dataIndex: "totalPrice",
      width: 150,
      render: (value) => `₫${value.toLocaleString()}`,
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      width: 150,
      render: (status) => (
        <Tag color={getStatusColor(status)}>{renderStatus(status)}</Tag>
      ),
    },
    {
      title: "Ngày đặt hàng ",
      dataIndex: "createAt",
      width: 180,
      render: (date) => dayjs(date).format("DD/MM/YYYY"),
    },
  ];

  return (
    <div style={{ padding: 24 }}>
      <Table<IOrderResponse>
        rowKey="id"
        loading={isLoading}
        columns={columns}
        dataSource={data?.items}
        pagination={{
          current: page,
          pageSize: limit,
          total: data?.meta?.totalPages,
          onChange: (newPage, newLimit) => {
            setSearchParams({
              status,
              page: String(newPage),
              limit: String(newLimit),
            });
          },
        }}
      />
    </div>
  );
}
