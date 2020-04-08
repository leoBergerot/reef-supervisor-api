import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import { Validator } from 'class-validator';
import { IsTokenValid } from '../recaptcha-token-constraint';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ passReqToCallback: true });
  }

  async validate(req, username: string, password: string): Promise<any> {
    const validator = new Validator();
    if (!validator.isNotEmpty(req.body.recaptchaToken) || !IsTokenValid(req.body.recaptchaToken)) {
      throw new UnauthorizedException();
    }
    try {
      return await this.authService.validateUser(username, password);
    } catch (e) {
      throw e;
    }
  }
}