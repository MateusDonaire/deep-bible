import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class GetAllTopicsUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(params: { limit?: number; offset?: number }) {
    const limit = params.limit ?? 50;
    const offset = params.offset ?? 0;

    const topics = await this.prisma.topic.findMany({
      skip: offset,
      take: limit,
      orderBy: {
        count: 'desc',
      },
    });

    const total = await this.prisma.topic.count();

    return {
      total,
      topics: topics.map((t) => ({
        id: t.id,
        topic: t.name,
        description: t.description,
      })),
    };
  }
}
