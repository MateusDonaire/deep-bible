export interface VerseEntity {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  topics?: string[] | null;
}
