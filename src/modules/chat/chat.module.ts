import { Module } from '@nestjs/common';
import { AskToBibleController } from './controller/ask-to-bible.controller';
import { AskToBibleUseCase } from './use-cases/ask-to-bible.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';
import OpenAI from 'openai';

@Module({
  controllers: [AskToBibleController],
  providers: [
    PrismaService,
    AskToBibleUseCase,
    {
      provide: OpenAI,
      useFactory: () => new OpenAI({ apiKey: process.env.OPENAI_API_KEY }),
    },
  ],
})
export class ChatModule {}
