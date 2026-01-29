import { TokenService } from 'src/modules/auth/services/token.service';
import { SessionService } from 'src/modules/auth/services/session.service';
import { AccessTokenPayload } from '../interfaces/access-token-payload.interface';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthCoreService {
  constructor(
    private readonly tokenService: TokenService,
    private readonly sessionService: SessionService,
  ) {}

  async verifyAccessToken(token: string) {
    const decoded = this.tokenService.verifyAccessToken(token);

    const payload = decoded as AccessTokenPayload;

    await this.sessionService.validate(payload.sessionId);

    return payload;
  }
}
