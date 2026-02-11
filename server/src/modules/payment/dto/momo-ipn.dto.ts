import { IsNumber, IsString } from 'class-validator';

export class MomoIpnDto {
  @IsString()
  orderId: string;

  @IsString()
  transId: string;

  @IsNumber()
  resultCode: number;

  @IsString()
  message: string;

  @IsString()
  signature: string;
}
