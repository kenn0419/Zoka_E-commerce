import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { AiAgentService } from './ai-agent.service';
import { ChatRequestDto } from './dto/chat-request.dto';
import { JwtSessionGuard } from '../../common/guards/jwt-session.guard';
import { Serialize } from 'src/common/decorators/serialize.decorator';
import { AiAgentResponseDto } from './responses/ai-agent.response.dto';

@Controller('ai-agent')
export class AiAgentController {
  constructor(private readonly aiAgentService: AiAgentService) {}

  @Post('chat')
  @UseGuards(JwtSessionGuard)
  @Serialize(AiAgentResponseDto, 'Result returns.')
  chat(@Body() chatRequestDto: ChatRequestDto) {
    return this.aiAgentService.chat(chatRequestDto);
  }
}
