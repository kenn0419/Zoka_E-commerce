interface IAddressResponse {
  id: string;
  userId?: string;
  receiverName: string;
  receiverPhone: string;
  addressText: string;
  isDefault: boolean;
}

interface IAddressCreationRequest {
  receiverName: string;
  receiverPhone: string;
  addressText: string;
}
