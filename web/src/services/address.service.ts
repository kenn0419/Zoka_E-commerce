import { addressApi } from "../apis/address.api";

export const addressService = {
  async createAddress(
    data: IAddressCreationRequest,
  ): Promise<IAddressResponse> {
    const res = await addressApi.createAddress(data);

    return res.data;
  },

  async findAllAddressesByUser(): Promise<IAddressResponse[]> {
    const res = await addressApi.findAllAddressByUser();

    return res.data;
  },

  async setDefaultAddress(addressId: string): Promise<IAddressResponse> {
    const res = await addressApi.setDefaultAddress(addressId);

    return res.data;
  },
};
