import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { PaymentMethod } from 'src/common/enums/payment.enum';
import { CheckoutConfirmNoteDto } from './checkout-confirm-note.dto';

export class CheckoutConfirmDto {
  @IsEnum(PaymentMethod)
  paymentMethod: PaymentMethod;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CheckoutConfirmNoteDto)
  shopNotes?: CheckoutConfirmNoteDto[];

  @IsOptional()
  @IsString()
  couponCode?: string;
}
