import { Module } from '@nestjs/common';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { SearchVersesUseCase } from './use-cases/search-verse.use-case';
import { SearchController } from './controllers/search.controller';
import { TopicsController } from './controllers/topic.controller';
import { GetPopularTopicsUseCase } from './use-cases/get-popular-topics.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController, TopicsController],
  providers: [SearchVersesUseCase, GetPopularTopicsUseCase],
})
export class SearchModule {}
