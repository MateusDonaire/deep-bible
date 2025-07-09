import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class GetPopularTopicsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const verses = await this.prisma.verse.findMany({
      select: { topics: true },
      where: {
        NOT: {
          OR: [
            { topics: { equals: [] } },
            { topics: { equals: null } },
          ],
        },
      },
    });

    const frequencyMap: Record<string, number> = {};

    for (const verse of verses) {
      for (const topic of verse.topics ?? []) {
        const key = topic.trim().toLowerCase();
        frequencyMap[key] = (frequencyMap[key] || 0) + 1;
      }
    }

    const sortedTopics = Object.entries(frequencyMap)
      .filter(([_, count]) => count >= 1)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 262)
      .map(([topic, count]) => ({ topic, count }));

    return {
      totalUniqueTopics: Object.keys(frequencyMap).length,
      popularTopics: sortedTopics,
    };
  }
}
