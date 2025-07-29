export interface IVectorEmbeddingService {
  embed(query: string): Promise<number[]>;
}
