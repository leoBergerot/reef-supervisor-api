import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { IsEmailAlreadyExist } from './user.validator';
import { IsTokenValid } from '../auth/recaptcha-token-constraint';
import { Tank } from '../tanks/tanks.entity';

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
    message: 'Email email_already_register',
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

  @OneToMany(type => Tank, tank => tank.user,
    {
      eager: true,
    },
  )
  tanks: Tank[];
}