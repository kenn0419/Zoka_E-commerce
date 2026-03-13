import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as cookie from 'cookie';
import { AuthCoreService } from '../auth/auth-core.service';
import { Socket } from 'socket.io';

@Injectable()
export class WsJwtSessionGuard implements CanActivate {
  constructor(private readonly authCore: AuthCoreService) {}

  async canActivate(ctx: ExecutionContext): Promise<boolean> {
    const client = ctx.switchToWs().getClient<Socket>();
    const cookies = client.handshake.headers.cookie;
    if (!cookies) {
      throw new UnauthorizedException('Missing cookies');
    }

    const parsed = cookie.parse(cookies);
    const token = parsed.accessToken;

    if (!token) {
      throw new UnauthorizedException('Missing access token');
    }

    const payload = await this.authCore.verifyAccessToken(token);

    client.data.user = payload;
    client.data.userId = payload.sub;

    return true;
  }
}
