import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('/')
  createUser(@Body() user: User) {
    user.username = user.email;
    const registeredUser = this.usersService.updateOrCreate(user);
    return registeredUser.then(user => {
      return new User(user);
    });
  }

  @Get(':id/enable/:token')
  async enableUser(@Param() params, @Res() res) {
    const user = await this.usersService.findOneById(params.id);
    if (!user) {
      throw  new NotFoundException(null, 'User not found');
    }
    if (!params.token) {
      throw new NotFoundException(null, 'Token not found');
    }
    await this.usersService.enableUser(user, params.token);
    const redirectUrl =
      new URL(`${process.env.FRONTEND_URL}/login/enable`);

    return res.redirect(redirectUrl.toString());
  }
}
