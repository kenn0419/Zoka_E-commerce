import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './services/auth.service';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';
import { MailModule } from 'src/infrastructure/mail/mail.module';
import { RedisModule } from 'src/infrastructure/redis/redis.module';
import { AuthRepository } from './auth.repository';
import { UserModule } from '../user/user.module';
import { RbacModule } from '../rbac/rbac.module';
import { SessionService } from './services/session.service';
import { TokenService } from './services/token.service';
import { AddressModule } from '../address/address.module';

@Module({
  imports: [
    PrismaModule,
    MailModule,
    RedisModule,
    UserModule,
    RbacModule,
    AddressModule,
  ],
  exports: [SessionService, TokenService],
  controllers: [AuthController],
  providers: [AuthService, AuthRepository, SessionService, TokenService],
})
export class AuthModule {}
