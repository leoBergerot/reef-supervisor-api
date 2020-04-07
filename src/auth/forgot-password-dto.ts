import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getRepository } from 'typeorm';
import { User } from '../users/user.entity';
import { IsTokenValid } from './token-constraint';

@ValidatorConstraint({ async: true })
export class IsEmailExistConstraint implements ValidatorConstraintInterface {

  validate(email: any, args: ValidationArguments) {
    getRepository(User);
    const qb = getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    return qb.getOne().then(user => {
      return !!user;
    });
  }

}

export function IsEmailExist(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailExistConstraint,
    });
  };
}

export class ForgotPasswordDto {
  @IsEmailExist({
    message: 'This email $value doesn\'t link to account',
  })
  email: string;

  @IsTokenValid()
  token: string
}


