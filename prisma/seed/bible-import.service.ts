import { PrismaClient } from '@prisma/client';
import { loadVersesFromJson } from './loader';

const prisma = new PrismaClient();

export async function runBibleImport() {
  const verses = loadVersesFromJson();
  console.log(`Importando ${verses.length} versículos...`);

  await prisma.verse.createMany({
    data: verses,
    skipDuplicates: true,
  });

  console.log(`Importação concluída com sucesso.`);
  await prisma.$disconnect();
}