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
import { AiAgentService } from '../ai-agent/ai-agent.service';
import { CHAT_AI_AGENT_ID } from '../../common/constants/ai-agent.constant';

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
    private readonly aiAgentService: AiAgentService,
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
    const message = await this.chatService.sendMessage(userId, dto);

    // 1. Join room (in case it's a new conversation or client reconnected)
    client.join(message.conversationId);

    // 2. Emit the user message back to the room
    this.server.to(message.conversationId).emit('new_message', message);

    // 3. Check if this is a conversation with the AI Agent
    const conversation = await this.chatService.getConversationWithContext(message.conversationId);
    const isAiConversation = conversation.buyerId === CHAT_AI_AGENT_ID || conversation.sellerId === CHAT_AI_AGENT_ID;

    if (isAiConversation) {
      // Trigger AI Response in background
      this.handleAiResponse(message.conversationId, userId, dto.content);
    }

    return {
      status: 'ok',
      messageId: message.id,
      conversationId: message.conversationId,
    };
  }

  private async handleAiResponse(conversationId: string, userId: string, userMessage: string) {
    try {
      // 1. Notify client that AI is thinking
      this.server.to(conversationId).emit('ai_thinking', { conversationId, thinking: true });

      // 2. Get history for context
      const historyItems = await this.chatService.findMessageByConversation(conversationId, userId, undefined, 10);
      
      // Map history to Gemini format: { role: 'user' | 'model', parts: [{ text: string }] }
      const history = historyItems.items.map(m => ({
        role: m.senderId === CHAT_AI_AGENT_ID ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));

      // 3. Call AI Agent
      const aiResult = await this.aiAgentService.chat({
        message: userMessage,
        history: history.slice(0, -1), // Exclude the message we just sent
      });

      // 4. Save AI response
      const aiMessage = await this.chatService.sendMessage(CHAT_AI_AGENT_ID, {
        conversationId,
        content: aiResult.message,
      }, { products: aiResult.data });

      // 5. Emit AI response
      this.server.to(conversationId).emit('new_message', aiMessage);
    } catch (error) {
      console.error('AI Response Error:', error);
      
      // Send error message to user
      const errorMessage = {
        id: `error-${Date.now()}`,
        conversationId,
        senderId: CHAT_AI_AGENT_ID,
        content: 'Rất tiếc, tôi đang gặp lỗi kỹ thuật khi xử lý câu hỏi của bạn. Vui lòng thử lại sau nhé!',
        createdAt: new Date(),
        sender: {
          id: CHAT_AI_AGENT_ID,
          fullName: 'Zoka AI Assistant',
          avatarUrl: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png', // Fallback avatar
        },
        metadata: {
          type: 'error',
          error: error.message,
        },
      };
      this.server.to(conversationId).emit('new_message', errorMessage);
    } finally {
      // 6. Stop thinking status
      this.server.to(conversationId).emit('ai_thinking', { conversationId, thinking: false });
    }
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
