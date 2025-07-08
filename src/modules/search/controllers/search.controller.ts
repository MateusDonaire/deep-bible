import { Controller, Get, Query } from '@nestjs/common';
import { SearchVersesUseCase } from '../use-cases/search-verse.use-case';
import { SemanticQueryDto } from '../dtos/semantic-query.dto';

@Controller('search')
export class SearchController {
  constructor(private readonly searchUseCase: SearchVersesUseCase) {}

  @Get()
  async search(@Query() queryDto: SemanticQueryDto) {
    return this.searchUseCase.execute(queryDto.query);
  }
}