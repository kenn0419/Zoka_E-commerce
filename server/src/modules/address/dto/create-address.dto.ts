import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsNotEmpty()
  @IsString()
  receiverName: string;

  @IsNotEmpty()
  @IsPhoneNumber('VN', { message: 'Invalid phone number format' })
  receiverPhone: string;

  @IsNotEmpty()
  @IsString()
  addressText: string;
}
