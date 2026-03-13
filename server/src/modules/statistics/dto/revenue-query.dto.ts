import { IsEnum, IsOptional } from 'class-validator';

export enum StatisticsPeriod {
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
}

export class RevenueQueryDto {
  @IsOptional()
  @IsEnum(StatisticsPeriod)
  period: StatisticsPeriod = StatisticsPeriod.DAY;

  @IsOptional()
  startDate?: string;

  @IsOptional()
  endDate?: string;
}
