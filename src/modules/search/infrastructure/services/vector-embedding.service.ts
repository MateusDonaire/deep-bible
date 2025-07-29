import { Injectable } from '@nestjs/common';
import OpenAI from 'openai';
import { IVectorEmbeddingService } from '../../domain/interfaces/vector-embedding-service.interface';

@Injectable()
export class VectorEmbeddingService implements IVectorEmbeddingService {
  private readonly openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  async embed(query: string): Promise<number[]> {
    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });

    return response.data[0].embedding;
  }
}
