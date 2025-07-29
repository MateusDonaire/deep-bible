// src/modules/bible/application/use-cases/get-verse.use-case.spec.ts
import { GetVerseUseCase } from '@/modules/bible/application/use-cases/get-verse.use-case';
import { IBibleRepository } from '@/modules/bible/domain/interfaces/bible-repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('GetVerseUseCase', () => {
  let useCase: GetVerseUseCase;
  let bibleRepo: jest.Mocked<IBibleRepository>;

  const mockVerse = {
    id: 1,
    book: 'João',
    chapter: 3,
    verse: 16,
    text: 'Porque Deus amou o mundo...',
    topics: ['amor', 'evangelho'],
  };

  beforeEach(() => {
    bibleRepo = {
      findVerse: jest.fn(),
      findChapter: jest.fn(),
      findBook: jest.fn(),
      findChapterVerses: jest.fn(),
    } as unknown as jest.Mocked<IBibleRepository>;

    useCase = new GetVerseUseCase(bibleRepo);
  });

  it('✅ deve retornar o versículo quando encontrado', async () => {
    bibleRepo.findVerse.mockResolvedValue(mockVerse);

    const result = await useCase.execute('João', 3, 16);

    expect(result).toEqual(mockVerse);
    expect(bibleRepo.findVerse).toHaveBeenCalledWith('João', 3, 16);
  });

  it('❌ deve lançar erro se versículo não existir mas o capítulo existir', async () => {
    bibleRepo.findVerse.mockResolvedValue(null);
    bibleRepo.findChapter.mockResolvedValue(true);

    await expect(useCase.execute('João', 3, 99)).rejects.toThrowError(
      new NotFoundException(`Versículo 99 do capítulo 3 do livro 'João' não encontrado.`),
    );

    expect(bibleRepo.findChapter).toHaveBeenCalledWith('João', 3);
  });

  it('❌ deve lançar erro se capítulo não existir mas o livro existir', async () => {
    bibleRepo.findVerse.mockResolvedValue(null);
    bibleRepo.findChapter.mockResolvedValue(false);
    bibleRepo.findBook.mockResolvedValue(true);

    await expect(useCase.execute('João', 99, 1)).rejects.toThrowError(
      new NotFoundException(`Capítulo 99 do livro 'João' não encontrado.`),
    );

    expect(bibleRepo.findBook).toHaveBeenCalledWith('João');
  });

  it('❌ deve lançar erro se livro não existir', async () => {
    bibleRepo.findVerse.mockResolvedValue(null);
    bibleRepo.findChapter.mockResolvedValue(false);
    bibleRepo.findBook.mockResolvedValue(false);

    await expect(useCase.execute('LivroFalso', 1, 1)).rejects.toThrowError(
      new NotFoundException(`Livro 'LivroFalso' não encontrado.`),
    );
  });
});
