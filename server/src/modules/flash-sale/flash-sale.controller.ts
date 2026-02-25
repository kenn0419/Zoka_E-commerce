import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { FlashSaleService } from './flash-sale.service';
import { CreateFlashSaleDto } from './dto/create-flash-sale.dto';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import {
  Serialize,
  SerializePaginated,
} from 'src/common/decorators/serialize.decorator';
import { FlashSaleResponseDto } from './responses/flash-sale.response.dto';
import { FlashSaleQueryDto } from './dto/flash-sale-query.dto';

@Controller('flash-sales')
export class FlashSaleController {
  constructor(private readonly flashSaleService: FlashSaleService) {}

  @Post(':shopId')
  @UseGuards(JwtSessionGuard)
  @Serialize(FlashSaleResponseDto, 'Create flash sale successfully.')
  create(
    @Req() req,
    @Param('shopId') shopId: string,
    @Body() data: CreateFlashSaleDto,
  ) {
    return this.flashSaleService.create(req.user.sub, shopId, data);
  }

  @Get(':shopId')
  @UseGuards(JwtSessionGuard)
  @SerializePaginated(FlashSaleResponseDto, 'Get flash sales successfully.')
  getFlashSalesByShop(
    @Req() req,
    @Param('shopId') shopId: string,
    @Query() query: FlashSaleQueryDto,
  ) {
    return this.flashSaleService.getFlashSalesByShop(
      req.user.sub,
      shopId,
      query,
    );
  }

  @Get(':shopId/active')
  @SerializePaginated(
    FlashSaleResponseDto,
    'Get active flash sales successfully.',
  )
  getActiveFlashSalesByShop(
    @Req() req,
    @Param('shopId') shopId: string,
    @Query() query: FlashSaleQueryDto,
  ) {
    return this.flashSaleService.getActiveFlashSalesByShop(
      req.user.sub,
      shopId,
      query,
    );
  }

  @Get('active')
  @SerializePaginated(
    FlashSaleResponseDto,
    'Get active flash sales successfully.',
  )
  getActiveFlashSales(@Query() query: FlashSaleQueryDto) {
    return this.flashSaleService.getActiveFlashSales(query);
  }
}
