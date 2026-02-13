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
};
