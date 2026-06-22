import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { LikesController } from './likes.controller';
import { LikesService } from './likes.service';
import { likesProviders } from './likes.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [LikesController],
  providers: [LikesService, ...likesProviders],
})
export class LikesModule {}
