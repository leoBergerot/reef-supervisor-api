import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { IsEmailAlreadyExist } from './user.validator';
import { IsTokenValid } from '../auth/recaptcha-token-constraint';

@Entity()
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  username: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  firstName: string;

  @Column({ nullable: false })
  @IsNotEmpty()
  lastName: string;

  @Column({ nullable: false, unique: true })
  @IsEmail()
  @IsEmailAlreadyExist({
    message: 'Email $value already register. Choose another, or recover your password',
  })
  email: string;

  @Column({ default: false })
  isActive: boolean;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  plainPassword: string;

  @IsTokenValid()
  recaptchaToken: string;
}