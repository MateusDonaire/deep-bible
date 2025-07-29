import { SearchResultEntity } from '../entities/search-result.entity';

export interface IVerseSearchRepository {
  searchByEmbedding(embedding: number[]): Promise<SearchResultEntity[]>;
}
