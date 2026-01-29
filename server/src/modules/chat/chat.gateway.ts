import {
  WebSocketGateway,
  SubscribeMessage,
  WebSocketServer,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { SendMessageDto } from './dto/send-message.dto';
import { WsJwtSessionGuard } from 'src/common/guards/ws-jwt.guard';

// @UseGuards(WsJwtSessionGuard)
@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: 'http://localhost:5173', credentials: true },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(private readonly chatService: ChatService) {}

  afterInit() {
    console.log('🔥 ChatGateway init');
  }

  handleConnection(client: Socket) {
    // if (!client.data?.userId) {
    //   client.disconnect();
    //   return;
    // }

    console.log('User connected:', client.data.userId);
  }

  @SubscribeMessage('join_conversation')
  async joinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    console.log('📥 join_conversation', {
      userId: client.data.userId,
      conversationId,
    });
    const userId = client.data.userId;

    const canJoin = await this.chatService.canJoinConversation(
      userId,
      conversationId,
    );

    if (!canJoin) {
      client.emit('error', 'Unauthorized conversation');
      return;
    }

    client.join(conversationId);

    await this.chatService.markConversationAsRead(conversationId, userId);

    this.server.to(conversationId).emit('message_read', {
      conversationId,
      readerId: userId,
    });
  }

  @SubscribeMessage('leave_conversation')
  leave(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    client.leave(conversationId);
  }

  @SubscribeMessage('send_message')
  async sendMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() dto: SendMessageDto,
  ) {
    const userId = client.data.userId;
    console.log(userId);
    const message = await this.chatService.sendMessage(userId, dto);

    this.server.to(dto.conversationId).emit('new_message', message);

    return {
      status: 'ok',
      messageId: message.id,
    };
  }

  @SubscribeMessage('mark_read')
  async markRead(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
    await this.chatService.markConversationAsRead(
      client.data.userId,
      conversationId,
    );

    this.server
      .to(conversationId)
      .emit('messages_read', { conversationId, userId: client.data.userId });
  }
}
