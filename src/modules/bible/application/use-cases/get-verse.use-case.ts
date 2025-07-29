import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { IBibleRepository } from '../../domain/interfaces/bible-repository.interface';

@Injectable()
export class GetVerseUseCase {
  constructor(
    @Inject('IBibleRepository')
    private readonly bibleRepo: IBibleRepository,
  ) {}

  async execute(book: string, chapter: number, verse: number) {
    const verseData = await this.bibleRepo.findVerse(book, chapter, verse);

    if (verseData) {
      return verseData;
    }

    const chapterExists = await this.bibleRepo.findChapter(book, chapter);
    if (chapterExists) {
      throw new NotFoundException(
        `Versículo ${verse} do capítulo ${chapter} do livro '${book}' não encontrado.`,
      );
    }

    const bookExists = await this.bibleRepo.findBook(book);
    if (bookExists) {
      throw new NotFoundException(
        `Capítulo ${chapter} do livro '${book}' não encontrado.`,
      );
    }

    throw new NotFoundException(`Livro '${book}' não encontrado.`);
  }
}
