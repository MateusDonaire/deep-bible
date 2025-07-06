import { Injectable } from '@nestjs/common';
import { PrismaService } from '@/infra/prisma/prisma.service';

@Injectable()
export class SearchVersesUseCase {
  constructor(private readonly prisma: PrismaService) {}

  async execute(query: string) {
    if (!query || query.length < 2) {
      throw new Error('A consulta deve ter pelo menos 2 caracteres.');
    }

    const results = await this.prisma.verse.findMany({
      where: {
        text: {
          contains: query,
          mode: 'insensitive',
        },
      },
      take: 10,
      orderBy: { id: 'asc' },
    });

    return results;
  }
}
