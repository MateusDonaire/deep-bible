// src/modules/bible/application/use-cases/ask-to-bible.use-case.ts
import { Inject, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { IAIService } from '../../domain/interfaces/ai-service.interface';
import { IBibleRepository } from '../../domain/interfaces/bible-repository.interface';

@Injectable()
export class AskToBibleUseCase {
  constructor(
    @Inject('IBibleRepository') private readonly bibleRepo: IBibleRepository,
    @Inject('IAIService') private readonly aiService: IAIService,
  ) {}

  async execute(query: string, bibleVerse: string) {
    const parts = bibleVerse.trim().split(' ');
    const chapterAndVerse = parts.pop();
    const book = parts.join(' ');
    const [chapter, verse] = chapterAndVerse.split(':').map(Number);

    if (!book || !chapter || !verse) {
      throw new NotFoundException('Formato inválido de referência bíblica. Use algo como "1 Pedro 3:7".');
    }

    const verseData = await this.bibleRepo.findVerse(book, chapter, verse);

    if (!verseData) {
      throw new NotFoundException(`Versículo ${verse} do capítulo ${chapter} do livro '${book}' não encontrado.`);
    }

    const prompt = `
Você é um assistente bíblico. Responda à pergunta abaixo com base no versículo e também sugira conexões com outras passagens da bíblia e aplicações para estudo.

Versículo: ${bibleVerse} - ${verseData.text}

Pergunta: ${query}

Responda de forma clara, fiel ao texto, em tom pastoral.
    `.trim();

    try {
      const resposta = await this.aiService.ask(prompt);

      return {
        reference: bibleVerse,
        text: verseData.text,
        answer: resposta,
      };
    } catch (error) {
      throw new InternalServerErrorException('Erro ao processar resposta com IA.');
    }
  }
}