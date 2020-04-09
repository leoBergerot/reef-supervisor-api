import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { ForgotPasswordDto } from './forgot-password-dto';
import { getRepository } from 'typeorm';
import { User } from '../users/user.entity';
import { RecoverPasswordDto } from './recover-password-dto';
import { recoverPasswordEmail } from './recover-password-email';

const bcrypt = require('bcrypt');
const jwt = require('jwt-simple');

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOneByUsername(username);

    if (!user.isActive) {
      throw new UnauthorizedException(null, `Your account is not activate an email was sent to ${user.email}`);
    }

    if (user && bcrypt.compareSync(pass, user.password)) {
      const { password, ...result } = user;
      return result;
    }

    if(!user){
      throw new NotFoundException(null, 'Can\'t to find an account corresponding to this e-mail address.');
    }else {
      throw new ForbiddenException(null, 'Your password is incorrect');
    }
  }

  async login(user: any) {
    const payload = { username: user.username, sub: user.userId };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async forgotPassword(user: ForgotPasswordDto) {
    const { email } = user;
    getRepository(User);
    const qb = getRepository(User)
      .createQueryBuilder('user')
      .where('user.email = :email', { email });
    const userForgotPassword = await qb.getOne();

    const payload = {
      id: userForgotPassword.id,
      email: userForgotPassword.email,
    };

    const secret = userForgotPassword.password + userForgotPassword.id + userForgotPassword.firstName + userForgotPassword.lastName;
    const token = jwt.encode(payload, secret);
    if (!await recoverPasswordEmail(userForgotPassword, token.replace(/\./g,'+'))) {
      throw new InternalServerErrorException();
    }
    return user;
  }

  async recoverPassword(user: RecoverPasswordDto) {
    const userRecoverPassword = await getRepository(User).findOne(user.id);
    const secret = userRecoverPassword.password + userRecoverPassword.id + userRecoverPassword.firstName + userRecoverPassword.lastName;
    try {
      jwt.decode(user.token.replace(/\+/g, '.'), secret);
    } catch (e) {
      throw  new ForbiddenException();
    }
    userRecoverPassword.plainPassword = user.newPassword;
    return await this.usersService.updateOrCreate(userRecoverPassword);
  }
}