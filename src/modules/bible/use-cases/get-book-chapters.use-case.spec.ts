import { GetBookChaptersUseCase } from './get-book-chapters.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';

describe('GetBookChaptersUseCase', () => {
  let useCase: GetBookChaptersUseCase;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      verse: { findMany: jest.fn() },
    } as any;

    useCase = new GetBookChaptersUseCase(prisma);
  });

  it('should return chapter numbers', async () => {
    const mockChapters = [{ chapter: 1 }, { chapter: 2 }];
    (prisma.verse.findMany as jest.Mock).mockResolvedValue(mockChapters);

    const result = await useCase.execute('Salmos');

    expect(prisma.verse.findMany).toHaveBeenCalledWith({
      where: { book: { equals: 'Salmos', mode: 'insensitive' } },
      select: { chapter: true },
      distinct: ['chapter'],
      orderBy: { chapter: 'asc' },
    });
    expect(result).toEqual([1, 2]);
  });

  it('should throw error if no chapters found', async () => {
    (prisma.verse.findMany as jest.Mock).mockResolvedValue([]);

    await expect(useCase.execute('UnknownBook')).rejects.toThrow('Livro não encontrado ou sem capítulos.');
  });
});
