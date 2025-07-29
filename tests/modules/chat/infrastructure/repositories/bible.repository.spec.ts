import { PrismaService } from "@/infra/prisma/prisma.service";
import { VerseEntity } from "@/modules/chat/domain/dtos/entities/verse.entity";
import { BibleRepository } from "@/modules/chat/infrastructure/repositories/bible.repository";

describe('BibleRepository', () => {
  let prisma: jest.Mocked<PrismaService>;
  let repository: BibleRepository;

  beforeEach(() => {
    prisma = {
      verse: {
        findFirst: jest.fn(),
      },
    } as any;

    repository = new BibleRepository(prisma);
  });

  describe('findVerse', () => {
    const book = 'João';
    const chapter = 3;
    const verse = 16;

    it('deve retornar um versículo se encontrado', async () => {
      const mockVerse: VerseEntity = {
        id: 1,
        book,
        chapter,
        verse,
        text: 'Porque Deus amou o mundo...',
        topics: ['amor'],
      };

      prisma.verse.findFirst = jest.fn().mockResolvedValue(mockVerse);

      const result = await repository.findVerse(book, chapter, verse);

      expect(prisma.verse.findFirst).toHaveBeenCalledWith({
        where: {
          book: { equals: book, mode: 'insensitive' },
          chapter,
          verse,
        },
      });
      expect(result).toEqual(mockVerse);
    });

    it('deve retornar null se não encontrar versículo', async () => {
      prisma.verse.findFirst = jest.fn().mockResolvedValue(null);

      const result = await repository.findVerse(book, chapter, verse);

      expect(result).toBeNull();
    });
  });
});
