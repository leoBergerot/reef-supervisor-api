import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';
import { AuthService } from '../auth.service';
import {
  resolveTurnstileToken,
  verifyTurnstileToken,
} from '../turnstile-token-constraint';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly authService: AuthService) {
    super({ passReqToCallback: true });
  }

  async validate(req, username: string, password: string): Promise<any> {
    const token = resolveTurnstileToken(req.body || {});
    const remoteip =
      (req.headers && (req.headers['x-forwarded-for'] || '').split(',')[0].trim()) ||
      req.ip ||
      (req.connection && req.connection.remoteAddress);

    if (!(await verifyTurnstileToken(token, remoteip))) {
      throw new UnauthorizedException();
    }
    try {
      return await this.authService.validateUser(username, password);
    } catch (e) {
      throw e;
    }
  }
}
