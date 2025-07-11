import { GetPopularTopicsUseCase } from './get-popular-topics.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';

describe('GetPopularTopicsUseCase', () => {
  let useCase: GetPopularTopicsUseCase;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      topic: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    } as any;

    useCase = new GetPopularTopicsUseCase(prisma);
  });

  it('deve retornar os tópicos populares e o total de tópicos únicos', async () => {
    const mockTopics = [
      { name: 'Fé', description: 'Sobre fé' },
    ];
    (prisma.topic.findMany as jest.Mock).mockResolvedValue(mockTopics);
    (prisma.topic.count as jest.Mock).mockResolvedValue(5);

    const resultado = await useCase.execute();

    expect(prisma.topic.findMany).toHaveBeenCalledWith({
      where: { count: { gte: 1 } },
      orderBy: { count: 'desc' },
      take: 7,
    });

    expect(prisma.topic.count).toHaveBeenCalled();

    expect(resultado).toEqual({
      totalUniqueTopics: 5,
      popularTopics: [
        {
          topic: 'Fé',
          description: 'Sobre fé',
        },
      ],
    });
  });
});
