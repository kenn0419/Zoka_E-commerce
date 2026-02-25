import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  UploadedFiles,
  Req,
  Query,
} from '@nestjs/common';
import { CommentService } from './comment.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { CommentQueryDto } from './dto/comment-query.dto';
import {
  Serialize,
  SerializePaginated,
} from 'src/common/decorators/serialize.decorator';
import { CommentResponseDto } from './responses/comment.response.dto';
import { CreateReplyCommentDto } from './dto/create-reply-comment.dto';
import { CursorPaginatedQueryDto } from 'src/common/dto/paginated-query.dto';

@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @Post()
  @UseInterceptors(FilesInterceptor('images', 5))
  @UseGuards(JwtSessionGuard)
  @Serialize(CommentResponseDto, 'Comment product successfully.')
  create(
    @Req() req,
    @Body() data: CreateCommentDto,
    @UploadedFiles() images?: Express.Multer.File[],
  ) {
    return this.commentService.createComment(req.user.sub, data, images);
  }

  @Get('/product/:productSlug')
  @SerializePaginated(CommentResponseDto, 'Comments retrieved successfully.')
  findAll(
    @Param('productSlug') productSlug: string,
    @Query() query: CommentQueryDto,
  ) {
    return this.commentService.findAllReviewsWithProduct(productSlug, query);
  }

  @Get('/:reviewId/replies')
  @SerializePaginated(CommentResponseDto, 'Replies retrieved successfully.')
  findAllReplies(
    @Param('reviewId') reviewId: string,
    @Query() query: CursorPaginatedQueryDto,
  ) {
    return this.commentService.findAllReplies(reviewId, query);
  }

  @Get('can-review/:productId')
  @UseGuards(JwtSessionGuard)
  @Serialize(CommentResponseDto, 'Check review eligibility successfully.')
  canComment(@Req() req, @Param('productId') productId: string) {
    return this.commentService.canReview(req.user.sub, productId);
  }

  @Post(':id/reply')
  @UseGuards(JwtSessionGuard)
  replyComment(
    @Req() req,
    @Param('id') id: string,
    @Body() data: CreateReplyCommentDto,
  ) {
    return this.commentService.replyComment(req.user.sub, id, data.content);
  }

  @Patch(':id')
  @UseGuards(JwtSessionGuard)
  updateComment(
    @Req() req,
    @Param('id') id: string,
    @Body() data: UpdateCommentDto,
  ) {
    return this.commentService.updateComment(req.user.sub, id, data);
  }

  @Delete(':id')
  @UseGuards(JwtSessionGuard)
  deleteComment(@Req() req, @Param('id') id: string) {
    return this.commentService.deleteComment(req.user.sub, id);
  }

  @Delete('reply/:id')
  @UseGuards(JwtSessionGuard)
  deleteReplyComment(@Req() req, @Param('id') id: string) {
    return this.commentService.deleteReply(req.user.sub, id);
  }
}
