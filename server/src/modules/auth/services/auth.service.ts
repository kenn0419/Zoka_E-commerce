import { ConfigService } from '@nestjs/config';
import { MailService } from 'src/infrastructure/mail/mail.service';
import { RedisService } from 'src/infrastructure/redis/redis.service';
import { RbacService } from 'src/modules/rbac/rbac.service';
import { UserRoleRepository } from 'src/modules/user/repositories/user-role.repository';
import { UserRepository } from 'src/modules/user/repositories/user.repository';
import { SessionService } from './session.service';
import { TokenService } from './token.service';
import { SignupDto } from '../dto/signup.dto';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { CryptoUtil } from 'src/common/utils/crypto.util';
import { VerifyEmailDto } from '../dto/verify-email.dto';
import { SlugifyUtil } from 'src/common/utils/slugify.util';
import { UserStatus } from 'src/common/enums/user.enum';
import { UserMapper } from 'src/common/mappers/user.mapper';
import { AuthRepository } from '../auth.repository';
import { AddressRepository } from 'src/modules/address/address.repository';

@Injectable()
export class AuthService {
  private readonly EMAIL_TTL = Number(
    process.env.EMAIL_VERIFICATION_TTL_SECONDS ?? 900,
  );

  constructor(
    private readonly config: ConfigService,
    private readonly redis: RedisService,
    private readonly rbacService: RbacService,
    private readonly mailService: MailService,
    private readonly userRepo: UserRepository,
    private readonly userRoleRepo: UserRoleRepository,
    private readonly authRepo: AuthRepository,
    private readonly addressRepo: AddressRepository,
    private readonly sessionService: SessionService,
    private readonly tokenService: TokenService,
  ) {}

  // ======================= SIGN UP =======================

  async signup(dto: SignupDto) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Password confirmation mismatch');
    }

    if (await this.userRepo.findUnique({ email: dto.email })) {
      throw new ConflictException('Email already registered');
    }

    if (await this.userRepo.findUnique({ phone: dto.phone })) {
      throw new ConflictException('Phone already registered');
    }

    const saltRounds = this.config.get<number>('BCRYPT_SALT_ROUNDS') ?? 12;
    const hashedPassword = await bcrypt.hash(dto.password, saltRounds);

    const token = CryptoUtil.randomNumber(8).toString();

    await this.redis.set(
      `email-verification:${dto.email}`,
      JSON.stringify({ ...dto, hashedPassword, token }),
      this.EMAIL_TTL,
    );

    await this.mailService.sendVerificationEmail(
      dto.email,
      'Verify your email',
      token,
    );
  }

  async verifyAccount(dto: VerifyEmailDto) {
    const key = `email-verification:${dto.email}`;
    const cached = await this.redis.get(key);

    if (!cached) throw new BadRequestException('Verification expired');

    const data = JSON.parse(cached);
    if (data.token !== dto.token) {
      throw new BadRequestException('Invalid OTP');
    }

    const user = await this.userRepo.create({
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      hashedPassword: data.hashedPassword,
      slug: SlugifyUtil.createSlug(data.fullName),
      status: UserStatus.ACTIVE,
    });

    await this.addressRepo.createAddress(
      user.id,
      data.address,
      data.fullName,
      data.phone,
    );

    await this.rbacService.assignRole(user.id, 'user');
    await this.redis.del(key);

    return UserMapper.toUserResponse(user);
  }

  // ======================= SIGN IN =======================

  async signin(
    email: string,
    password: string,
    device?: string,
    ipAddress?: string,
  ) {
    const user = await this.userRepo.findUnique({ email });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const isMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!isMatch) throw new UnauthorizedException('Invalid credentials');

    if (user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('User not activated');
    }

    const session = await this.sessionService.create(
      user.id,
      device,
      ipAddress,
    );

    const { roleNames, perrmissionNames } =
      await this.userRoleRepo.getUserRolesPermissions(user.id);

    const accessToken = this.tokenService.signAccessToken({
      sub: user.id,
      sessionId: session.id,
      roles: roleNames,
      permissions: perrmissionNames,
    });

    const refreshToken = this.tokenService.signRefreshToken(
      { sub: user.id, sessionId: session.id },
      session.privateKey,
    );

    await this.sessionService.attachRefreshToken(session.id, refreshToken);

    return {
      accessToken,
      refreshToken,
      sessionId: session.id,
      user: UserMapper.toUserResponse(user),
    };
  }

  // ======================= CURRENT USER =======================

  async getCurrent(userId: string) {
    const user = await this.userRepo.findUnique({ id: userId });
    if (!user || user.status !== UserStatus.ACTIVE) {
      throw new BadRequestException('User inactive');
    }
    return UserMapper.toUserResponse(user);
  }

  // ======================= REFRESH TOKEN =======================

  async refresh(refreshToken: string) {
    const payload = this.tokenService.decode(refreshToken);

    if (!payload || typeof payload === 'string') {
      throw new UnauthorizedException();
    }

    const { sub: userId, sessionId } = payload;

    const session = await this.sessionService.getSessionForRefresh(sessionId);

    this.tokenService.verifyRefreshToken(refreshToken, session.publicKey);

    const { roleNames, perrmissionNames } =
      await this.userRoleRepo.getUserRolesPermissions(userId);

    const newAccessToken = this.tokenService.signAccessToken({
      sub: userId!,
      sessionId,
      roles: roleNames,
      permissions: perrmissionNames,
    });

    const newRefreshToken = this.tokenService.signRefreshToken(
      { sub: userId!, sessionId },
      session.privateKey,
    );

    await this.sessionService.attachRefreshToken(sessionId, newRefreshToken);

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    };
  }

  // ======================= Resend verification email =======================

  async resendVerificationEmail(email: string) {
    const key = `email-verification:${email}`;
    const cached = await this.redis.get(key);

    if (!cached) {
      throw new BadRequestException('No pending verification');
    }

    const data = JSON.parse(cached);

    const newToken = CryptoUtil.randomNumber(8).toString();
    data.token = newToken;

    await this.redis.set(key, JSON.stringify(data), this.EMAIL_TTL);

    await this.mailService.sendVerificationEmail(
      email,
      'Verify your email',
      newToken,
    );
  }

  // ======================= LOGOUT =======================

  async logout(sessionId: string) {
    await this.sessionService.revoke(sessionId);
  }

  async logoutAll(userId: string) {
    await this.sessionService.revokeAll(userId);
  }
}
