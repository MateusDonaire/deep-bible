import { PrismaService } from '@/infra/prisma/prisma.service';
import { TopicRepository } from '@/modules/search/infrastructure/repositories/topic.repository';

describe('TopicRepository', () => {
  let repository: TopicRepository;
  let prismaMock: PrismaService;

  beforeEach(() => {
    prismaMock = {
      topic: {
        findMany: jest.fn(),
        count: jest.fn(),
      },
    } as unknown as PrismaService;

    repository = new TopicRepository(prismaMock);
  });

  it('should return all topics with pagination', async () => {
    const mockTopics = [
      { id: 1, name: 'fé', description: 'Sobre fé' },
      { id: 2, name: 'graça', description: 'Sobre graça' },
    ];

    (prismaMock.topic.findMany as jest.Mock).mockResolvedValueOnce(mockTopics);

    const result = await repository.findAll(2, 0);

    expect(prismaMock.topic.findMany).toHaveBeenCalledWith({
      skip: 0,
      take: 2,
      orderBy: { count: 'desc' },
    });

    expect(result).toEqual([
      { id: 1, topic: 'fé', description: 'Sobre fé' },
      { id: 2, topic: 'graça', description: 'Sobre graça' },
    ]);
  });

  it('should return total topic count', async () => {
    (prismaMock.topic.count as jest.Mock).mockResolvedValueOnce(10);

    const result = await repository.count();

    expect(prismaMock.topic.count).toHaveBeenCalled();
    expect(result).toBe(10);
  });

  it('should return popular topics with count >= 1', async () => {
    const mockTopics = [
      { id: 3, name: 'oração', description: 'Sobre oração' },
      { id: 4, name: 'adoração', description: 'Sobre adoração' },
    ];

    (prismaMock.topic.findMany as jest.Mock).mockResolvedValueOnce(mockTopics);

    const result = await repository.findPopular(3);

    expect(prismaMock.topic.findMany).toHaveBeenCalledWith({
      where: { count: { gte: 1 } },
      orderBy: { count: 'desc' },
      take: 3,
    });

    expect(result).toEqual([
      { id: 3, topic: 'oração', description: 'Sobre oração' },
      { id: 4, topic: 'adoração', description: 'Sobre adoração' },
    ]);
  });
});
