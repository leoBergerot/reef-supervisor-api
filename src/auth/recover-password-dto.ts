import { IsNotEmpty } from 'class-validator';

export class RecoverPasswordDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  id: string;
}