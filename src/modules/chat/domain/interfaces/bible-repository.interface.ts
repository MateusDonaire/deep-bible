import { VerseEntity } from "../dtos/entities/verse.entity";

export interface IBibleRepository {
  findVerse(book: string, chapter: number, verse: number): Promise<VerseEntity | null>;
}
