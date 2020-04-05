import {
  IsEmail,
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getRepository } from 'typeorm';
import { User } from '../users/user.entity';

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
  @IsEmail()
  @IsEmailExist({
    message: 'This email $value doesn\'t exist',
  })
  email: string;
}


