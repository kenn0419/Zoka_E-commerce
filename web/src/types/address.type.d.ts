interface IAddressResponse {
  id: string;
  userId?: string;
  receiverName: string;
  receiverPhone: string;
  addressText: string;
}

interface IAddressCreationRequest {
  receiverName: string;
  receiverPhone: string;
  addressText: string;
}
