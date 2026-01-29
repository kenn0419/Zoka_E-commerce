import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCatalogDto } from './dto/create-catalog.dto';
import { UpdateCatalogDto } from './dto/update-catalog.dto';
import { ShopRepository } from '../shop/shop.repository';
import { ProductRepository } from '../product/repositories/product.repository';

@Injectable()
export class CatalogService {
  constructor(
    private readonly shopRepo: ShopRepository,
    private readonly productRepo: ProductRepository,
  ) {}

  async findShopByProductSlug(slug: string) {
    const product = await this.productRepo.findUnique({ slug });
    if (!product) throw new NotFoundException('Product not found');

    return this.shopRepo.findUnique({ id: product.shopId });
  }
}
