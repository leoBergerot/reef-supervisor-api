import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { ForgotPasswordDto } from './auth/forgot-password-dto';
import { RecoverPasswordDto } from './auth/recover-password-dto';
import { User } from './users/user.entity';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(LocalAuthGuard)
  @Post('login')
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @Post('forgot-password')
  async forgotPassword(@Body() user:ForgotPasswordDto) {
    return this.authService.forgotPassword(user);
  }

  @UseInterceptors(ClassSerializerInterceptor)
  @Post('recover-password')
  async recoverPassword(@Body() user:RecoverPasswordDto) {
    return new User(await this.authService.recoverPassword(user));
  }
}