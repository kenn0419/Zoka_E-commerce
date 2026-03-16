import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { ShopResponseDto } from '../shop/dto/shop-response.dto';

@Controller('catalogs')
export class CatalogController {
  constructor(private readonly catalogService: CatalogService) {}

  @Get('/shop-by-product/:productSlug')
  @Serialize(ShopResponseDto, 'Get detail shop successfully!')
  fetchDetailShopByProductSlug(@Param('productSlug') productSlug) {
    return this.catalogService.findShopByProductSlug(productSlug);
  }
}
