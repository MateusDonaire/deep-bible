import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function populateTopicsTable() {
  const verses = await prisma.verse.findMany({
    select: { topics: true },
    where: {
      NOT: {
        OR: [
          { topics: { equals: [] } },
          { topics: { equals: null } },
        ],
      },
    },
  });

  const frequencyMap: Record<string, number> = {};

  for (const verse of verses) {
    for (const topic of verse.topics ?? []) {
      const key = topic.trim().toLowerCase();
      frequencyMap[key] = (frequencyMap[key] || 0) + 1;
    }
  }

  const sortedTopics = Object.entries(frequencyMap)
    .sort((a, b) => b[1] - a[1]);

  let rank = 1;

  for (const [name, count] of sortedTopics) {
    await prisma.topic.create({
      data: {
        id: rank,
        name,
        count,
        description: null, 
      },
    });
    rank++;
  }

  console.log(`✅ Tópicos inseridos na tabela.`);
  await prisma.$disconnect();
}

populateTopicsTable();
