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
import { AuthCoreService } from '../../common/auth/auth-core.service';
import * as cookie from 'cookie';

// @UseGuards(WsJwtSessionGuard)
@WebSocketGateway({
  namespace: 'chat',
  cors: { origin: 'http://localhost:5173', credentials: true },
})
export class ChatGateway {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private readonly authCoreService: AuthCoreService,
  ) {}

  afterInit() {
    console.log('🔥 ChatGateway init');
  }

  async handleConnection(client: Socket) {
    try {
      const cookies = client.handshake.headers.cookie;
      if (!cookies) throw new Error('Missing cookies');

      const parsed = cookie.parse(cookies);
      const token = parsed.accessToken;
      if (!token) throw new Error('Missing access token');

      const payload = await this.authCoreService.verifyAccessToken(token);

      client.data.user = payload;
      client.data.userId = payload.sub;

      console.log('User connected:', client.data.userId);
    } catch (err) {
      console.log('WS Auth error:', err.message);
      client.disconnect();
    }
  }

  @SubscribeMessage('join_conversation')
  async joinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() conversationId: string,
  ) {
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
