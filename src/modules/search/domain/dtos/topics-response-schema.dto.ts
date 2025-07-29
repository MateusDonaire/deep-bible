import { ApiProperty } from '@nestjs/swagger';

export class TopicDto {
  @ApiProperty({ example: 'Amor' })
  name: string;

  @ApiProperty({ example: 123, description: 'Número de vezes que o tópico foi acessado' })
  popularity: number;
}

export class TopicsResponseDto {
  @ApiProperty({ type: [TopicDto] })
  topics: TopicDto[];
}
