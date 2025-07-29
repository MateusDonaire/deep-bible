import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IBibleRepository } from '../../domain/interfaces/bible-repository.interface';

@Injectable()
export class GetChapterUseCase {
  constructor(
    @Inject('IBibleRepository')
    private readonly bibleRepo: IBibleRepository,
  ) {}

  async execute(book: string, chapter: number) {
    const bookExists = await this.bibleRepo.findBook(book);
    if (!bookExists) {
      throw new NotFoundException(`Livro '${book}' não encontrado.`);
    }

    const chapterVerses = await this.bibleRepo.findChapterVerses(book, chapter);
    if (!chapterVerses.length) {
      throw new NotFoundException(`Capítulo ${chapter} do livro '${book}' não encontrado.`);
    }

    return chapterVerses;
  }
}
