import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

const fetch = require('node-fetch');

@ValidatorConstraint({ async: true })
export class isTokenValidConstraint implements ValidatorConstraintInterface {
  async validate(recaptchaToken: any, args: ValidationArguments) {
    if ('false' === process.env.RECAPTCHA_ENABLED) {
      return true;
    }
    if (recaptchaToken === undefined || recaptchaToken === '' || recaptchaToken === null) {
      return false;
    }
    return await fetch(`https://www.google.com/recaptcha/api/siteverify?response=${recaptchaToken}&secret=${process.env.RECAPTCHA_SECRET_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    })
      .then(res => res.json())
      .then(
        (result) => {
          if (result.success) {
            return true;
          }

          return false;
        },
        (error) => {
     console.log(error);
          return false;
        },
      );
  }

}

export function IsTokenValid(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions ? validationOptions : { message: 'Are you a fucking bot ?' },
      constraints: [],
      validator: isTokenValidConstraint,
    });
  };
}