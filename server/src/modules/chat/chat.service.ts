import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { SendMessageDto } from './dto/send-message.dto';
import { UserRepository } from '../user/repositories/user.repository';
import { RbacRepository } from '../rbac/rbac.repository';
import { Role } from 'src/common/enums/role.enum';
import { ConversationMapper } from 'src/common/mappers/conversation.mapper';
import { CHAT_AI_AGENT_ID } from 'src/common/constants/ai-agent.constant';

@Injectable()
export class ChatService {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly conversationRepo: ConversationRepository,
    private readonly userRepo: UserRepository,
    private readonly rbacRepo: RbacRepository,
  ) {}

  async canJoinConversation(
    userId: string,
    conversationId: string,
  ): Promise<boolean> {
    const conversation = await this.conversationRepo.findUnique(
      { id: conversationId },
      {
        buyerId: true,
        sellerId: true,
      },
    );

    if (!conversation) return false;

    return conversation.buyerId === userId || conversation.sellerId === userId;
  }

  async getConversationWithContext(conversationId: string) {
    const conversation = await this.conversationRepo.findUnique({
      id: conversationId,
    });
    if (!conversation) {
      throw new BadRequestException('Conversation not found');
    }
    return conversation;
  }

  async getOrCreateAiConversation(userId: string) {
    return await this.conversationRepo.ensureConversationWithAI(userId);
  }

  async sendMessage(senderId: string, dto: SendMessageDto, metadata: any = {}) {
    let conversationId = dto.conversationId;

    if (!conversationId) {
      if (!dto.receiverId) {
        throw new WsException(
          'Either conversationId or receiverId must be provided',
        );
      }

      // Find or create conversation
      const existing = await this.conversationRepo.findConversation(
        dto.receiverId,
        senderId,
      );

      if (existing) {
        conversationId = existing.id;
      } else {
        const newConversation =
          await this.conversationRepo.prisma.conversation.create({
            data: {
              buyerId: senderId,
              sellerId: dto.receiverId,
            },
          });
        conversationId = newConversation.id;
      }
    }

    const conversation = await this.conversationRepo.findByIdAndUser(
      conversationId,
      senderId,
    );

    if (!conversation) {
      throw new WsException('Forbidden');
    }

    const message = await this.messageRepo.create({
      conversationId,
      senderId,
      content: dto.content,
      isRead: false,
      metadata: metadata || {},
    });

    await this.conversationRepo.updateConversation(
      { id: conversationId },
      { updatedAt: new Date() },
    );

    return message;
  }

  async markConversationAsRead(conversationId: string, userId: string) {
    await this.messageRepo.markConversationAsRead(conversationId, userId);
  }

  async findUserConversations(userId: string, cursor?: string, limit = 10) {
    const adminUser = await this.userRepo.findByRole(Role.ADMIN);

    if (!adminUser) {
      throw new BadRequestException('Admin not found');
    }

    await this.conversationRepo.ensureConversationWithAdmin(
      userId,
      adminUser.id,
    );

    await this.conversationRepo.ensureConversationWithAI(userId);

    const conversations = await this.conversationRepo.findUserConversations(
      userId,
      cursor,
      limit,
    );

    const hasNextPage = conversations.length > limit;
    const items = hasNextPage ? conversations.slice(0, limit) : conversations;

    const nextCursor = items.length > 0 ? items[items.length - 1].id : null;

    return {
      items: items.map((c) =>
        ConversationMapper.toConversationResponse(c, userId),
      ),
      meta: {
        nextCursor,
        hasNextPage,
      },
    };
  }

  async findMessageByConversation(
    conversationId: string,
    userId: string,
    cursor?: string,
    limit = 20,
  ) {
    const messages = await this.messageRepo.findByConversation(
      conversationId,
      userId,
      cursor,
      limit,
    );

    const hasNextPage = messages.length > limit;
    const items = hasNextPage ? messages.slice(0, limit) : messages;
    const nextCursor = items.length > 0 ? items[items.length - 1].id : null;

    return {
      items: items.reverse(),
      nextCursor,
      hasNextPage,
    };
  }
}
