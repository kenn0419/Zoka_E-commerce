import { Module, OnModuleInit } from '@nestjs/common';
import { PrismaModule } from './infrastructure/prisma/prisma.module';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { CategoryModule } from './modules/category/category.module';
import { RedisModule } from './infrastructure/redis/redis.module';
import { MailModule } from './infrastructure/mail/mail.module';
import { ProfileModule } from './modules/profile/profile.module';
import jwtConfig from './config/jwt.config';
import { JwtGlobalModule } from './config/jwt.module';
import { ProductModule } from './modules/product/product.module';
import { ShopModule } from './modules/shop/shop.module';
import { RbacModule } from './modules/rbac/rbac.module';
import { CartModule } from './modules/cart/cart.module';
import { CouponModule } from './modules/coupon/coupon.module';
import { OrderModule } from './modules/order/order.module';
import { ChatModule } from './modules/chat/chat.module';
import { AuthCoreModule } from './common/auth/auth-core.module';
import { CatalogModule } from './modules/catalog/catalog.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { ScheduleModule } from '@nestjs/schedule';
import { AddressModule } from './modules/address/address.module';
import { PaymentModule } from './modules/payment/payment.module';
import { CommentModule } from './modules/comment/comment.module';
import { NotificationModule } from './modules/notification/notification.module';
import { FlashSaleModule } from './modules/flash-sale/flash-sale.module';
import { ShopFollowerModule } from './modules/shop-follower/shop-follower.module';
import { StatisticsModule } from './modules/statistics/statistics.module';
import { AiAgentModule } from './modules/ai-agent/ai-agent.module';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { APP_GUARD, APP_INTERCEPTOR } from '@nestjs/core';
import { IdempotencyInterceptor } from './common/interceptors/idempotency.interceptor';

@Module({
  imports: [
    ThrottlerModule.forRoot([{
      ttl: 60000,
      limit: 100,
    }]),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [jwtConfig],
    }),
    AuthCoreModule,
    JwtGlobalModule,
    RedisModule,
    PrismaModule,
    UserModule,
    AuthModule,
    CategoryModule,
    MailModule,
    ProfileModule,
    ProductModule,
    ShopModule,
    RbacModule,
    CartModule,
    CouponModule,
    OrderModule,
    ChatModule,
    CatalogModule,
    AddressModule,
    PaymentModule,
    CommentModule,
    FlashSaleModule,
    NotificationModule,
    NotificationModule,
    FlashSaleModule,
    ShopFollowerModule,
    StatisticsModule,
    AiAgentModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
    {
      provide: APP_INTERCEPTOR,
      useClass: IdempotencyInterceptor,
    },
  ],
})
export class AppModule {}
