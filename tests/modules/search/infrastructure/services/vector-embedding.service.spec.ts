// tests/modules/search/infrastructure/services/vector-embedding.service.spec.ts
import { VectorEmbeddingService } from '@/modules/search/infrastructure/services/vector-embedding.service';
import OpenAI from 'openai';

jest.mock('openai');

describe('VectorEmbeddingService', () => {
  let service: VectorEmbeddingService;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    mockCreate = jest.fn();
    (OpenAI as unknown as jest.Mock).mockImplementation(() => ({
      embeddings: { create: mockCreate },
    }));

    service = new VectorEmbeddingService();
  });

  it('should call OpenAI API and return the embedding array', async () => {
    const mockEmbedding = [0.1, 0.2, 0.3];
    mockCreate.mockResolvedValueOnce({
      data: [{ embedding: mockEmbedding }],
    });

    const result = await service.embed('Jesus é o caminho');

    expect(mockCreate).toHaveBeenCalledWith({
      model: 'text-embedding-ada-002',
      input: 'Jesus é o caminho',
    });

    expect(result).toEqual(mockEmbedding);
  });
});
