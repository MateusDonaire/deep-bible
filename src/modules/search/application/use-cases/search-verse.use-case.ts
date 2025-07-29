// src/modules/search/application/use-cases/search-verses.use-case.ts
import { BadRequestException, Inject, Injectable } from '@nestjs/common';
import { IVectorEmbeddingService } from '../../domain/interfaces/vector-embedding-service.interface';
import { IVerseSearchRepository } from '../../domain/interfaces/search-verce-repository.interface';

@Injectable()
export class SearchVersesUseCase {
  constructor(
    @Inject('IVectorEmbeddingService')
    private readonly embeddingService: IVectorEmbeddingService,
    @Inject('IVerseSearchRepository')
    private readonly verseSearchRepo: IVerseSearchRepository,
  ) {}

  async execute(query: string) {
    if (!query || query.length < 2) {
      throw new BadRequestException('A consulta deve ter pelo menos 2 caracteres.');
    }

    const embedding = await this.embeddingService.embed(query);
    return await this.verseSearchRepo.searchByEmbedding(embedding);
  }
}
