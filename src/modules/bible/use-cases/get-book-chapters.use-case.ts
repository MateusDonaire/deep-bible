import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class GetBookChaptersUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(book: string): Promise<number[]> {
    const chapters = await this.prisma.verse.findMany({
      where: {
        book: { equals: book, mode: 'insensitive' },
      },
      select: { chapter: true },
      distinct: ['chapter'],
      orderBy: { chapter: 'asc' },
    });

    if (!chapters.length) {
      throw new Error('Livro não encontrado ou sem capítulos.');
    }

    return chapters.map((c) => c.chapter);
  }
}
