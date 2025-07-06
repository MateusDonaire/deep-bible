import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class GetChapterUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(book: string, chapter: number) {
    const verses = await this.prisma.verse.findMany({
      where: {
        book: { equals: book, mode: 'insensitive' },
        chapter,
      },
      orderBy: { verse: 'asc' },
    });

    if (!verses.length) {
      throw new Error('Capítulo não encontrado.');
    }

    return verses;
  }
}
