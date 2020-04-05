import { Body, ClassSerializerInterceptor, Controller, Post, UseInterceptors } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/')
  createUser(@Body() user: User) {
    const registeredUser = this.usersService.updateOrCreate(user);
    return registeredUser.then(user => {
      return new User(user);
    });
  }
}
