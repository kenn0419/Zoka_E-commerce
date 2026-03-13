import type { ActionType, ProColumns } from "@ant-design/pro-components";
import {
  ModalForm,
  ProFormTextArea,
  ProTable,
} from "@ant-design/pro-components";
import { Avatar, Rate, Space, message, Button } from "antd";
import { useRef } from "react";
import dayjs from "dayjs";
import { useSellerStore } from "../../../../../store/seller.store";
import { reviewService } from "../../../../../services/review.service";
import { ReviewSort } from "../../../../../utils/constant.util";

const ShopReviewTable = () => {
  const actionRef = useRef<ActionType>();
  const { currentShopId } = useSellerStore();

  const handleReply = async (reviewId: string, content: string) => {
    try {
      await reviewService.replyReview(reviewId, content);
      message.success("Reply sent successfully");
      actionRef.current?.reload();
      return true;
    } catch (error) {
      message.error("Failed to send reply");
      return false;
    }
  };

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
      render: (dom) => (
        <Rate disabled defaultValue={Number(dom)} style={{ fontSize: 14 }} />
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
      title: "Replies",
      dataIndex: "replyCount",
      hideInSearch: true,
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (dom) => dayjs(String(dom)).format("YYYY-MM-DD HH:mm"),
      sorter: true,
      hideInSearch: true,
    },
    {
      title: "Action",
      valueType: "option",
      key: "option",
      render: (_, record) => [
        <ModalForm
          key="reply"
          title={`Reply to ${record.buyer.fullName}`}
          trigger={<Button type="link">Reply</Button>}
          onFinish={async (values) => {
            return await handleReply(record.id, values.content);
          }}
        >
          <ProFormTextArea
            name="content"
            label="Reply Content"
            placeholder="Type your reply here..."
            rules={[{ required: true, message: "Please input reply content" }]}
          />
        </ModalForm>,
      ],
    },
  ];

  return (
    <ProTable<IReviewResponse>
      headerTitle="Shop Reviews"
      actionRef={actionRef}
      rowKey="id"
      search={{
        labelWidth: "auto",
      }}
      request={async (params, sort) => {
        if (!currentShopId) return { data: [], success: true };

        let sortValue = ReviewSort.NEWEST;
        if (sort.createdAt === "ascend") sortValue = ReviewSort.OLDEST;
        if (sort.createdAt === "descend") sortValue = ReviewSort.NEWEST;
        if (sort.rating === "ascend") sortValue = ReviewSort.RATING_ASC;
        if (sort.rating === "descend") sortValue = ReviewSort.RATING_DESC;

        const data = await reviewService.fetchShopReviews(currentShopId, {
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

export default ShopReviewTable;
