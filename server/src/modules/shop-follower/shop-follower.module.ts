import { Module } from '@nestjs/common';
import { ShopFollowerService } from './shop-follower.service';
import { ShopFollowerController } from './shop-follower.controller';
import { ShopFollowerRepository } from './shop-follower.repository';

@Module({
  controllers: [ShopFollowerController],
  providers: [ShopFollowerService, ShopFollowerRepository],
  exports: [ShopFollowerRepository],
})
export class ShopFollowerModule {}
