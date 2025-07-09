import { Body, Controller, Post } from '@nestjs/common';
import { AskToBibleDto } from '../dtos/ask-to-bible.dto';
import { AskToBibleUseCase } from '../use-cases/ask-to-bible.use-case';

@Controller('ai')
export class AskToBibleController {
  constructor(private readonly askToBible: AskToBibleUseCase) {}

  @Post('ask-to-bible')
  async handle(@Body() dto: AskToBibleDto) {
    return this.askToBible.execute(dto.query!, dto.bibleVerse!);
  }
}
