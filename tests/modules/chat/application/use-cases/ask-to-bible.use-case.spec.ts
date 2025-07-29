// src/modules/bible/application/use-cases/ask-to-bible.use-case.spec.ts
import { IBibleRepository } from '@/modules/bible/domain/interfaces/bible-repository.interface';
import { AskToBibleUseCase } from '@/modules/chat/application/use-cases/ask-to-bible.use-case';
import { IAIService } from '@/modules/chat/domain/interfaces/ai-service.interface';
import { InternalServerErrorException, NotFoundException } from '@nestjs/common';

describe('AskToBibleUseCase', () => {
  let useCase: AskToBibleUseCase;
  let bibleRepo: jest.Mocked<IBibleRepository>;
  let aiService: jest.Mocked<IAIService>;

  const mockVerse = {
    id: 1,
    book: 'João',
    chapter: 3,
    verse: 16,
    text: 'Porque Deus amou o mundo...',
    topics: ['amor'],
  };

  beforeEach(() => {
    bibleRepo = {
      findVerse: jest.fn(),
      findBook: jest.fn(),
      findChapter: jest.fn(),
      findChapterVerses: jest.fn(),
    } as unknown as jest.Mocked<IBibleRepository>;

    aiService = {
      ask: jest.fn(),
    };

    useCase = new AskToBibleUseCase(bibleRepo, aiService);
  });

  it('✅ deve retornar a resposta da IA com versículo válido', async () => {
    bibleRepo.findVerse.mockResolvedValue(mockVerse);
    aiService.ask.mockResolvedValue('Resposta simulada da IA.');

    const result = await useCase.execute('O que é amor?', 'João 3:16');

    expect(result).toEqual({
      reference: 'João 3:16',
      text: mockVerse.text,
      answer: 'Resposta simulada da IA.',
    });

    expect(bibleRepo.findVerse).toHaveBeenCalledWith('João', 3, 16);
    expect(aiService.ask).toHaveBeenCalledWith(expect.stringContaining(mockVerse.text));
  });

  it('❌ deve lançar NotFoundException se referência bíblica estiver mal formatada', async () => {
    await expect(useCase.execute('Quem é Deus?', 'Mateus3')).rejects.toThrowError(
      new NotFoundException('Formato inválido de referência bíblica. Use algo como "1 Pedro 3:7".'),
    );

    expect(bibleRepo.findVerse).not.toHaveBeenCalled();
    expect(aiService.ask).not.toHaveBeenCalled();
  });

  it('❌ deve lançar NotFoundException se versículo não for encontrado', async () => {
    bibleRepo.findVerse.mockResolvedValue(null);

    await expect(useCase.execute('Quem é Jesus?', 'Lucas 24:99')).rejects.toThrowError(
      new NotFoundException("Versículo 99 do capítulo 24 do livro 'Lucas' não encontrado."),
    );

    expect(bibleRepo.findVerse).toHaveBeenCalledWith('Lucas', 24, 99);
    expect(aiService.ask).not.toHaveBeenCalled();
  });

  it('❌ deve lançar InternalServerErrorException se IA falhar', async () => {
    bibleRepo.findVerse.mockResolvedValue(mockVerse);
    aiService.ask.mockRejectedValue(new Error('OpenAI indisponível'));

    await expect(useCase.execute('O que é salvação?', 'João 3:16')).rejects.toThrowError(
      new InternalServerErrorException('Erro ao processar resposta com IA.'),
    );

    expect(aiService.ask).toHaveBeenCalled();
  });
});
