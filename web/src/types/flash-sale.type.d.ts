export interface IFlashSaleItemResponse {
  id: string;
  variantId: string;
  salePrice: number;
  quantity: number;
  sold: number;
  product?: IProductListItemResponse;
}

export interface IFlashSaleResponse {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  status: "UPCOMING" | "ACTIVE" | "ENDED" | "CANCELLED";
  maxPerUser?: number;
  items: IFlashSaleItemResponse[];
  createdAt: string;
}

export interface IFlashSaleFilterQueries extends IPaginationQueries {
  search?: string;
  sort?: string;
}
