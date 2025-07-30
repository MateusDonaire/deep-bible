import { Module } from '@nestjs/common';
import { GetChapterUseCase } from './application/use-cases/get-chapter.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { BibleRepository } from './infrastructure/repositories/bible.repository';
import { BibleController } from './controllers/bible.controller';
import { GetVerseUseCase } from './application/use-cases/get-verse.use-case';

@Module({
  controllers: [BibleController],
  providers: [
    GetVerseUseCase,
    GetChapterUseCase,
    PrismaService,
    BibleRepository,
    {
      provide: 'IBibleRepository',
      useClass: BibleRepository,
    },
  ],
  exports: [GetChapterUseCase],
})
export class BibleModule {}
