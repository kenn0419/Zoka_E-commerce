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

export const UserSort: Record<IUserSort, IUserSort> = {
  OLDEST: "OLDEST",
  NEWEST: "NEWEST",
  NAME_ASC: "NAME_ASC",
  NAME_DESC: "NAME_DESC",
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
