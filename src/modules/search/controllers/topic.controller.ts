import { Controller, Get, Query } from '@nestjs/common';
import { GetPopularTopicsUseCase } from '../use-cases/get-popular-topics.use-case';
import { GetAllTopicsUseCase } from '../use-cases/get-all-topics.use-case';

@Controller('topics')
export class TopicsController {
  constructor(
    private readonly getPopularTopics: GetPopularTopicsUseCase,
    private readonly getAllTopics: GetAllTopicsUseCase
  ){}

  @Get('popular')
  async getPopular() {
    return this.getPopularTopics.execute();
  }

  @Get()
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.getAllTopics.execute({ limit: Number(limit), offset: Number(offset) });
  }
}
