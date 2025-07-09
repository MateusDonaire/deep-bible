import { ApiProperty } from '@nestjs/swagger';
import { IsString, MinLength } from 'class-validator';

export class SemanticQueryDto {
  @ApiProperty({
    description: 'Texto da consulta para busca semântica',
    example: '',
  })
  @IsString()
  @MinLength(2)
  query!: string;
}