import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { SearchResultEntity } from '../../domain/entities/search-result.entity';
import { IVerseSearchRepository } from '../../domain/interfaces/search-verce-repository.interface';

@Injectable()
export class VerseSearchRepository implements IVerseSearchRepository {
  constructor(private readonly prisma: PrismaService) {}

  async searchByEmbedding(embedding: number[]): Promise<SearchResultEntity[]> {
    const embeddingStr = `[${embedding.join(',')}]`;

    const results = await this.prisma.$queryRawUnsafe(`
      SELECT id, book, chapter, verse, text, topics,
             1 - (embedding <#> '${embeddingStr}'::vector) AS score
      FROM "Verse"
      ORDER BY embedding <#> '${embeddingStr}'::vector
      LIMIT 10
    `);

    return (results as any[]).map((v) => ({
      reference: `${v.book} ${v.chapter}:${v.verse}`,
      text: v.text,
      topics: v.topics ?? [],
    }));
  }
}
