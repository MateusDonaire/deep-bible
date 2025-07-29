import { ApiProperty } from '@nestjs/swagger';

export class VerseResponseDto {
  @ApiProperty({ example: 'Mateus' })
  book: string;

  @ApiProperty({ example: 28 })
  chapter: number;

  @ApiProperty({ example: 19 })
  verse: number;

  @ApiProperty({ example: 'Portanto, vão e façam discípulos de todas as nações...' })
  text: string;
}

export class ChapterResponseDto {
  @ApiProperty({ example: 'Mateus' })
  book: string;

  @ApiProperty({ example: 28 })
  chapter: number;

  @ApiProperty({
    example: [
      { verse: 1, text: 'Depois do sábado...' },
      { verse: 2, text: 'Houve um grande terremoto...' },
    ],
  })
  verses: { verse: number; text: string }[];
}

export class BookResponseDto {
  @ApiProperty({ example: 'Mateus' })
  book: string;

  @ApiProperty({ example: 28 })
  chapters: number;
}