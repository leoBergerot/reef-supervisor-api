import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const fetch = require('node-fetch');

const TURNSTILE_SITEVERIFY_URL =
  'https://challenges.cloudflare.com/turnstile/v0/siteverify';

/**
 * Preferred body field: turnstileToken.
 * Legacy recaptchaToken is still accepted temporarily for clients not yet migrated.
 */
export function resolveTurnstileToken(body: {
  turnstileToken?: string;
  recaptchaToken?: string;
}): string | undefined {
  if (body == null) {
    return undefined;
  }
  if (body.turnstileToken != null && body.turnstileToken !== '') {
    return body.turnstileToken;
  }
  if (body.recaptchaToken != null && body.recaptchaToken !== '') {
    return body.recaptchaToken;
  }
  return undefined;
}

export async function verifyTurnstileToken(
  token: string | undefined | null,
  remoteip?: string,
): Promise<boolean> {
  if ('false' === process.env.TURNSTILE_ENABLED) {
    return true;
  }
  if (token === undefined || token === '' || token === null) {
    return false;
  }

  const payload: { secret: string; response: string; remoteip?: string } = {
    secret: process.env.TURNSTILE_SECRET_KEY,
    response: token,
  };
  if (remoteip) {
    payload.remoteip = remoteip;
  }

  try {
    const res = await fetch(TURNSTILE_SITEVERIFY_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });
    const result = await res.json();
    return !!result.success;
  } catch (error) {
    console.log(error);
    return false;
  }
}

@ValidatorConstraint({ async: true })
export class IsTurnstileTokenValidConstraint
  implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const token = resolveTurnstileToken({
      turnstileToken: value,
      recaptchaToken: (args.object as any)?.recaptchaToken,
    });
    return verifyTurnstileToken(token);
  }
}

/** @deprecated Use IsTurnstileTokenValidConstraint */
export const isTokenValidConstraint = IsTurnstileTokenValidConstraint;

export function IsTurnstileTokenValid(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions
        ? validationOptions
        : { message: 'Invalid or missing Turnstile token' },
      constraints: [],
      validator: IsTurnstileTokenValidConstraint,
    });
  };
}

/** @deprecated Use IsTurnstileTokenValid */
export const IsTokenValid = IsTurnstileTokenValid;
