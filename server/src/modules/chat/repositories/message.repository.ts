import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/infrastructure/prisma/prisma.service';

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}

  create(data: {
    conversationId: string;
    senderId: string;
    content: string;
    isRead: boolean;
  }) {
    return this.prisma.message.create({
      data,
      select: {
        id: true,
        content: true,
        createdAt: true,
        sender: true,
      },
    });
  }

  findByConversation(
    conversationId: string,
    userId: string,
    cursor?: string,
    limit = 20,
  ) {
    return this.prisma.message.findMany({
      where: {
        conversationId,
        OR: [
          {
            conversation: {
              sellerId: userId,
            },
          },
          {
            conversation: {
              buyerId: userId,
            },
          },
        ],
      },
      orderBy: { createdAt: 'desc' },
      take: limit + 1,
      ...(cursor && {
        cursor: { id: cursor },
        skip: 1,
      }),
      include: {
        sender: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
          },
        },
      },
    });
  }

  markConversationAsRead(conversationId: string, userId: string) {
    return this.prisma.message.updateMany({
      where: {
        conversationId,
        senderId: { not: userId },
        isRead: false,
      },
      data: {
        isRead: true,
        readAt: new Date(),
      },
    });
  }
}
