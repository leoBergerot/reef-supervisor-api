import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { AuthService } from './auth/auth.service';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';
import { LocalAuthGuard } from './auth/guards/local-auth.guard';
import { ForgotPasswordDto } from './auth/forgot-password-dto';
import { RecoverPasswordDto } from './auth/recover-password-dto';

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

  @Post('recover-password')
  async recoverPassword(@Body() user:RecoverPasswordDto) {
    return this.authService.recoverPassword(user);
  }
}