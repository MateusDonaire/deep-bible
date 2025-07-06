import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { GetVerseUseCase } from '../use-cases/get-verse.use-case';
import { GetChapterUseCase } from '../use-cases/get-chapter.use-case';
import { GetBookChaptersUseCase } from '../use-cases/get-book-chapters.use-case';

@Controller('bible')
export class BibleController {
  constructor(
    private readonly getVerseUseCase: GetVerseUseCase,
    private readonly  getChapterUseCase: GetChapterUseCase,
    private readonly getBookChaptersUseCase: GetBookChaptersUseCase
  ) {}

  @Get(':book/:chapter/:verse')
  async getVerse(
    @Param('book') book: string,
    @Param('chapter', ParseIntPipe) chapter: number,
    @Param('verse', ParseIntPipe) verse: number,
  ) {
    return this.getVerseUseCase.execute(book, chapter, verse);
  }

  @Get(':book/:chapter')
  async getChapter(
    @Param('book') book: string,
    @Param('chapter', ParseIntPipe) chapter: number,
  ) {
    return this.getChapterUseCase.execute(book, chapter);
  }

  @Get(':book')
  async getBookChapters(@Param('book') book: string) {
    return this.getBookChaptersUseCase.execute(book);
  }
}
