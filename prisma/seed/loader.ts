import * as fs from 'fs';
import * as path from 'path';

type Verse = {
  book: string;
  chapter: number;
  verse: number;
  text: string;
};

export function loadVersesFromJson(): Verse[] {
  const filePath = path.join(__dirname, '..', 'json', 'pt_nvi.json');

  let raw = fs.readFileSync(filePath, { encoding: 'utf-8' });

  if (raw.charCodeAt(0) === 0xFEFF) {
    raw = raw.slice(1);
  }

  const data = JSON.parse(raw);
  const verses: Verse[] = [];

  for (const bookObj of data) {

    const book = (bookObj.book || bookObj.name || bookObj.abbrev)?.trim();

    if (!book || !bookObj.chapters) {
      console.warn('⚠️ Livro ignorado (sem nome ou capítulos):', bookObj);
      continue;
    }

    console.log(`📖 Importando livro: ${book} (${bookObj.chapters.length} capítulos)`);

    bookObj.chapters.forEach((chapter: string[], cIdx: number) => {
      chapter.forEach((text: string, vIdx: number) => {
        verses.push({
          book,
          chapter: cIdx + 1,
          verse: vIdx + 1,
          text,
        });
      });
    });
  }

  console.log(`✅ Total de versículos preparados para importação: ${verses.length}`);
  return verses;
}