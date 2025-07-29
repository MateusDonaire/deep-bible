import { Injectable } from "@nestjs/common";
import { IBibleRepository } from "../../domain/interfaces/bible-repository.interface";
import { PrismaService } from "@/infra/prisma/prisma.service";
import { VerseEntity } from "../../domain/dtos/entities/verse.entity";

@Injectable()
export class BibleRepository implements IBibleRepository {
  constructor(private readonly prisma: PrismaService) {}
  
    async findVerse(book: string, chapter: number, verse: number): Promise<VerseEntity | null> {
        return this.prisma.verse.findFirst({
            where: {
            book: { equals: book, mode: 'insensitive' },
            chapter,
            verse,
            },
        });
    }
}
