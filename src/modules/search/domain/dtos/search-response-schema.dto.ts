import { ApiProperty } from '@nestjs/swagger';

export class SearchResultDto {
  @ApiProperty({ example: 'Mateus 28:19' })
  reference: string;

  @ApiProperty({ example: 'Portanto, vão e façam discípulos de todas as nações...' })
  text: string;

}

export class SearchResponseDto {
  @ApiProperty({ type: [SearchResultDto] })
  results: SearchResultDto[];
}
