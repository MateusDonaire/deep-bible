// src/modules/bible/infra/repositories/bible.repository.ts
import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { IBibleRepository } from '../../domain/interfaces/bible-repository.interface';
import { VerseEntity } from '../../domain/entities/verse.entity';

@Injectable()
export class BibleRepository implements IBibleRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findBook(book: string): Promise<boolean> {
    const result = await this.prisma.verse.findFirst({
      where: { book: { equals: book, mode: 'insensitive' } },
    });

    return !!result;
  }

  async findChapterVerses(book: string, chapter: number): Promise<VerseEntity[]> {
    const verses = await this.prisma.verse.findMany({
      where: {
        book: { equals: book, mode: 'insensitive' },
        chapter,
      },
      orderBy: { verse: 'asc' },
    });

    return verses.map((v) => ({
      id: v.id,
      book: v.book,
      chapter: v.chapter,
      verse: v.verse,
      text: v.text,
      topics: v.topics,
    }));
  }
}
