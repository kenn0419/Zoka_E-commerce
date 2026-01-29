export enum CouponScope {
  GLOBAL = 'GLOBAL',
  SHOP = 'SHOP',
  USER = 'USER',
  PRODUCT = 'PRODUCT',
  CATEGORY = 'CATEGORY',
}

export enum CouponType {
  FIXED = 'FIXED',
  PERCENTAGE = 'PERCENTAGE',
}

export enum CouponStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
}

export enum CounponSort {
  NEWEST = 'newest',
  OLDEST = 'oldest',
  START_AT_ASC = 'start_at_asc',
  START_AT_DESC = 'start_at_desc',
  END_AT_ASC = 'end_at_asc',
  END_AT_DESC = 'end_at_desc',
  TYPE_ASC = 'type_asc',
  TYPE_DESC = 'type_desc',
}
