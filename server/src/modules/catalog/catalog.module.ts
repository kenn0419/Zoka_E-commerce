import { Module } from '@nestjs/common';
import { CatalogService } from './catalog.service';
import { CatalogController } from './catalog.controller';
import { ShopModule } from '../shop/shop.module';
import { ProductModule } from '../product/product.module';

@Module({
  imports: [ShopModule, ProductModule],
  controllers: [CatalogController],
  providers: [CatalogService],
})
export class CatalogModule {}
