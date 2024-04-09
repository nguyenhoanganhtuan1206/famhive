import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import type {
  ChatCompletionFunctions,
  ChatCompletionRequestMessage,
} from 'openai';
import { Configuration, OpenAIApi } from 'openai';

import { ApiConfigService } from './api-config.service';

@Injectable()
export class ChatGPTService {
  private openAiApi: OpenAIApi;

  constructor(private apiConfigService: ApiConfigService) {
    this.openAiApi = new OpenAIApi(
      new Configuration({
        apiKey: this.apiConfigService.openAIConfig.OPENAI_API_KEY,
      }),
    );
  }

  async getChatCompletion(
    chatContext: ChatCompletionRequestMessage[],
    topP: number,
    temperature: number,
    functions: ChatCompletionFunctions[],
  ) {
    try {
      return await this.openAiApi.createChatCompletion({
        model: 'gpt-3.5-turbo-0613',
        messages: chatContext,
        temperature,
        top_p: topP,
        functions,
        function_call: { name: functions[0].name },
      });
    } catch (error) {
      Logger.error(`OpenAI request error: ${error}`, {
        openAIRequestError: error.response.data,
      });

      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      throw new InternalServerErrorException('OpenAI request error', error);
    }
  }
}
