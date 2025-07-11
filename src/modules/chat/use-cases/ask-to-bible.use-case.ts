import { Injectable } from '@nestjs/common';
import { OpenAI } from 'openai';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class AskToBibleUseCase {
  constructor(
    private readonly prisma: PrismaService,
    private readonly openai: OpenAI
  ) {}

  async execute(query: string, bibleVerse: string) {
    const [book, chapterAndVerse] = bibleVerse.split(' ');
    const [chapter, verse] = chapterAndVerse.split(':').map(Number);

    const verseData = await this.prisma.verse.findFirst({
      where: { book, chapter, verse }
    });

    if (!verseData) {
      throw new Error('Versículo não encontrado.');
    }

    const prompt = `
Você é um assistente bíblico. Responda à pergunta abaixo com base no versículo e também sugira conexões com outras passagens da bíblia e aplicações para estudo.

Versículo: ${bibleVerse} - ${verseData.text}

Pergunta: ${query}

Responda de forma clara, fiel ao texto, em tom pastoral.
    `.trim();

    const completion = await this.openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });

    return {
      reference: bibleVerse,
      text: verseData.text,
      answer: completion.choices[0].message.content
    };
  }
}
