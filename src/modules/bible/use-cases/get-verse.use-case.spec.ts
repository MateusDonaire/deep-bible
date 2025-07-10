import { GetVerseUseCase } from './get-verse.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';

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
    const mockVerse = { verse: 16, text: 'Porque Deus tanto amou o mundo que' };
    (prisma.verse.findFirst as jest.Mock).mockResolvedValue(mockVerse);

    const result = await useCase.execute('João', 3, 16);

    expect(prisma.verse.findFirst).toHaveBeenCalledWith({
      where: { book: { equals: 'João', mode: 'insensitive' }, chapter: 3, verse: 16 },
    });
    expect(result).toEqual(mockVerse);
  });

  it('should throw error if verse not found', async () => {
    (prisma.verse.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute('João', 3, 999)).rejects.toThrow('Versículo não encontrado.');
  });
});
