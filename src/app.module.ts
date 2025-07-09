import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { BibleModule } from './modules/bible/bible.module';
import { SearchModule } from './modules/search/search.module';

@Module({
  imports: [
    PrismaModule,
    BibleModule,
    SearchModule
  ]
})
export class AppModule {}
