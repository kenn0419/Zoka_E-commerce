import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtUtil } from 'src/common/utils/jwt.util';

@Injectable()
export class TokenService {
  constructor(private readonly config: ConfigService) {}

  signAccessToken(payload: {
    sub: string;
    sessionId: string;
    roles?: string[];
    permissions?: string[];
  }) {
    return JwtUtil.signAccessToken(
      payload,
      this.config.get<string>('JWT_ACCESS_SECRET')!,
      this.config.get<string>('JWT_ACCESS_ALGORITHM') ?? 'HS256',
      this.config.get<string>('JWT_ACCESS_EXPIRE_IN') ?? '15m',
    );
  }

  signRefreshToken(
    payload: { sub: string; sessionId: string },
    privateKey: string,
  ) {
    return JwtUtil.signRefreshToken(
      payload,
      privateKey,
      this.config.get<string>('JWT_REFRESH_ALGORITHM') ?? 'RS256',
      this.config.get<string>('JWT_REFRESH_EXPIRE_IN') ?? '30d',
    );
  }

  verifyAccessToken(token: string) {
    try {
      return JwtUtil.verifyAccessToken(
        token,
        this.config.get<string>('JWT_ACCESS_SECRET')!,
      );
    } catch {
      throw new UnauthorizedException('Invalid access token');
    }
  }

  verifyRefreshToken(token: string, publicKey: string) {
    JwtUtil.verifyRefreshToken(token, publicKey);
  }

  decode(token: string) {
    return JwtUtil.decode(token);
  }
}
