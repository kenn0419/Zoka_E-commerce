import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateway } from './chat.gateway';
import { MessageRepository } from './repositories/message.repository';
import { ConversationRepository } from './repositories/conversation.repository';
import { UserModule } from '../user/user.module';
import { RbacModule } from '../rbac/rbac.module';
import { ChatController } from './chat.controller';
import { AuthCoreModule } from '../../common/auth/auth-core.module';
import { AiAgentModule } from '../ai-agent/ai-agent.module';

@Module({
  imports: [UserModule, RbacModule, AuthCoreModule, AiAgentModule],
  controllers: [ChatController],
  providers: [
    ChatGateway,
    ChatService,
    MessageRepository,
    ConversationRepository,
  ],
})
export class ChatModule {}
