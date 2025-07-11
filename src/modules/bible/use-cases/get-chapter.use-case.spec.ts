import { GetChapterUseCase } from './get-chapter.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';

describe('GetChapterUseCase', () => {
  let useCase: GetChapterUseCase;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      verse: {
        findFirst: jest.fn(),
        findMany: jest.fn(),
      },
    } as any;

    useCase = new GetChapterUseCase(prisma);
  });

  it('should return all verses of a chapter when found', async () => {
    const mockBook = { book: 'João' };
    const mockVerses = [
      { verse: 1, text: 'No princípio era o Verbo...' },
      { verse: 2, text: 'Ele estava no princípio com Deus...' },
    ];

    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce(mockBook);
    (prisma.verse.findMany as jest.Mock).mockResolvedValueOnce(mockVerses);

    const result = await useCase.execute('João', 1);

    expect(result).toEqual(mockVerses);
    expect(prisma.verse.findFirst).toHaveBeenCalledWith({
      where: { book: { equals: 'João', mode: 'insensitive' } },
    });
    expect(prisma.verse.findMany).toHaveBeenCalledWith({
      where: { book: { equals: 'João', mode: 'insensitive' }, chapter: 1 },
      orderBy: { verse: 'asc' },
    });
  });

  it('should throw NotFoundException if book not found', async () => {
    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce(null);

    const promise = useCase.execute('LivroInexistente', 1);

    await expect(promise).rejects.toThrow(NotFoundException);
    await expect(promise).rejects.toThrow("Livro 'LivroInexistente' não encontrado.");
    expect(prisma.verse.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.verse.findMany).not.toHaveBeenCalled();
  });

  it('should throw NotFoundException if chapter not found', async () => {
    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce({});
    (prisma.verse.findMany as jest.Mock).mockResolvedValueOnce([]);

    const promise = useCase.execute('João', 999);

    await expect(promise).rejects.toThrow(NotFoundException);
    await expect(promise).rejects.toThrow("Capítulo 999 do livro 'João' não encontrado.");
    expect(prisma.verse.findFirst).toHaveBeenCalledTimes(1);
    expect(prisma.verse.findMany).toHaveBeenCalledTimes(1);
  });
});
