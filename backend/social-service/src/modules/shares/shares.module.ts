import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { SharesController } from './shares.controller';
import { SharesService } from './shares.service';
import { sharesProviders } from './shares.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [SharesController],
  providers: [SharesService, ...sharesProviders],
})
export class SharesModule {}
