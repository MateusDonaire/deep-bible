import { AiService } from '@/modules/chat/infrastructure/services/ai.service';
import OpenAI from 'openai';

jest.mock('openai');

describe('AiService', () => {
  let aiService: AiService;
  let mockCreate: jest.Mock;

  beforeEach(() => {
    mockCreate = jest.fn();

    const mockOpenAI = {
      chat: {
        completions: {
          create: mockCreate,
        },
      },
    };

    (OpenAI as unknown as jest.Mock).mockImplementation(() => mockOpenAI);

    aiService = new AiService();
  });

  it('deve retornar a resposta da IA', async () => {
    const prompt = 'Explique João 3:16';
    const mockResponse = {
      choices: [
        {
          message: {
            content: 'Porque Deus amou o mundo...',
          },
        },
      ],
    };

    mockCreate.mockResolvedValue(mockResponse);

    const result = await aiService.ask(prompt);

    expect(mockCreate).toHaveBeenCalledWith({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: prompt }],
    });
    expect(result).toBe('Porque Deus amou o mundo...');
  });

  it('deve retornar string vazia se não houver conteúdo na resposta', async () => {
    mockCreate.mockResolvedValue({
      choices: [{ message: { content: '' } }],
    });

    const result = await aiService.ask('Qual o propósito do homem?');

    expect(result).toBe('');
  });
});
