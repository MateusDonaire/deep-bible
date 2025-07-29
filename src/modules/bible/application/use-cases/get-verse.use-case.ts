import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class GetVerseUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(book: string, chapter: number, verse: number) {
    const verseData = await this.prisma.verse.findFirst({
      where: {
        book: { equals: book, mode: 'insensitive' },
        chapter,
        verse,
      },
    });

    if (verseData) {
      return verseData;
    }

    const chapterExists = await this.prisma.verse.findFirst({
      where: {
        book: { equals: book, mode: 'insensitive' },
        chapter,
      },
    });

    if (chapterExists) {
      throw new NotFoundException(
        `Versículo ${verse} do capítulo ${chapter} do livro '${book}' não encontrado.`,
      );
    }

    const bookExists = await this.prisma.verse.findFirst({
      where: { book: { equals: book, mode: 'insensitive' } },
    });

    if (bookExists) {
      throw new NotFoundException(
        `Capítulo ${chapter} do livro '${book}' não encontrado.`,
      );
    }

    throw new NotFoundException(`Livro '${book}' não encontrado.`);
  }
}
