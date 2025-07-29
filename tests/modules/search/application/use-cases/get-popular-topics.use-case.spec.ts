import { GetPopularTopicsUseCase } from "@/modules/search/application/use-cases/get-popular-topics.use-case";
import { TopicEntity } from "@/modules/search/domain/entities/topic.entity";
import { ITopicRepository } from "@/modules/search/domain/interfaces/topic-repository.interface";

describe('GetPopularTopicsUseCase', () => {
  let useCase: GetPopularTopicsUseCase;
  let topicRepo: jest.Mocked<ITopicRepository>;

  beforeEach(() => {
    topicRepo = {
      findAll: jest.fn(),
      count: jest.fn(),
      findPopular: jest.fn(),
    };

    useCase = new GetPopularTopicsUseCase(topicRepo);
  });

  it('deve retornar os tópicos populares e o total de tópicos únicos', async () => {
    const mockPopularTopics: TopicEntity[] = [
      { id: 1, topic: 'Graça', description: 'Doutrina da graça' },
      { id: 2, topic: 'Fé', description: 'Fé salvadora' },
    ];

    topicRepo.findPopular.mockResolvedValue(mockPopularTopics);
    topicRepo.count.mockResolvedValue(10);

    const result = await useCase.execute();

    expect(topicRepo.findPopular).toHaveBeenCalledWith(7);
    expect(topicRepo.count).toHaveBeenCalled();
    expect(result).toEqual({
      totalUniqueTopics: 10,
      popularTopics: [
        { topic: 'Graça', description: 'Doutrina da graça' },
        { topic: 'Fé', description: 'Fé salvadora' },
      ],
    });
  });

  it('deve retornar lista vazia se nenhum tópico for encontrado', async () => {
    topicRepo.findPopular.mockResolvedValue([]);
    topicRepo.count.mockResolvedValue(0);

    const result = await useCase.execute();

    expect(result).toEqual({
      totalUniqueTopics: 0,
      popularTopics: [],
    });
  });
});
