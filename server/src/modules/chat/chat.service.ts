import { BadRequestException, Injectable } from '@nestjs/common';
import { WsException } from '@nestjs/websockets';
import { ConversationRepository } from './repositories/conversation.repository';
import { MessageRepository } from './repositories/message.repository';
import { SendMessageDto } from './dto/send-message.dto';
import { UserRepository } from '../user/repositories/user.repository';
import { RbacRepository } from '../rbac/rbac.repository';
import { Role } from 'src/common/enums/role.enum';
import { ConversationMapper } from 'src/common/mappers/conversation.mapper';

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

  async sendMessage(senderId: string, dto: SendMessageDto) {
    const conversation = await this.conversationRepo.findByIdAndUser(
      dto.conversationId,
      senderId,
    );

    if (!conversation) {
      throw new WsException('Forbidden');
    }

    const message = await this.messageRepo.create({
      conversationId: dto.conversationId,
      senderId,
      content: dto.content,
      isRead: false,
    });

    await this.conversationRepo.updateConversation(
      { id: conversation.id },
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

    return {
      items: items.reverse(),
      nextCursor: items.at(-1)?.id ?? null,
      hasNextPage,
    };
  }
}
