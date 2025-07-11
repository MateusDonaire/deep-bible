import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class GetPopularTopicsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute() {
    const topics = await this.prisma.topic.findMany({
      where: {
        count: { gte: 1 },
      },
      orderBy: {
        count: 'desc',
      },
      take: 7,
    });

    return {
      totalUniqueTopics: await this.prisma.topic.count(),
      popularTopics: topics.map(t => ({
        topic: t.name,
        description: t.description,
      })),
    };
  }
}
