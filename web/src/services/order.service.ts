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
};
