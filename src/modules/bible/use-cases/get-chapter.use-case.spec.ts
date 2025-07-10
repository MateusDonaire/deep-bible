import { GetChapterUseCase } from './get-chapter.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';

describe('GetChapterUseCase', () => {
  let useCase: GetChapterUseCase;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      verse: { findMany: jest.fn() },
    } as any;

    useCase = new GetChapterUseCase(prisma);
  });

  it('should return verses of a chapter', async () => {
    const mockVerses = [{ verse: 1, text: '...' }];
    (prisma.verse.findMany as jest.Mock).mockResolvedValue(mockVerses);

    const result = await useCase.execute('Genêsis', 1);

    expect(prisma.verse.findMany).toHaveBeenCalledWith({
      where: { book: { equals: 'Genêsis', mode: 'insensitive' }, chapter: 1 },
      orderBy: { verse: 'asc' },
    });
    expect(result).toEqual(mockVerses);
  });

  it('should throw error if chapter not found', async () => {
    (prisma.verse.findMany as jest.Mock).mockResolvedValue([]);

    await expect(useCase.execute('Genêsis', 999)).rejects.toThrow('Capítulo não encontrado.');
  });
});
