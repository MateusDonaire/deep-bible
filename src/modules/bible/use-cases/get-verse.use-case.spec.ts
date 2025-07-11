import { GetVerseUseCase } from './get-verse.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('GetVerseUseCase', () => {
  let useCase: GetVerseUseCase;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      verse: { findFirst: jest.fn() },
    } as any;

    useCase = new GetVerseUseCase(prisma);
  });

  it('should return a verse', async () => {
    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce({}); // bookExists
    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce({}); // chapterExists
    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce({ verse: 16, text: 'Porque Deus tanto amou o mundo que' }); // verseData

    const result = await useCase.execute('João', 3, 16);

    expect(result).toEqual({ verse: 16, text: 'Porque Deus tanto amou o mundo que' });
  });

  it('should throw NotFoundException if book not found', async () => {
    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce(null); // bookExists

    await expect(useCase.execute('LivroInexistente', 3, 16)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('LivroInexistente', 3, 16)).rejects.toThrow("Livro 'LivroInexistente' não encontrado.");
  });

  it('should throw NotFoundException if chapter not found', async () => {
    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce({}); // bookExists
    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce(null); // chapterExists

    await expect(useCase.execute('João', 999, 16)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('João', 999, 16)).rejects.toThrow("Capítulo 999 do livro 'João' não encontrado.");
  });

  it('should throw NotFoundException if verse not found', async () => {
    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce({}); // bookExists
    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce({}); // chapterExists
    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce(null); // verseData

    await expect(useCase.execute('João', 3, 999)).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('João', 3, 999)).rejects.toThrow("Versículo 999 do capítulo 3 do livro 'João' não encontrado.");
  });
});
