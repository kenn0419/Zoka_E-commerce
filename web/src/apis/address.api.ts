import instance from "./axios-customize";

export const addressApi = {
  createAddress: async (
    data: IAddressCreationRequest,
  ): Promise<IApiResponse<IAddressResponse>> => {
    return await instance.post("/addresses", data);
  },
  findAllAddressByUser: async (): Promise<IApiResponse<IAddressResponse[]>> => {
    return await instance.get("/addresses");
  },
  setDefaultAddress: async (
    addressId: string,
  ): Promise<IApiResponse<IAddressResponse>> => {
    return await instance.patch(`/addresses/${addressId}/set-default`);
  },
};
