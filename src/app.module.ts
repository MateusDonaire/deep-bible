import { Module } from '@nestjs/common';
import { PrismaModule } from './infra/prisma/prisma.module';
import { BibleModule } from './modules/bible/bible.module';

@Module({
  imports: [BibleModule, PrismaModule]
})
export class AppModule {}
