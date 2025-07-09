import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import OpenAI from 'openai';

@Injectable()
export class SearchVersesUseCase {
  private openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  constructor(private readonly prisma: PrismaService) {}

  async execute(query: string) {
    if (!query || query.length < 2) {
      throw new Error('A consulta deve ter pelo menos 2 caracteres.');
    }

    const response = await this.openai.embeddings.create({
      model: 'text-embedding-ada-002',
      input: query,
    });

    const queryEmbedding = response.data[0].embedding;

    const embeddingStr = `[${queryEmbedding.join(',')}]`;

    const results = await this.prisma.$queryRawUnsafe<any[]>(`
      SELECT id, book, chapter, verse, text, topics,
             1 - (embedding <#> '${embeddingStr}'::vector) AS score
      FROM "Verse"
      ORDER BY embedding <#> '${embeddingStr}'::vector
      LIMIT 10
    `);

    return results.map((v) => ({
      reference: `${v.book} ${v.chapter}:${v.verse}`,
      text: v.text,
      score: Number(v.score.toFixed(4)),
      topics: v.topics ?? [],
    }));
  }
}
