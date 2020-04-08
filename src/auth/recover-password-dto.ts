import { IsNotEmpty } from 'class-validator';
import { IsTokenValid } from './recaptcha-token-constraint';

export class RecoverPasswordDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  id: string;

  @IsTokenValid()
  recaptchaToken: string
}