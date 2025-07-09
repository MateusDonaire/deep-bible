import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function generateAllEmbeddings(batchSize = 100) {
  console.log('🚀 Iniciando geração de embeddings para todos os versículos...');

  let total = 0;

  while (true) {
  const verses = await prisma.$queryRawUnsafe<any[]>(`
    SELECT * FROM "Verse"
    WHERE embedding IS NULL
    ORDER BY id
    LIMIT ${batchSize}
  `);


    if (verses.length === 0) break;

    for (const verse of verses) {
      const inputText = `${verse.book} ${verse.chapter}:${verse.verse} - ${verse.text}`;

      try {
        const result = await openai.embeddings.create({
          model: 'text-embedding-ada-002',
          input: inputText,
        });

        const embedding = result.data[0].embedding;

      await prisma.verse.update({
        where: { id: verse.id },
        data: {
          ...( { embedding } as any )
        },
      });

        total++;
        console.log(`✅ Embedding salvo para ${verse.book} ${verse.chapter}:${verse.verse}`);
      } catch (error) {
        console.error(`❌ Erro no versículo ${verse.id}:`, error);
      }
    }

    console.log(`📦 Lote finalizado. Total processado até agora: ${total}`);
  }

  console.log(`🎉 Finalizado! Total de versículos processados: ${total}`);
}

generateAllEmbeddings().then(() => {
  prisma.$disconnect();
});
