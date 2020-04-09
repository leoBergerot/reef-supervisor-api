import { ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { registerEmail } from './user.register.email';

const jwt = require('jwt-simple');
const bcrypt = require('bcrypt');

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {
  }

  async findOneByUsername(username: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { username: username } });
  }

  async findOneById(id: number): Promise<User | undefined> {
    return this.usersRepository.findOne({ where: { id: id } });
  }

  async updateOrCreate(user: User): Promise<User> {
    let sendEmailValidation = false;
    if (user.plainPassword) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(user.plainPassword, salt);
    }

    if (!user.id) {
      sendEmailValidation = true;
    }

    user = await this.usersRepository.save(user);
    if (sendEmailValidation) {
      const secret = user.password + user.id + user.firstName + user.lastName;
      const token = jwt.encode({ email: user.email, id: user.id }, secret);
      if (!await registerEmail(user, token.replace(/\./g, '+'))) {
        throw new InternalServerErrorException();
      }
    }
    return user;
  }

  async enableUser(user: User, token: string) {
    const secret = user.password + user.id + user.firstName + user.lastName;
    try {
      jwt.decode(token.replace(/\+/g, '.'), secret);
    } catch (e) {
      throw  new ForbiddenException();
    }
    user.isActive = true;
    return !!await this.updateOrCreate(user);
  }
}
