import { PrismaService } from '@/infra/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { GetVerseUseCase } from './get-verse.use-case';

describe('GetVerseUseCase', () => {
  let useCase: GetVerseUseCase;
  let prisma: PrismaService;

  beforeEach(() => {
    prisma = {
      verse: { findFirst: jest.fn() },
    } as any;

    useCase = new GetVerseUseCase(prisma);
  });

  it('should return a verse', async () => {
    const mockVerse = { book: 'João', chapter: 3, verse: 16, text: 'Porque Deus tanto amou o mundo que' };

    (prisma.verse.findFirst as jest.Mock).mockResolvedValueOnce(mockVerse);

    const result = await useCase.execute('João', 3, 16);

    expect(result).toEqual(mockVerse);
    expect(prisma.verse.findFirst).toHaveBeenCalledTimes(1);
  });

  it('should throw NotFoundException if book not found', async () => {
    (prisma.verse.findFirst as jest.Mock)
      .mockResolvedValueOnce(null)  
      .mockResolvedValueOnce(null)  
      .mockResolvedValueOnce(null); 

    const promise = useCase.execute('LivroInexistente', 3, 16);

    await expect(promise).rejects.toThrow(NotFoundException);
    await expect(promise).rejects.toThrow("Livro 'LivroInexistente' não encontrado.");
    expect(prisma.verse.findFirst).toHaveBeenCalledTimes(3);
  });

  it('should throw NotFoundException if chapter not found', async () => {
    (prisma.verse.findFirst as jest.Mock)
      .mockResolvedValueOnce(null)  
      .mockResolvedValueOnce(null)  
      .mockResolvedValueOnce({});   

    const promise = useCase.execute('João', 999, 16);

    await expect(promise).rejects.toThrow(NotFoundException);
    await expect(promise).rejects.toThrow("Capítulo 999 do livro 'João' não encontrado.");
    expect(prisma.verse.findFirst).toHaveBeenCalledTimes(3);
  });

  it('should throw NotFoundException if verse not found but book and chapter exist', async () => {
    (prisma.verse.findFirst as jest.Mock)
      .mockResolvedValueOnce(null)  
      .mockResolvedValueOnce({});   

    const promise = useCase.execute('João', 3, 999);

    await expect(promise).rejects.toThrow(NotFoundException);
    await expect(promise).rejects.toThrow("Versículo 999 do capítulo 3 do livro 'João' não encontrado.");
    expect(prisma.verse.findFirst).toHaveBeenCalledTimes(2);
  });
});
