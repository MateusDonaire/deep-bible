import { GetChapterUseCase } from './get-chapter.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('GetChapterUseCase', () => {
  let useCase: GetChapterUseCase;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      verse: { findFirst: jest.fn(), findMany: jest.fn() },
    } as any;

    useCase = new GetChapterUseCase(prisma);
  });

  it('should return verses of a chapter', async () => {
    const mockVerses = [{ verse: 1, text: '...' }];
    (prisma.verse.findFirst as jest.Mock).mockResolvedValue({}); // bookExists
    (prisma.verse.findMany as jest.Mock).mockResolvedValue(mockVerses); // chapterVerses

    const result = await useCase.execute('Gênesis', 1);

    expect(result).toEqual(mockVerses);
  });

  it('should throw NotFoundException if book not found', async () => {
    (prisma.verse.findFirst as jest.Mock).mockResolvedValue(null); // bookExists

    await expect(useCase.execute('LivroInexistente', 1)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('LivroInexistente', 1)).rejects.toThrow("Livro 'LivroInexistente' não encontrado.");
  });

  it('should throw NotFoundException if chapter not found', async () => {
    (prisma.verse.findFirst as jest.Mock).mockResolvedValue({}); // bookExists
    (prisma.verse.findMany as jest.Mock).mockResolvedValue([]); // chapterVerses vazio

    await expect(useCase.execute('Gênesis', 999)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('Gênesis', 999)).rejects.toThrow("Capítulo 999 do livro 'Gênesis' não encontrado.");
  });
});
