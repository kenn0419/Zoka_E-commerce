import { Injectable, UnauthorizedException } from '@nestjs/common';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { CryptoUtil } from 'src/common/utils/crypto.util';
import { AuthRepository } from '../auth.repository';

@Injectable()
export class SessionService {
  constructor(
    private readonly redis: RedisService,
    private readonly authRepo: AuthRepository,
  ) {}

  async create(userId: string, device?: string, ipAddress?: string) {
    const sessionId = crypto.randomUUID();
    const { publicKey, privateKey } = CryptoUtil.generateKeyPair();

    const session = await this.authRepo.createUserSession({
      id: sessionId,
      userId,
      device,
      ipAddress,
      publicKey,
      privateKey,
      expiresAt: new Date(Date.now() + 30 * 86400 * 1000),
    });

    await this.redis.set(
      `session:${sessionId}`,
      JSON.stringify({ userId, isRevoked: false }),
      30 * 86400,
    );

    await this.redis.sadd(`user:${userId}:sessions`, sessionId);

    return session;
  }

  async validate(sessionId: string) {
    const raw = await this.redis.get(`session:${sessionId}`);
    if (!raw) throw new UnauthorizedException('Session expired');

    const session = JSON.parse(raw);
    if (session.isRevoked) {
      throw new UnauthorizedException('Session revoked');
    }

    return session;
  }

  async getSessionForRefresh(sessionId: string) {
    const session = await this.authRepo.findById(sessionId);

    if (!session || session.isRevoked) {
      throw new UnauthorizedException('Session revoked');
    }

    if (session.expiresAt < new Date()) {
      throw new UnauthorizedException('Session expired');
    }

    return session;
  }

  async revoke(sessionId: string) {
    await this.authRepo.revokeSession(sessionId);
    await this.redis.del(`session:${sessionId}`);
  }

  async revokeAll(userId: string) {
    const sessions = await this.redis.smembers(`user:${userId}:sessions`);

    for (const sid of sessions) {
      await this.revoke(sid);
    }

    await this.redis.del(`user:${userId}:sessions`);
  }

  attachRefreshToken(sessionId: string, refreshToken: string) {
    return this.authRepo.updateSession(sessionId, {
      refreshToken,
      updatedAt: new Date(),
    });
  }
}
