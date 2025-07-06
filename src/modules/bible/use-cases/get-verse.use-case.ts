import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class GetVerseUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(book: string, chapter: number, verse: number) {
    const result = await this.prisma.verse.findFirst({
      where: {
        book: { equals: book, mode: 'insensitive' },
        chapter,
        verse,
      },
    });

    if (!result) {
      throw new Error('Versículo não encontrado.');
    }

    return result;
  }
}
