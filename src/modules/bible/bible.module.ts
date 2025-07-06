import { Module } from '@nestjs/common';
import { BibleService } from './services/bible.service';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { BibleController } from './controllers/bible.controller';
import { GetVerseUseCase } from './use-cases/get-verse.use-case';
import { GetChapterUseCase } from './use-cases/get-chapter.use-case';
import { GetBookChaptersUseCase } from './use-cases/get-book-chapters.use-case';

@Module({
  imports: [PrismaModule],
  controllers: [BibleController],
  providers: 
  [
    BibleService,
    GetVerseUseCase,
    GetChapterUseCase,
    GetBookChaptersUseCase
  ],
})
export class BibleModule {}
