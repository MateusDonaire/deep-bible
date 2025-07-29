import { VerseEntity } from "../entities/verse.entity";

export interface IBibleRepository {
  findBook(book: string): Promise<boolean>;
  findChapterVerses(book: string, chapter: number): Promise<VerseEntity[]>;
}
