import { ConflictException, Injectable } from '@nestjs/common';
import { UpdateShopFollowerDto } from './dto/update-shop-follower.dto';
import { ShopFollowerRepository } from './shop-follower.repository';

@Injectable()
export class ShopFollowerService {
  constructor(private readonly shopFollowerRepo: ShopFollowerRepository) {}

  async follow(userId: string, shopId: string) {
    const existing = await this.shopFollowerRepo.finUnique({
      shopId_userId: { shopId, userId },
    });
    if (existing) {
      throw new ConflictException('Already followered.');
    }
    return this.shopFollowerRepo.follow(userId, shopId);
  }

  async unfollow(userId: string, shopId: string) {
    return this.shopFollowerRepo.unfollow(userId, shopId);
  }

  countFollowers(shopId: string) {
    return this.shopFollowerRepo.countFollowers(shopId);
  }

  findFollowerByShopId(shopId: string) {
    return this.shopFollowerRepo.findFollowerByShopId(shopId);
  }

  findFollowingByUserId(userId: string) {
    return this.shopFollowerRepo.findFollowingByUserId(userId);
  }
}
