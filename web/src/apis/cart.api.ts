import instance from "./axios-customize";

export const cartApi = {
  getUserCartSummary: async (): Promise<IApiResponse<ICartSummaryResponse>> => {
    return await instance.get("/cart/summary");
  },
  getUserCart: async (): Promise<IApiResponse<ICartResponse>> => {
    return await instance.get("/cart");
  },
  clearUserCart: async (): Promise<IApiResponse<null>> => {
    return await instance.delete("/cart");
  },
  addToCart: async (
    data: IAddCartRequest,
  ): Promise<IApiResponse<ICartResponse>> => {
    return await instance.post("/cart", data);
  },
  updateQuantity: async (
    data: IUpdateCartRequest,
  ): Promise<IApiResponse<ICartResponse>> => {
    return await instance.patch(`/cart/items/${data.cartItemId}`, data);
  },
  removeCartItem: async (cartItemId: string) => {
    return await instance.delete(`/cart/items/${cartItemId}`);
  },
  updateSelection: async (
    cartItemIds: string[],
  ): Promise<IApiResponse<ICartResponse>> => {
    return await instance.patch(`/cart/select-batch`, { cartItemIds });
  },
};
