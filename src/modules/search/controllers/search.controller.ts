import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from '@nestjs/swagger';
import { SearchVersesUseCase } from '../application/use-cases/search-verse.use-case';
import { SemanticQueryDto } from '../domain/dtos/semantic-query.dto';
import { SearchResponseDto } from '../domain/dtos/search-response-schema.dto';

@ApiTags('Search')
@Controller('search')
export class SearchController {
  constructor(private readonly searchUseCase: SearchVersesUseCase) {}

  @Get()
  @ApiOperation({ summary: 'Busca semântica de versículos' })
  @ApiQuery({ name: 'query', example: 'papel do marido', description: 'Texto para busca semântica' })
  @ApiResponse({
    status: 200,
    description: 'Lista de versículos mais relevantes',
    type: SearchResponseDto,
  })
  async search(@Query() queryDto: SemanticQueryDto) {
    return this.searchUseCase.execute(queryDto.query);
  }
}
