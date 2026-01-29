import { Controller, Get, Param, Query, Req, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtSessionGuard } from 'src/common/guards/jwt-session.guard';
import { SerializePaginated } from 'src/common/decorators/serialize.decorator';
import { ConversationResponse } from './dto/conversation-response.dto';
import { PaginatedQueryDto } from 'src/common/dto/paginated-query.dto';
import { MessageResponseDto } from './dto/message-response.dto';

@Controller('chats')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get('conversations')
  @UseGuards(JwtSessionGuard)
  @SerializePaginated(
    ConversationResponse,
    'Get all my conversations successfully!',
  )
  findMyConversations(
    @Req() req,
    @Query('cursor') cursor: string,
    @Query('limit') limit: string,
  ) {
    const take = Number(limit);
    return this.chatService.findUserConversations(
      req.user.sub,
      cursor,
      Number.isNaN(take) ? 10 : take,
    );
  }

  @Get('messages/:conversationId')
  @UseGuards(JwtSessionGuard)
  @SerializePaginated(
    MessageResponseDto,
    'Get all my conversations successfully!',
  )
  findMessages(
    @Req() req,
    @Param('conversationId') conversationId: string,
    @Query('cursor') cursor: string,
    @Query('limit') limit: string,
  ) {
    const take = Number(limit);
    return this.chatService.findMessageByConversation(
      req.user.sub,
      conversationId,
      cursor,
      Number.isNaN(take) ? 10 : take,
    );
  }
}
