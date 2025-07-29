import { IVectorEmbeddingService } from '@/modules/search/domain/interfaces/vector-embedding-service.interface';
import { IVerseSearchRepository } from '@/modules/search/domain/interfaces/search-verce-repository.interface';
import { SearchVersesUseCase } from '@/modules/search/application/use-cases/search-verse.use-case';
import { BadRequestException } from '@nestjs/common';

describe('SearchVersesUseCase', () => {
  let useCase: SearchVersesUseCase;
  let embeddingService: jest.Mocked<IVectorEmbeddingService>;
  let verseSearchRepo: jest.Mocked<IVerseSearchRepository>;

  beforeEach(() => {
    embeddingService = {
      embed: jest.fn(),
    };

    verseSearchRepo = {
      searchByEmbedding: jest.fn(),
    };

    useCase = new SearchVersesUseCase(embeddingService, verseSearchRepo);
  });

  it('deve lançar BadRequestException se a query for vazia ou muito curta', async () => {
    await expect(useCase.execute('')).rejects.toThrow(BadRequestException);
    await expect(useCase.execute('a')).rejects.toThrow(BadRequestException);
  });

  it('deve retornar resultados corretamente se a query for válida', async () => {
    const mockEmbedding = [0.1, 0.2, 0.3];
    const mockResults = [
      {
        reference: 'João 3:16',
        text: 'Porque Deus amou o mundo...',
        topics: ['amor', 'salvação'],
      },
    ];

    embeddingService.embed.mockResolvedValue(mockEmbedding);
    verseSearchRepo.searchByEmbedding.mockResolvedValue(mockResults);

    const result = await useCase.execute('O que é o amor de Deus?');

    expect(embeddingService.embed).toHaveBeenCalledWith('O que é o amor de Deus?');
    expect(verseSearchRepo.searchByEmbedding).toHaveBeenCalledWith(mockEmbedding);
    expect(result).toEqual(mockResults);
  });
});
