import { Body, Controller, Post } from '@nestjs/common';
import { AskToBibleDto } from '../domain/dtos/ask-to-bible.dto';
import { AskToBibleUseCase } from '../application/use-cases/ask-to-bible.use-case';
import { ApiOperation, ApiResponse } from '@nestjs/swagger/dist/decorators';

@Controller('ai')
export class AskToBibleController {
  constructor(private readonly askToBible: AskToBibleUseCase) {}

  @Post('ask-to-bible')
  @ApiOperation({ summary: 'Faz uma pergunta para a IA com base no versículo da Bíblia' })
  @ApiResponse({
    status: 200,
    description: 'Resposta gerada pela IA.',
    schema: { 
      example: { 
      reference: "Mateus 28:19",
      text: "Portanto, vão e façam discípulos de todas as nações, batizando-os em nome do Pai e do Filho e do Espírito Santo,",
      answer: 'Para fazer discípulos por todas as nações, precisamos, em primeiro lugar, estar firmes em nossa fé e comprometidos em seguir os mandamentos de Jesus...' } },
  })
  async handle(@Body() dto: AskToBibleDto) {
    return this.askToBible.execute(dto.query!, dto.bibleVerse!);
  }
}
