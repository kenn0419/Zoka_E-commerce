import { Module } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { AiAgentController } from './ai-agent.controller';
import { ProductModule } from '../product/product.module';
import { CategoryModule } from '../category/category.module';
import { PrismaModule } from 'src/infrastructure/prisma/prisma.module';

@Module({
  imports: [ProductModule, CategoryModule, PrismaModule],
  controllers: [AiAgentController],
  providers: [AiAgentService],
  exports: [AiAgentService],
})
export class AiAgentModule {}
