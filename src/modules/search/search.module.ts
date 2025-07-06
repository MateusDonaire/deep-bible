import { Module } from '@nestjs/common';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { SearchVersesUseCase } from './use-cases/search-verse.use-case';
import { SearchController } from './controllers/search.controller';

@Module({
  imports: [PrismaModule],
  controllers: [SearchController],
  providers: [SearchVersesUseCase],
})
export class SearchModule {}
