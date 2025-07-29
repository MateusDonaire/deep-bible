// src/modules/topic/infra/repositories/topic.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { ITopicRepository } from '../../domain/interfaces/topic-repository.interface';
import { TopicEntity } from '../../domain/entities/topic.entity';

@Injectable()
export class TopicRepository implements ITopicRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(limit: number, offset: number): Promise<TopicEntity[]> {
    const topics = await this.prisma.topic.findMany({
      skip: offset,
      take: limit,
      orderBy: { count: 'desc' },
    });

    return topics.map((t) => ({
      id: t.id,
      topic: t.name,
      description: t.description,
    }));
  }

  async count(): Promise<number> {
    return this.prisma.topic.count();
  }

  async findPopular(limit: number): Promise<TopicEntity[]> {
    const topics = await this.prisma.topic.findMany({
      where: {
        count: { gte: 1 },
      },
      orderBy: { count: 'desc' },
      take: limit,
    });

    return topics.map((t) => ({
      id: t.id,
      topic: t.name,
      description: t.description,
    }));
  }
}