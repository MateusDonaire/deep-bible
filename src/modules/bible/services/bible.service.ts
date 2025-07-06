import { PrismaService } from '@/infra/prisma/prisma.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class BibleService {
  constructor(private readonly prisma: PrismaService) {}

  async testConnection() {
    const allVerses = await this.prisma.verse.findMany({
      take: 5,
    });
    return allVerses;
  }
}