import { GetAllTopicsUseCase } from "@/modules/search/application/use-cases/get-all-topics.use-case";
import { TopicEntity } from "@/modules/search/domain/entities/topic.entity";
import { ITopicRepository } from "@/modules/search/domain/interfaces/topic-repository.interface";

describe('GetAllTopicsUseCase', () => {
  let useCase: GetAllTopicsUseCase;
  let topicRepo: jest.Mocked<ITopicRepository>;

  beforeEach(() => {
    topicRepo = {
      findAll: jest.fn(),
      count: jest.fn(),
      findPopular: jest.fn(), // necessário para satisfazer a interface
    };

    useCase = new GetAllTopicsUseCase(topicRepo);
  });

  it('deve retornar os tópicos e o total corretamente com limite e offset', async () => {
    const mockTopics: TopicEntity[] = [
      { id: 1, topic: 'Graça', description: 'Doutrina da graça' },
      { id: 2, topic: 'Fé', description: 'Fé salvífica' },
    ];

    topicRepo.findAll.mockResolvedValue(mockTopics);
    topicRepo.count.mockResolvedValue(2);

    const result = await useCase.execute({ limit: 10, offset: 0 });

    expect(topicRepo.findAll).toHaveBeenCalledWith(10, 0);
    expect(topicRepo.count).toHaveBeenCalled();
    expect(result).toEqual({
      total: 2,
      topics: mockTopics,
    });
  });

  it('deve usar os valores padrão se nenhum parâmetro for passado', async () => {
    topicRepo.findAll.mockResolvedValue([]);
    topicRepo.count.mockResolvedValue(0);

    const result = await useCase.execute({});

    expect(topicRepo.findAll).toHaveBeenCalledWith(50, 0); // defaults
    expect(topicRepo.count).toHaveBeenCalled();
    expect(result).toEqual({ total: 0, topics: [] });
  });
});
