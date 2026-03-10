import { IsNotEmpty, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @IsNotEmpty()
  @MinLength(8, {
    message: 'Current password must be greater than or equals to 8 characters',
  })
  currentPassword: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'New password must be greater than or equals to 8 characters',
  })
  newPassword: string;

  @IsNotEmpty()
  @MinLength(8, {
    message: 'Confirm password must be greater than or equals to 8 characters',
  })
  newConfirmPassword: string;
}
