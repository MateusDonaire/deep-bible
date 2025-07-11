import { SearchVersesUseCase } from './search-verse.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';
import OpenAI from 'openai';

describe('SearchVersesUseCase', () => {
  let useCase: SearchVersesUseCase;
  let prisma: PrismaService;
  let openai: OpenAI;

  beforeEach(() => {
    prisma = {
      $queryRawUnsafe: jest.fn(),
    } as any;

    openai = {
      embeddings: {
        create: jest.fn(),
      },
    } as any;

    useCase = new SearchVersesUseCase(prisma, openai);
  });

  it('deve retornar resultados de busca com base no embedding', async () => {
    const mockEmbedding = { data: [{ embedding: [0.1, 0.2, 0.3] }] };
    const mockResults = [
      {
        id: 1,
        book: 'Salmos',
        chapter: 23,
        verse: 1,
        text: 'O Senhor é meu pastor...',
        topics: ['confiança']
      },
    ];

    (openai.embeddings.create as jest.Mock).mockResolvedValue(mockEmbedding);
    (prisma.$queryRawUnsafe as jest.Mock).mockResolvedValue(mockResults);

    const resultado = await useCase.execute('confiança em Deus');

    expect(openai.embeddings.create).toHaveBeenCalledWith({
      model: 'text-embedding-ada-002',
      input: 'confiança em Deus',
    });

    expect(prisma.$queryRawUnsafe).toHaveBeenCalled();

    expect(resultado).toEqual([
      {
        reference: 'Salmos 23:1',
        text: 'O Senhor é meu pastor...',
        topics: ['confiança'],
      },
    ]);
  });

  it('deve lançar erro se consulta tiver menos de 2 caracteres', async () => {
    await expect(useCase.execute('a')).rejects.toThrow('A consulta deve ter pelo menos 2 caracteres.');
  });
});
