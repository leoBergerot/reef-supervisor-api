import { IsNotEmpty } from 'class-validator';
import { IsTurnstileTokenValid } from './turnstile-token-constraint';

export class RecoverPasswordDto {
  @IsNotEmpty()
  token: string;

  @IsNotEmpty()
  newPassword: string;

  @IsNotEmpty()
  id: string;

  /** Preferred: turnstileToken. Legacy recaptchaToken still accepted by the validator. */
  @IsTurnstileTokenValid()
  turnstileToken: string;

  /** @deprecated Prefer turnstileToken */
  recaptchaToken?: string;
}