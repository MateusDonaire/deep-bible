import { PrismaService } from '@/infra/prisma/prisma.service';
import { VerseSearchRepository } from '@/modules/search/infrastructure/repositories/verse-search.repository';

describe('VerseSearchRepository', () => {
  let prismaMock: PrismaService;
  let repository: VerseSearchRepository;

  beforeEach(() => {
    prismaMock = {
      $queryRawUnsafe: jest.fn(),
    } as any;

    repository = new VerseSearchRepository(prismaMock);
  });

  it('should return verses ordered by similarity to embedding', async () => {
    const mockResults = [
      {
        id: 1,
        book: 'João',
        chapter: 3,
        verse: 16,
        text: 'Porque Deus amou o mundo...',
        topics: ['amor', 'salvação'],
        score: 0.95,
      },
      {
        id: 2,
        book: 'Salmos',
        chapter: 23,
        verse: 1,
        text: 'O Senhor é o meu pastor...',
        topics: null,
        score: 0.90,
      },
    ];

    (prismaMock.$queryRawUnsafe as jest.Mock).mockResolvedValueOnce(mockResults);

    const embedding = [0.1, 0.2, 0.3];
    const result = await repository.searchByEmbedding(embedding);

    expect(prismaMock.$queryRawUnsafe).toHaveBeenCalledWith(expect.stringContaining('SELECT id, book, chapter'));
    expect(result).toEqual([
      {
        reference: 'João 3:16',
        text: 'Porque Deus amou o mundo...',
        topics: ['amor', 'salvação'],
      },
      {
        reference: 'Salmos 23:1',
        text: 'O Senhor é o meu pastor...',
        topics: [],
      },
    ]);
  });
});
