import { Controller, Get, Query } from '@nestjs/common';
import { GetPopularTopicsUseCase } from '../use-cases/get-popular-topics.use-case';

@Controller('topics')
export class TopicsController {
  constructor(private readonly getPopularTopics: GetPopularTopicsUseCase) {}

  @Get('popular')
  async getPopular() {
    return this.getPopularTopics.execute();
  }
}
