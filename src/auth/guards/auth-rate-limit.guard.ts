import {
  CanActivate,
  ExecutionContext,
  HttpException,
  HttpStatus,
  Injectable,
} from '@nestjs/common';

type HitBucket = { count: number; resetAt: number };

/**
 * Lightweight in-memory per-IP rate limit for Nest 7 (no @nestjs/throttler).
 * Intended only for auth abuse endpoints — not applied globally.
 */
@Injectable()
export class AuthRateLimitGuard implements CanActivate {
  private static readonly buckets = new Map<string, HitBucket>();

  /** Max requests per IP per window for a given route. */
  private static readonly limit = 10;
  /** Window length in milliseconds. */
  private static readonly windowMs = 60_000;

  canActivate(context: ExecutionContext): boolean {
    const req = context.switchToHttp().getRequest();
    const ip =
      (req.headers && (req.headers['x-forwarded-for'] || '').split(',')[0].trim()) ||
      req.ip ||
      (req.connection && req.connection.remoteAddress) ||
      'unknown';
    const route =
      (req.route && req.route.path) || req.path || req.url || 'unknown';
    const key = `${req.method}:${route}:${ip}`;
    const now = Date.now();

    let bucket = AuthRateLimitGuard.buckets.get(key);
    if (!bucket || now >= bucket.resetAt) {
      bucket = { count: 0, resetAt: now + AuthRateLimitGuard.windowMs };
      AuthRateLimitGuard.buckets.set(key, bucket);
    }

    bucket.count += 1;
    if (bucket.count > AuthRateLimitGuard.limit) {
      throw new HttpException(
        {
          statusCode: HttpStatus.TOO_MANY_REQUESTS,
          message: 'Too many requests. Please try again later.',
        },
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    // Opportunistic cleanup of expired buckets to avoid unbounded growth.
    if (AuthRateLimitGuard.buckets.size > 5000) {
      for (const [k, b] of AuthRateLimitGuard.buckets) {
        if (now >= b.resetAt) {
          AuthRateLimitGuard.buckets.delete(k);
        }
      }
    }

    return true;
  }
}
