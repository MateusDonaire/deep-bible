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

  it('deve funcionar com livros de uma palavra', async () => {
    const mockVerse = { book: 'João', chapter: 3, verse: 16, text: 'Porque Deus amou o mundo...' };
    const mockOpenAIResponse = {
      choices: [
        {
          message: {
            content: 'Resposta simulada da IA.',
          },
        },
      ],
    };

    (prisma.verse.findFirst as jest.Mock).mockResolvedValue(mockVerse);
    (openai.chat.completions.create as jest.Mock).mockResolvedValue(mockOpenAIResponse);

    const resultado = await useCase.execute('O que significa este versículo?', 'João 3:16');

    expect(resultado).toEqual({
      reference: 'João 3:16',
      text: mockVerse.text,
      answer: 'Resposta simulada da IA.',
    });
  });

  it('deve funcionar com livros de duas palavras', async () => {
    const mockVerse = { book: '1 Pedro', chapter: 3, verse: 7, text: 'Igualmente vós, maridos...' };
    const mockOpenAIResponse = {
      choices: [
        {
          message: {
            content: 'Outra resposta simulada da IA.',
          },
        },
      ],
    };

    (prisma.verse.findFirst as jest.Mock).mockResolvedValue(mockVerse);
    (openai.chat.completions.create as jest.Mock).mockResolvedValue(mockOpenAIResponse);

    const resultado = await useCase.execute('Como aplicar este versículo?', '1 Pedro 3:7');

    expect(resultado).toEqual({
      reference: '1 Pedro 3:7',
      text: mockVerse.text,
      answer: 'Outra resposta simulada da IA.',
    });
  });

  it('deve lançar NotFoundException se o versículo não for encontrado', async () => {
    (prisma.verse.findFirst as jest.Mock).mockResolvedValue(null);

    await expect(useCase.execute('Qualquer pergunta', 'João 3:16')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('Qualquer pergunta', 'João 3:16')).rejects.toThrow('Versículo não encontrado.');
  });

  it('deve lançar InternalServerErrorException se o OpenAI falhar', async () => {
    const mockVerse = { book: 'João', chapter: 3, verse: 16, text: 'Porque Deus amou o mundo...' };
    (prisma.verse.findFirst as jest.Mock).mockResolvedValue(mockVerse);
    (openai.chat.completions.create as jest.Mock).mockRejectedValue(new Error('OpenAI error'));

    await expect(useCase.execute('O que significa este versículo?', 'João 3:16')).rejects.toThrow(InternalServerErrorException);
    await expect(useCase.execute('O que significa este versículo?', 'João 3:16')).rejects.toThrow('Erro ao processar resposta com IA.');
  });

  it('deve lançar NotFoundException para formato inválido', async () => {
    await expect(useCase.execute('Pergunta qualquer', 'João316')).rejects.toThrow(NotFoundException);
    await expect(useCase.execute('Pergunta qualquer', 'João316')).rejects.toThrow('Formato inválido de referência bíblica. Use algo como "1 Pedro 3:7".');
  });
});
