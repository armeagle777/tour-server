import { Injectable, ServiceUnavailableException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import OpenAI from 'openai';
import { AppConfig } from '../../config/configuration';
import { AIProvider, AiProviderRequest } from './ai-provider.interface';

@Injectable()
export class OpenAIProvider implements AIProvider {
  private readonly client: OpenAI | null;
  private readonly model: string;

  constructor(config: ConfigService<AppConfig, true>) {
    const apiKey = config.get('openai.apiKey', { infer: true });
    this.model = config.get('openai.model', { infer: true });
    this.client = apiKey ? new OpenAI({ apiKey }) : null;
  }

  async generateText(request: AiProviderRequest): Promise<string> {
    if (!this.client) {
      throw new ServiceUnavailableException('OPENAI_API_KEY is not configured');
    }

    const completion = await this.client.chat.completions.create({
      model: this.model,
      temperature: request.temperature ?? 0.2,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: request.system },
        { role: 'user', content: request.user },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new ServiceUnavailableException('OpenAI returned an empty response');
    }

    return content;
  }
}
