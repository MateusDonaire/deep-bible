import { ApiProperty } from '@nestjs/swagger/dist/decorators/api-property.decorator';
import { IsNotEmpty, IsString } from 'class-validator';

export class AskToBibleDto {
  @ApiProperty({ example: 'Como posso fazer discípulos por todas as nações?', description: 'Pergunta feita para a IA sobre um versículo bíblico.' })
  @IsString()
  @IsNotEmpty()
  query: string | undefined;

  @ApiProperty({ example: 'Mateus 28:19', description: 'Referência bíblica específica.' })
  @IsString()
  @IsNotEmpty()
  bibleVerse: string | undefined; 
}
