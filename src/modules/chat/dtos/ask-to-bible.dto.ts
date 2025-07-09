import { IsNotEmpty, IsString } from 'class-validator';

export class AskToBibleDto {
  @IsString()
  @IsNotEmpty()
  query: string | undefined;

  @IsString()
  @IsNotEmpty()
  bibleVerse: string | undefined; 
}
