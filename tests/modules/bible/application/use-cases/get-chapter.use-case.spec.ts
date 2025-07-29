// src/modules/bible/application/use-cases/get-chapter.use-case.spec.ts
import { GetChapterUseCase } from '@/modules/bible/application/use-cases/get-chapter.use-case';
import { IBibleRepository } from '@/modules/bible/domain/interfaces/bible-repository.interface';
import { NotFoundException } from '@nestjs/common';

describe('GetChapterUseCase', () => {
  let useCase: GetChapterUseCase;
  let bibleRepo: jest.Mocked<IBibleRepository>;

  const mockVerses = [
    { id: 1, book: 'Gênesis', chapter: 1, verse: 1, text: 'No princípio...', topics: [] },
    { id: 2, book: 'Gênesis', chapter: 1, verse: 2, text: 'A terra era sem forma...', topics: [] },
  ];

  beforeEach(() => {
    bibleRepo = {
      findBook: jest.fn(),
      findChapterVerses: jest.fn(),
    } as unknown as jest.Mocked<IBibleRepository>;

    useCase = new GetChapterUseCase(bibleRepo);
  });

  it('✅ deve retornar os versículos quando o livro e o capítulo existem', async () => {
    bibleRepo.findBook.mockResolvedValue(true);
    bibleRepo.findChapterVerses.mockResolvedValue(mockVerses);

    const result = await useCase.execute('Gênesis', 1);

    expect(result).toEqual(mockVerses);
    expect(bibleRepo.findBook).toHaveBeenCalledWith('Gênesis');
    expect(bibleRepo.findChapterVerses).toHaveBeenCalledWith('Gênesis', 1);
  });

  it('❌ deve lançar NotFoundException se o livro não existir', async () => {
    bibleRepo.findBook.mockResolvedValue(false);

    await expect(useCase.execute('LivroFalso', 1)).rejects.toThrowError(
      new NotFoundException("Livro 'LivroFalso' não encontrado."),
    );

    expect(bibleRepo.findBook).toHaveBeenCalledWith('LivroFalso');
    expect(bibleRepo.findChapterVerses).not.toHaveBeenCalled();
  });

  it('❌ deve lançar NotFoundException se o capítulo não existir', async () => {
    bibleRepo.findBook.mockResolvedValue(true);
    bibleRepo.findChapterVerses.mockResolvedValue([]);

    await expect(useCase.execute('Gênesis', 999)).rejects.toThrowError(
      new NotFoundException("Capítulo 999 do livro 'Gênesis' não encontrado."),
    );

    expect(bibleRepo.findBook).toHaveBeenCalledWith('Gênesis');
    expect(bibleRepo.findChapterVerses).toHaveBeenCalledWith('Gênesis', 999);
  });
});
