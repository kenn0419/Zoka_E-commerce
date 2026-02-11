import { Expose } from 'class-transformer';

export class AddressResponseDto {
  @Expose()
  id: string;

  @Expose()
  receiverName: string;

  @Expose()
  receiverPhone: string;

  @Expose()
  addressText: string;
}
