import { IsString } from 'class-validator';

export class CheckoutConfirmNoteDto {
  @IsString()
  shopId: string;

  @IsString()
  note: string;
}
