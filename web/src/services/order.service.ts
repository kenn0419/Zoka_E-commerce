import { orderApi } from "../apis/order.api";

export const orderService = {
  async checkoutPreview(
    data: ICheckoutPreviewRequest,
  ): Promise<ICheckoutPreviewResponse> {
    const res = await orderApi.checkoutPreview(data);

    return res.data;
  },

  async checkoutConfirm(
    data: ICheckoutConfirmRequest,
  ): Promise<ICheckoutConfirmResponse> {
    const res = await orderApi.checkoutConfirm(data);

    return res.data;
  },

  async fetchMyOrders(
    params: IOrderQueries,
  ): Promise<IPaginatedResponse<IOrderResponse>> {
    const res = await orderApi.fetchMyOrders(params);

    return res.data;
  },

  async fetchShopOrders(
    shopId: string,
    params: IOrderQueries,
  ): Promise<IPaginatedResponse<IOrderResponse>> {
    const res = await orderApi.fetchShopOrders(shopId, params);

    return res.data;
  },

  async fetchAllOrders(
    params: IOrderQueries,
  ): Promise<IPaginatedResponse<IOrderResponse>> {
    const res = await orderApi.fetchAllOrders(params);

    return res.data;
  },

  async changeOrderStatusByShop(
    code: string,
    status: IOrderStatus,
  ): Promise<IOrderResponse> {
    const res = await orderApi.changeOrderStatusByShop(code, status);
    return res.data;
  },

  async changeOrderStatusByAdmin(
    id: string,
    status: IOrderStatus,
  ): Promise<IOrderResponse> {
    const res = await orderApi.changeOrderStatusByAdmin(id, status);
    return res.data;
  },
};
