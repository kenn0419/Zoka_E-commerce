import instance from "./axios-customize";

export const orderApi = {
  checkoutPreview: async (
    data: ICheckoutPreviewRequest,
  ): Promise<IApiResponse<ICheckoutPreviewResponse>> => {
    return await instance.post(`/orders/checkout/preview`, data);
  },
};
