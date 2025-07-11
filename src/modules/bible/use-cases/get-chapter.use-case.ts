import { PrismaService } from '@/infra/prisma/prisma.service';
import { Injectable, NotFoundException } from '@nestjs/common';

@Injectable()
export class GetChapterUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(book: string, chapter: number) {
    const bookExists = await this.prisma.verse.findFirst({
      where: { book: { equals: book, mode: 'insensitive' } },
    });
    if (!bookExists) {
      throw new NotFoundException(`Livro '${book}' não encontrado.`);
    }

    const chapterVerses = await this.prisma.verse.findMany({
      where: {
        book: { equals: book, mode: 'insensitive' },
        chapter,
      },
      orderBy: { verse: 'asc' },
    });
    if (!chapterVerses.length) {
      throw new NotFoundException(`Capítulo ${chapter} do livro '${book}' não encontrado.`);
    }

    return chapterVerses;
  }
}
