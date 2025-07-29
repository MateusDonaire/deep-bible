import { Module } from '@nestjs/common';
import { GetChapterUseCase } from './application/use-cases/get-chapter.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { BibleRepository } from './infrastructure/repositories/bible.repository';

@Module({
  providers: [
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
