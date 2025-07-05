import { Controller, Get } from '@nestjs/common';
import { BibleService } from './bible.service';

@Controller('bible')
export class BibleController {
  constructor(private readonly bibleService: BibleService) {}

  @Get('test')
  async getTestVerses() {
    return this.bibleService.testConnection();
  }
}
