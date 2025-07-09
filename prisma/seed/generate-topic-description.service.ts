import OpenAI from 'openai';
import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

async function generateDescriptions() {
  console.log('📘 Iniciando geração de descrições para os tópicos...');

  const topics = await prisma.topic.findMany({
    where: { description: null },
    orderBy: { id: 'asc' },
  });

  for (const topic of topics) {
    const prompt = `Explique de forma resumida o tema bíblico "${topic.name}" para um cristão que deseja estudar a Bíblia de forma mais profunda. Use no máximo 1 frase, em português claro, com base no ensino das Escrituras, não cite referências bíblicas, ex: "Mt 3:5".`;

    try {
      const response = await openai.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const content = response.choices[0].message.content?.trim();

      if (!content) {
        console.warn(`⚠️ Sem resposta para: ${topic.name}`);
        continue;
      }

      await prisma.topic.update({
        where: { id: topic.id },
        data: { description: content },
      });

      console.log(`✅ ${topic.name}: ${content}`);
    } catch (error: any) {
      console.error(`❌ Erro no tópico "${topic.name}":`, error.message || error);
    }

  }

  console.log('🎉 Concluído!');
  await prisma.$disconnect();
}

generateDescriptions();
