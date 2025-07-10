import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';  // removido o import quebrado 'Verse'
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

type Verse = {
  id: number;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  topics: string[] | null;
};

async function generateTopicsByChapter(batchSize = 5) {
  console.log('🚀 Iniciando geração de tópicos por capítulo...');

  let total = 0;

  while (true) {
    const verses = await prisma.verse.findMany({
      where: {
        OR: [{ topics: { equals: [] } }, { topics: { equals: null } }],
      },
      take: batchSize,
    });

    if (verses.length === 0) break;

    const grouped = new Map<string, { book: string; chapter: number; ids: number[] }>();

    for (const verse of verses) {
      const key = `${verse.book}-${verse.chapter}`;
      if (!grouped.has(key)) {
        grouped.set(key, { book: verse.book, chapter: verse.chapter, ids: [] });
      }
      grouped.get(key)!.ids.push(verse.id);
    }

    for (const { book, chapter } of grouped.values()) {
      const allVerses = await prisma.verse.findMany({
        where: { book, chapter },
        orderBy: { verse: 'asc' },
      });

      const allIds = allVerses.map((v: Verse) => v.id);  // tipado manualmente
      const fullText = allVerses.map((v: Verse) => `${v.verse}. ${v.text}`).join(' ');

      const prompt = `Com base no texto completo abaixo, gere até 3 tópicos curtos, genéricos e representativos que resumem o tema do capítulo bíblico. Use apenas uma ou duas palavras por tópico, sem números, hífens ou frases longas. Separe por vírgulas. Ex: Criação, Redenção, Julgamento.

Texto: ${book} capítulo ${chapter} - ${fullText}`;

      try {
        const response = await openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'user', content: prompt }],
        });

        const raw = response.choices[0].message.content || '';
        const topics = raw.split(',').map((t) => t.trim()).filter((t) => t.length > 1);

        if (topics.length === 0) {
          console.warn(`⚠️ Nenhum tópico válido para ${book} ${chapter}`);
          continue;
        }

        await prisma.verse.updateMany({
          where: { id: { in: allIds } },
          data: { topics },
        });

        console.log(`📘 ${book} ${chapter}: ${topics.join(', ')}`);
        total += allIds.length;
      } catch (err: any) {
        console.error(`❌ Erro em ${book} ${chapter}:`, err.message || err);
      }
    }
  }

  console.log(`🎉 Concluído! Versículos processados: ${total}`);
  await prisma.$disconnect();
}

generateTopicsByChapter();
