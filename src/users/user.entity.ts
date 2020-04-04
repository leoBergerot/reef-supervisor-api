import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsEmail, IsNotEmpty } from 'class-validator';
import { Exclude } from 'class-transformer';
import { IsEmailAlreadyExist, IsUsernameAlreadyExist } from './user.validator';

@Entity()
export class User {
  constructor(partial: Partial<User>) {
    Object.assign(this, partial);
  }

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: false, unique: true })
  @IsNotEmpty()
  @IsUsernameAlreadyExist({
    message: 'username $value already register. Choose another',
  })
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
    message: 'email $value already register. Choose another, or recover your password',
  })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: false })
  @Exclude()
  password: string;

  @IsNotEmpty()
  @Exclude({ toPlainOnly: true })
  plainPassword: string;
}