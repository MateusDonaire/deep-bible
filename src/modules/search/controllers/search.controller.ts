import { Controller, Get, Query } from '@nestjs/common';
import { SearchVersesUseCase } from '../use-cases/search-verse.use-case';

@Controller('search')
export class SearchController {
  constructor(private readonly searchUseCase: SearchVersesUseCase) {}

  @Get()
  async search(@Query('text') query: string) {
    return this.searchUseCase.execute(query);
  }
}
