import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthCoreService } from '../auth/auth-core.service';

@Injectable()
export class JwtSessionGuard implements CanActivate {
  constructor(private readonly authCore: AuthCoreService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const req = ctx.switchToHttp().getRequest();

    const token =
      req.headers?.authorization?.split(' ')[1] || req.cookies?.accessToken;

    if (!token) {
      throw new UnauthorizedException('Missing token');
    }

    req.user = await this.authCore.verifyAccessToken(token);
    return true;
  }
}
