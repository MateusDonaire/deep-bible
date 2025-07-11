import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiResponse } from '@nestjs/swagger';
import { GetVerseUseCase } from '../use-cases/get-verse.use-case';
import { GetChapterUseCase } from '../use-cases/get-chapter.use-case';
import { ChapterResponseDto, VerseResponseDto } from '../dtos/bible-response-schema.dto';

@ApiTags('Bible')
@Controller('bible')
export class BibleController {
  constructor(
    private readonly getVerseUseCase: GetVerseUseCase,
    private readonly getChapterUseCase: GetChapterUseCase,
  ) {}

  @Get(':book/:chapter/:verse')
  @ApiOperation({ summary: 'Busca um versículo específico' })
  @ApiParam({ name: 'book', example: 'Mateus', description: 'Nome do livro bíblico' })
  @ApiParam({ name: 'chapter', example: 28, description: 'Número do capítulo' })
  @ApiParam({ name: 'verse', example: 19, description: 'Número do versículo' })
  @ApiResponse({
    status: 200,
    description: 'Versículo encontrado',
    type: VerseResponseDto,
  })
  async getVerse(
    @Param('book') book: string,
    @Param('chapter', ParseIntPipe) chapter: number,
    @Param('verse', ParseIntPipe) verse: number,
  ) {
    return this.getVerseUseCase.execute(book, chapter, verse);
  }

  @Get(':book/:chapter')
  @ApiOperation({ summary: 'Busca todos os versículos de um capítulo' })
  @ApiParam({ name: 'book', example: 'Mateus', description: 'Nome do livro bíblico' })
  @ApiParam({ name: 'chapter', example: 28, description: 'Número do capítulo' })
  @ApiResponse({
    status: 200,
    description: 'Lista de versículos do capítulo',
    type: ChapterResponseDto,
  })
  async getChapter(
    @Param('book') book: string,
    @Param('chapter', ParseIntPipe) chapter: number,
  ) {
    return this.getChapterUseCase.execute(book, chapter);
  }
}