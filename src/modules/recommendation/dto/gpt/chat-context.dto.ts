import { ApiProperty } from '@nestjs/swagger';
import { IsArray } from 'class-validator';
import type { ChatCompletionRequestMessage } from 'openai';

import { ChatContextSwaggerDto } from './chat-context-swagger.dto';

export class GPTChatContextDto {
  @ApiProperty({
    isArray: true,
    type: ChatContextSwaggerDto,
  })
  @IsArray()
  chatContext: ChatCompletionRequestMessage[];
}
