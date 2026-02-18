import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { PaginatedSort } from '../enums/pagination.enum';

export class PaginatedQueryDto<TSort = PaginatedSort> {
  @IsOptional()
  @IsString()
  search: string = '';

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;

  @IsOptional()
  @IsEnum(PaginatedSort)
  sort?: TSort;
}

export class CursorPaginatedQueryDto<TSort = PaginatedSort> {
  @IsOptional()
  @IsString()
  search: string = '';

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit: number = 20;

  @IsOptional()
  @IsEnum(PaginatedSort)
  sort?: TSort;
}
