import { AskToBibleUseCase } from './ask-to-bible.use-case';
import { PrismaService } from '@/infra/prisma/prisma.service';
import { OpenAI } from 'openai';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';

describe('AskToBibleUseCase', () => {
  let useCase: AskToBibleUseCase;
  let prisma: PrismaService;
  let openai: OpenAI;

  beforeEach(() => {
    prisma = {
      verse: { findFirst: jest.fn() },
    } as any;

    openai = {
      chat: {
        completions: {
          create: jest.fn(),
        },
      },
    } as any;

    useCase = new AskToBibleUseCase(prisma, openai);
  });

  it('deve retornar uma resposta do OpenAI baseada no versículo', async () => {
    const mockVerse = { book: 'João', chapter: 3, verse: 16, text: 'Porque Deus amou o mundo de tal maneira...' };
    const mockOpenAIResponse = {
      choices: [
        {
          message: {
            content: 'Esta é uma resposta simulada da IA.',
          },
        },
      ],
    };

    (prisma.verse.findFirst as jest.Mock).mockResolvedValue(mockVerse);
    (openai.chat.completions.create as jest.Mock).mockResolvedValue(mockOpenAIResponse);

    const resultado = await useCase.execute('O que significa este versículo?', 'João 3:16');

    expect(prisma.verse.findFirst).toHaveBeenCalledWith({
      where: { book: 'João', chapter: 3, verse: 16 },
    });

    expect(openai.chat.completions.create).toHaveBeenCalledWith({
      model: 'gpt-3.5-turbo',
      messages: [
        expect.objectContaining({
          role: 'user',
          content: expect.stringContaining('Porque Deus amou o mundo de tal maneira...'),
        }),
      ],
    });

    expect(resultado).toEqual({
      reference: 'João 3:16',
      text: 'Porque Deus amou o mundo de tal maneira...',
      answer: 'Esta é uma resposta simulada da IA.',
    });
  });

  it('deve lançar NotFoundException se o versículo não for encontrado', async () => {
    (prisma.verse.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute('Qualquer pergunta', 'João 3:16')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('Qualquer pergunta', 'João 3:16')).rejects.toThrow('Versículo não encontrado.');
  });

  it('deve lançar InternalServerErrorException se o OpenAI falhar', async () => {
    const mockVerse = { book: 'João', chapter: 3, verse: 16, text: 'Porque Deus amou o mundo de tal maneira...' };
    (prisma.verse.findFirst as jest.Mock).mockResolvedValue(mockVerse);
    (openai.chat.completions.create as jest.Mock).mockRejectedValue(new Error('OpenAI error'));

    await expect(useCase.execute('O que significa este versículo?', 'João 3:16')).rejects.toThrow(InternalServerErrorException);
    await expect(useCase.execute('O que significa este versículo?', 'João 3:16')).rejects.toThrow('Erro ao processar resposta com IA.');
  });
});
