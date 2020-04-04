import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { getRepository } from 'typeorm';
import { User } from './user.entity';

@ValidatorConstraint({ async: true })
export class IsUsernameAlreadyExistConstraint implements ValidatorConstraintInterface {

  validate(username: any, args: ValidationArguments) {
    getRepository(User);
    const qb = getRepository(User)
      .createQueryBuilder('user')
      .where('user.username = :username', { username });
    return qb.getOne().then(user => {return !user});
  }

}

export function IsUsernameAlreadyExist(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsUsernameAlreadyExistConstraint,
    });
  };
}

@ValidatorConstraint({ async: true })
export class IsEmailAlreadyExistConstraint implements ValidatorConstraintInterface {

  validate(email: any, args: ValidationArguments) {
    getRepository(User);
    const qb = getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email });

    return qb.getOne().then(user => {return !user});
  }

}

export function IsEmailAlreadyExist(validationOptions?: ValidationOptions) {
  return function(object: Object, propertyName: string) {
    registerDecorator({
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      constraints: [],
      validator: IsEmailAlreadyExistConstraint,
    });
  };
}