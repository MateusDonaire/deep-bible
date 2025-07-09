import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { BibleModule } from './modules/bible/bible.module';
import { SearchModule } from './modules/search/search.module';
import { ChatModule } from './modules/chat/chat.module';

@Module({
  imports: [
    PrismaModule,
    BibleModule,
    SearchModule,
    ChatModule
  ]
})
export class AppModule {}
