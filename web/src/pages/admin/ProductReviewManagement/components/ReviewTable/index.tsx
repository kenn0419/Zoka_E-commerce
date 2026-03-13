import type { ActionType, ProColumns } from "@ant-design/pro-components";
import { ProTable } from "@ant-design/pro-components";
import { Avatar, Rate, Space, Popconfirm, message } from "antd";
import { useRef } from "react";
import { reviewService } from "../../../../../services/review.service";
import { ReviewSort } from "../../../../../utils/constant.util";
import dayjs from "dayjs";
import { useAdminDeleteReviewMutation } from "../../../../../queries/review.query";

const ReviewTable = () => {
  const actionRef = useRef<ActionType>();
  const deleteMutation = useAdminDeleteReviewMutation();

  const columns: ProColumns<IReviewResponse>[] = [
    {
      title: "Buyer",
      dataIndex: "buyer",
      render: (_, record) => (
        <Space>
          <Avatar src={record.buyer.avatarUrl} />
          <div>
            <div>{record.buyer.fullName}</div>
            <div style={{ fontSize: 12, color: "gray" }}>
              {record.buyer.email}
            </div>
          </div>
        </Space>
      ),
      hideInSearch: true,
    },
    {
      title: "Product",
      dataIndex: "product",
      render: (_, record) => (
        <Space>
          <Avatar shape="square" src={record.product.thumbnail} />
          <div>
            <div>{record.product.name}</div>
            <div style={{ fontSize: 12, color: "gray" }}>
              Variant: {record.variant.name}
            </div>
          </div>
        </Space>
      ),
      hideInSearch: true,
    },
    {
      title: "Rating",
      dataIndex: "rating",
      render: (_, record) => (
        <Rate
          disabled
          defaultValue={Number(record.rating)}
          style={{ fontSize: 14 }}
        />
      ),
      valueType: "digit",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      ellipsis: true,
      copyable: true,
      hideInSearch: true,
    },
    {
      title: "Status",
      dataIndex: "status",
      valueEnum: {
        ACTIVE: { text: "Active", status: "Success" },
        INACTIVE: { text: "Inactive", status: "Default" },
      },
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (dom) => dayjs(String(dom)).format("DD/MM/YYYY"),
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Action",
      valueType: "option",
      key: "option",
      render: (_, record) => [
        <Popconfirm
          key="delete"
          title="Are you sure you want to deactivate this review?"
          onConfirm={async () => {
            try {
              await deleteMutation.mutateAsync(record.id);
              message.success("Review deactivated successfully");
              actionRef.current?.reload();
            } catch (error) {
              message.error("Failed to deactivate review");
            }
          }}
          okText="Yes"
          cancelText="No"
        >
          <a style={{ color: "red" }}>Deactivate</a>
        </Popconfirm>,
      ],
    },
  ];

  return (
    <ProTable<IReviewResponse>
      headerTitle="Review List"
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: "auto",
      }}
      request={async (params, sort) => {
        let sortValue = ReviewSort.NEWEST;
        if (sort.createdAt === "ascend") sortValue = ReviewSort.OLDEST;
        if (sort.createdAt === "descend") sortValue = ReviewSort.NEWEST;
        if (sort.rating === "ascend") sortValue = ReviewSort.RATING_ASC;
        if (sort.rating === "descend") sortValue = ReviewSort.RATING_DESC;

        const data = await reviewService.fetchAdminReviews({
          page: params.current || 1,
          limit: params.pageSize || 10,
          sort: sortValue as any,
          rating: params.rating,
        });

        return {
          data: data.items,
          total: data.meta?.totalItems || 0,
          success: true,
        };
      }}
      columns={columns}
    />
  );
};

export default ReviewTable;
