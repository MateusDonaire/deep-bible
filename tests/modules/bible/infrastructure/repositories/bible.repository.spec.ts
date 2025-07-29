import { PrismaService } from '@/infra/prisma/prisma.service';
import { BibleRepository } from '@/modules/bible/infrastructure/repositories/bible.repository';

describe('BibleRepository', () => {
  let repository: BibleRepository;
  let prisma: jest.Mocked<PrismaService>;

  beforeEach(() => {
    prisma = {
      verse: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    } as any;

    repository = new BibleRepository(prisma);
  });

  describe('findBook', () => {
    it('deve retornar true se o livro existir', async () => {
      prisma.verse.findFirst = jest.fn().mockResolvedValue({ id: 1 } as any);

      const result = await repository.findBook('Gênesis');
      expect(result).toBe(true);
    });

    it('deve retornar false se o livro não existir', async () => {
      prisma.verse.findFirst = jest.fn().mockResolvedValue(null);

      const result = await repository.findBook('LivroInexistente');
      expect(result).toBe(false);
    });
  });

  describe('findChapter', () => {
    it('deve retornar true se o capítulo existir', async () => {
      prisma.verse.findFirst = jest.fn().mockResolvedValue({ id: 1 } as any);

      const result = await repository.findChapter('Gênesis', 1);
      expect(result).toBe(true);
    });

    it('deve retornar false se o capítulo não existir', async () => {
      prisma.verse.findFirst = jest.fn().mockResolvedValue(null);

      const result = await repository.findChapter('Gênesis', 99);
      expect(result).toBe(false);
    });
  });

  describe('findVerse', () => {
    it('deve retornar o versículo se encontrado', async () => {
      const mockVerse = {
        id: 1,
        book: 'João',
        chapter: 3,
        verse: 16,
        text: 'Porque Deus amou o mundo...',
        topics: ['amor'],
      };

      prisma.verse.findFirst = jest.fn().mockResolvedValue(mockVerse as any);

      const result = await repository.findVerse('João', 3, 16);
      expect(result).toEqual(mockVerse);
    });

    it('deve retornar null se o versículo não for encontrado', async () => {
      prisma.verse.findFirst = jest.fn().mockResolvedValue(null);

      const result = await repository.findVerse('João', 3, 99);
      expect(result).toBeNull();
    });
  });

  describe('findChapterVerses', () => {
    it('deve retornar os versículos do capítulo', async () => {
      const mockVerses = [
        { id: 1, book: 'João', chapter: 3, verse: 16, text: 'texto 1', topics: ['x'] },
        { id: 2, book: 'João', chapter: 3, verse: 17, text: 'texto 2', topics: ['y'] },
      ];

      prisma.verse.findMany = jest.fn().mockResolvedValue(mockVerses as any);

      const result = await repository.findChapterVerses('João', 3);
      expect(result).toEqual(mockVerses);
    });

    it('deve retornar lista vazia se não encontrar versículos', async () => {
      prisma.verse.findMany = jest.fn().mockResolvedValue([]);

      const result = await repository.findChapterVerses('João', 99);
      expect(result).toEqual([]);
    });
  });
});
