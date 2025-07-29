import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { IAIService } from '../../domain/interfaces/ai-service.interface';

@Injectable()
export class AiService implements IAIService {
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async ask(prompt: string): Promise<string> {
    const response = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    return response.choices[0].message.content || '';
  }
}
