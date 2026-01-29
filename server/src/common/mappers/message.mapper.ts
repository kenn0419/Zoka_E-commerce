export class MessageMapper {
  static toMessageResponse(message) {
    return {
      id: message.id,
      conversationId: message.conversationId,
      sender: {
        id: message.sender.id,
        fullName: message.sender.fullName,
        avatarUrl: message.sender.avatarUrl,
      },
      content: message.content,
      isRead: message.isRead,
      readAt: message.readAt,
      createdAt: message.createdAt,
    };
  }
}
