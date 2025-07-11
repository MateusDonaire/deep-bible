import { Module } from '@nestjs/common';
import { PrismaModule } from '@/infra/prisma/prisma.module';
import { BibleController } from './controllers/bible.controller';
import { GetVerseUseCase } from './use-cases/get-verse.use-case';
import { GetChapterUseCase } from './use-cases/get-chapter.use-case';
@Module({
  imports: [PrismaModule],
  controllers: [BibleController],
  providers: 
  [
    GetVerseUseCase,
    GetChapterUseCase
  ],
})
export class BibleModule {}
