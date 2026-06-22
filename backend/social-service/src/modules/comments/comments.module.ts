import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module';
import { CommentsController } from './comments.controller';
import { CommentsService } from './comments.service';
import { commentsProviders } from './comments.providers';

@Module({
  imports: [DatabaseModule],
  controllers: [CommentsController],
  providers: [CommentsService, ...commentsProviders],
})
export class CommentsModule {}
