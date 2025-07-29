// src/modules/topic/application/use-cases/get-all-topics.use-case.ts
import { Inject, Injectable } from '@nestjs/common';
import { ITopicRepository } from '../../domain/interfaces/topic-repository.interface';

@Injectable()
export class GetAllTopicsUseCase {
  constructor(
    @Inject('ITopicRepository')
    private readonly topicRepo: ITopicRepository,
  ) {}

  async execute(params: { limit?: number; offset?: number }) {
    const limit = params.limit ?? 50;
    const offset = params.offset ?? 0;

    const topics = await this.topicRepo.findAll(limit, offset);
    const total = await this.topicRepo.count();

    return { total, topics };
  }
}
