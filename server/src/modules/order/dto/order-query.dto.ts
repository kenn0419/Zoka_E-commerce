import { IsEnum, IsOptional } from 'class-validator';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { OrderSort } from 'src/common/enums/order.enum';

export class OrderQueryDto extends PaginatedQueryDto<OrderSort> {
  @IsOptional()
  @IsEnum(OrderSort)
  sort: OrderSort = OrderSort.OLDEST;
}
