import { GetAllTopicsUseCase } from './get-all-topics.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';

describe('GetAllTopicsUseCase', () => {
  let useCase: GetAllTopicsUseCase;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      topic: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    } as any;

    useCase = new GetAllTopicsUseCase(prisma);
  });

  it('deve retornar a lista de tópicos com total', async () => {
    const mockTopics = [
      { id: 1, name: 'Amor', count: 10, description: 'Sobre amor' },
    ];
    (prisma.topic.findMany as jest.Mock).mockResolvedValue(mockTopics);
    (prisma.topic.count as jest.Mock).mockResolvedValue(1);

    const resultado = await useCase.execute({ limit: 10, offset: 0 });

    expect(prisma.topic.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 10,
      orderBy: { count: 'desc' },
    });

    expect(prisma.topic.count).toHaveBeenCalled();

    expect(resultado).toEqual({
      total: 1,
      topics: [
        {
          id: 1,
          topic: 'Amor',
          count: 10,
          description: 'Sobre amor',
        },
      ],
    });
  });

  it('deve usar valores padrão se não passar parâmetros', async () => {
    (prisma.topic.findMany as jest.Mock).mockResolvedValue([]);
    (prisma.topic.count as jest.Mock).mockResolvedValue(0);

    const resultado = await useCase.execute({});

    expect(prisma.topic.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 50,
      orderBy: { count: 'desc' },
    });

    expect(resultado.total).toBe(0);
    expect(resultado.topics).toEqual([]);
  });
});
