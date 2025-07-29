import { VerseEntity } from '../entities/verse.entity';

export interface IBibleRepository {
  findBook(book: string): Promise<boolean>;
  findChapter(book: string, chapter: number): Promise<boolean>;
  findVerse(book: string, chapter: number, verse: number): Promise<VerseEntity | null>;
  findChapterVerses(book: string, chapter: number): Promise<VerseEntity[]>;
}
