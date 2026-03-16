export const CouponScope: Record<ICouponScope, ICouponScope> = {
  SHOP: "SHOP",
  PRODUCT: "PRODUCT",
  GLOBAL: "GLOBAL",
  USER: "USER",
  CATEGORY: "CATEGORY",
};

export const CouponSort = {
  NEWEST: "newest",
  OLDEST: "oldest",
  START_AT_ASC: "start_at_asc",
  START_AT_DESC: "start_at_desc",
  END_AT_ASC: "end_at_asc",
  END_AT_DESC: "end_at_desc",
};

export const CategorySort: Record<string, ICategorySort> = {
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
  NEWEST: "newest",
  OLDEST: "oldest",
};

export const ProductStatus = {
  PENDING: "PENDING",
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
  REJECTED: "REJECTED",
};

export const Role = {
  ADMIN: "admin",
  USER: "user",
  SHOP: "shop",
};

export const SHOP_STATUS_COLOR: Record<IShopStatus, string> = {
  PENDING: "#faad14",
  ACTIVE: "#52c41a",
  SUSPENDED: "#f5222d",
  REJECTED: "#bfbfbf",
};

export const SHOP_STATUS_LABEL: Record<IShopStatus, string> = {
  PENDING: "Đang chờ",
  ACTIVE: "Đã duyệt",
  REJECTED: "Từ chối",
  SUSPENDED: "Bị khóa",
};

export const UserSort: Record<string, IUserSort> = {
  OLDEST: "oldest",
  NEWEST: "newest",
  NAME_ASC: "name_asc",
  NAME_DESC: "name_desc",
};

export const userStatus = {
  INACTIVE: "INACTIVE",
  ACTIVE: "ACTIVE",
};

export const ORDER_STATUS_LABEL: Record<IOrderStatus, string> = {
  PENDING: "Chờ thanh toán",
  PAID: "Đã thanh toán",
  PROCESSING: "Đang xử lý",
  SHIPPED: "Đang giao",
  COMPLETED: "Hoàn thành",
  CANCELLED: "Đã hủy",
  FAILED: "Thanh toán lỗi",
};

export const ReviewSort = {
  NEWEST: "newest",
  OLDEST: "oldest",
  RATING_ASC: "rating_asc",
  RATING_DESC: "rating_desc",
};

export const ProductReviewStatus = {
  ACTIVE: "ACTIVE",
  INACTIVE: "INACTIVE",
};

export const CHAT_AI_AGENT_ID = "ai-assistant-agent-id-001";
