import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

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

  async updateOrCreate(user: User): Promise<User> {
    if (user.plainPassword) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(user.plainPassword, salt);
    }
    return await this.usersRepository.save(user);
  }
}
