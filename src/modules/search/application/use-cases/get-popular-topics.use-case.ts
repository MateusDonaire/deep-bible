// src/modules/topic/application/use-cases/get-popular-topics.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { ITopicRepository } from '../../domain/interfaces/topic-repository.interface';

@Injectable()
export class GetPopularTopicsUseCase {
  constructor(
    @Inject('ITopicRepository')
    private readonly topicRepo: ITopicRepository,
  ) {}

  async execute() {
    const popularTopics = await this.topicRepo.findPopular(7);
    const totalUniqueTopics = await this.topicRepo.count();

    return {
      totalUniqueTopics,
      popularTopics: popularTopics.map(t => ({
        topic: t.topic,
        description: t.description,
      })),
    };
  }
}
