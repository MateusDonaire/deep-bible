import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './infra/prisma/prisma.module';
import { BibleModule } from './modules/bible/bible.module';

@Module({
  
  imports: [BibleModule, PrismaModule],
  controllers: [AppController] ,
  providers: [AppService],
})
export class AppModule {}
