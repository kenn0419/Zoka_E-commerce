import instance from "./axios-customize";

export const orderApi = {
  checkoutPreview: async (
    data: ICheckoutPreviewRequest,
  ): Promise<IApiResponse<ICheckoutPreviewResponse>> => {
    return await instance.post(`/orders/checkout/preview`, data);
  },
  checkoutConfirm: async (
    data: ICheckoutConfirmRequest,
  ): Promise<IApiResponse<ICheckoutConfirmResponse>> => {
    return await instance.post(`/orders/checkout/confirm`, data);
  },
  fetchMyOrders: async (
    params: IOrderQueries,
  ): Promise<IApiResponse<IPaginatedResponse<IOrderResponse>>> => {
    return await instance.get(`/orders/me`, {
      params,
    });
  },
  fetchShopOrders: async (
    shopId: string,
    params: IOrderQueries,
  ): Promise<IApiResponse<IPaginatedResponse<IOrderResponse>>> => {
    return await instance.get(`/orders/shop/${shopId}`, {
      params,
    });
  },
  fetchAllOrders: async (
    params: IOrderQueries,
  ): Promise<IApiResponse<IPaginatedResponse<IOrderResponse>>> => {
    return await instance.get(`/orders`, {
      params,
    });
  },
  changeOrderStatusByShop: async (
    code: string,
    status: IOrderStatus,
  ): Promise<IApiResponse<IOrderResponse>> => {
    return await instance.patch(`/orders/shop/${code}/change-status`, {
      status,
    });
  },
  changeOrderStatusByAdmin: async (
    id: string,
    status: IOrderStatus,
  ): Promise<IApiResponse<IOrderResponse>> => {
    return await instance.patch(`/orders/${id}/change-status`, {
      status,
    });
  },
};
