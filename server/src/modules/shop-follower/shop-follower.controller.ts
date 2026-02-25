import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ShopFollowerService } from './shop-follower.service';
import { UpdateShopFollowerDto } from './dto/update-shop-follower.dto';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';

@Controller('shop-followers')
export class ShopFollowerController {
  constructor(private readonly shopFollowerService: ShopFollowerService) {}

  @Post(':shopId/follow')
  @UseGuards(JwtSessionGuard)
  follow(@Req() req, @Param('shopId') shopId: string) {
    return this.shopFollowerService.follow(req.user.sub, shopId);
  }

  @Post(':shopId/unfollow')
  @UseGuards(JwtSessionGuard)
  unfollow(@Req() req, @Param('shopId') shopId: string) {
    return this.shopFollowerService.unfollow(req.user.sub, shopId);
  }

  @Get(':shopId/count')
  countFollowers(@Param('shopId') shopId: string) {
    return this.shopFollowerService.countFollowers(shopId);
  }

  @Get(':shopId/followers')
  findFollowers(@Param('shopId') shopId: string) {
    return this.shopFollowerService.findFollowerByShopId(shopId);
  }

  @Get('following')
  @UseGuards(JwtSessionGuard)
  findFollowing(@Req() req) {
    return this.shopFollowerService.findFollowingByUserId(req.user.sub);
  }
}
