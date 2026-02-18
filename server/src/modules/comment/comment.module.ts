import { Module } from '@nestjs/common';
import { CommentService } from './comment.service';
import { CommentController } from './comment.controller';
import { OrderModule } from '../order/order.module';
import { CommentRepository } from './repositories/comment.repository';
import { UploadModule } from 'src/infrastructure/upload/upload.module';
import { ProductModule } from '../product/product.module';
import { CommentReplyRepository } from './repositories/comment-reply.repository';

@Module({
  imports: [OrderModule, UploadModule, ProductModule],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository, CommentReplyRepository],
})
export class CommentModule {}
