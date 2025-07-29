import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { GetPopularTopicsUseCase } from '../application/use-cases/get-popular-topics.use-case';
import { GetAllTopicsUseCase } from '../application/use-cases/get-all-topics.use-case';
import { TopicsResponseDto } from '../domain/dtos/topics-response-schema.dto';

@ApiTags('Topics')
@Controller('topics')
export class TopicsController {
  constructor(
    private readonly getPopularTopics: GetPopularTopicsUseCase,
    private readonly getAllTopics: GetAllTopicsUseCase,
  ) {}

  @Get('popular')
  @ApiOperation({ summary: 'Lista os tópicos mais populares' })
  @ApiResponse({
    status: 200,
    description: 'Lista de tópicos populares',
    type: TopicsResponseDto,
  })
  async getPopular() {
    return this.getPopularTopics.execute();
  }

  @Get()
  @ApiOperation({ summary: 'Lista todos os tópicos com paginação' })
  @ApiQuery({ name: 'limit', required: false, example: 10, description: 'Número máximo de tópicos a retornar' })
  @ApiQuery({ name: 'offset', required: false, example: 0, description: 'Número de tópicos a pular (para paginação)' })
  @ApiResponse({
    status: 200,
    description: 'Lista paginada de todos os tópicos',
    type: TopicsResponseDto,
  })
  async findAll(
    @Query('limit') limit?: number,
    @Query('offset') offset?: number,
  ) {
    return this.getAllTopics.execute({ limit: Number(limit), offset: Number(offset) });
  }
}
