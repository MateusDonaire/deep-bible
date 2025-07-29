import { Module } from '@nestjs/common';
import { AskToBibleController } from './controller/ask-to-bible.controller';
import { AskToBibleUseCase } from './application/use-cases/ask-to-bible.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';
import OpenAI from 'openai';
import { BibleRepository } from './infrastructure/repositories/bible.repository';
import { AiService } from './infrastructure/services/ai.service';
@Module({
  controllers: [AskToBibleController],
  providers: [
    PrismaService,
    AskToBibleUseCase,
    {
      provide: OpenAI,
      useFactory: () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    },
    BibleRepository,
    {
      provide: 'IBibleRepository',
      useClass: BibleRepository,
    },
    AiService,
    {
      provide: 'IAIService',
      useClass: AiService,
    },
  ],
})
export class ChatModule {}
