import { Module } from '@nestjs/common';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { SearchVersesUseCase } from './application/use-cases/search-verse.use-case';
import { SearchController } from './controllers/search.controller';
import { TopicsController } from './controllers/topic.controller';
import { GetPopularTopicsUseCase } from './application/use-cases/get-popular-topics.use-case';
import { GetAllTopicsUseCase } from './application/use-cases/get-all-topics.use-case';
import OpenAI from 'openai';
import { TopicRepository } from './infrastructure/repositories/topic.repository';
import { VerseSearchRepository } from './infrastructure/repositories/verse-search.repository';
import { VectorEmbeddingService } from './infrastructure/services/vector-embedding.service';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController, TopicsController],
  providers: [
    SearchVersesUseCase,
    GetPopularTopicsUseCase,
    GetAllTopicsUseCase,
    {
      provide: OpenAI,
      useFactory: () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    },
    TopicRepository,
    {
      provide: 'ITopicRepository',
      useClass: TopicRepository,
    },
    VerseSearchRepository,
    {
      provide: 'IVerseSearchRepository',
      useClass: VerseSearchRepository
    },
    VectorEmbeddingService,
    {
      provide: 'IVectorEmbeddingService',
      useClass: VectorEmbeddingService
    }
  ],
})
export class SearchModule {}
