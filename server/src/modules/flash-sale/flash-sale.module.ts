import { Module } from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service';
import { FlashSaleController } from './flash-sale.controller';
import { FlashSaleRepository } from './flash-sale.repository';
import { NotificationModule } from '../notification/notification.module';
import { ProductModule } from '../product/product.module';
import { ShopModule } from '../shop/shop.module';
import { FlashSaleScheduler } from './flash-sale.scheduler';

@Module({
  imports: [NotificationModule, ProductModule, ShopModule],
  controllers: [FlashSaleController],
  providers: [FlashSaleService, FlashSaleRepository, FlashSaleScheduler],
})
export class FlashSaleModule {}
