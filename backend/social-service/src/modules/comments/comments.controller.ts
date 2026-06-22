import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCommentsDto } from './dto/get-comments.dto';

@ApiTags('Comments')
@ApiHeader({ name: 'x-user-id', description: 'Simulated user ID (UUID). Auto-generated if omitted.' })
@UseGuards(ThrottlerGuard)
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a comment on a product' })
  @ApiResponse({ status: 201, description: 'Comment created' })
  create(@Body() dto: CreateCommentDto, @Req() req: Request) {
    return this.commentsService.create(dto, req.user.id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a comment' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Comment updated' })
  @ApiResponse({ status: 403, description: 'Not the owner' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateCommentDto,
    @Req() req: Request,
  ) {
    return this.commentsService.update(id, dto, req.user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Soft delete a comment' })
  @ApiParam({ name: 'id', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Comment soft-deleted' })
  @ApiResponse({ status: 403, description: 'Not the owner' })
  @ApiResponse({ status: 404, description: 'Comment not found' })
  softDelete(@Param('id', ParseUUIDPipe) id: string, @Req() req: Request) {
    return this.commentsService.softDelete(id, req.user.id);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get paginated comments for a product (newest first, excludes deleted)' })
  @ApiParam({ name: 'productId', type: 'string', format: 'uuid' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'Paginated comments list' })
  getByProduct(
    @Param('productId', ParseUUIDPipe) productId: string,
    @Query() dto: GetCommentsDto,
  ) {
    return this.commentsService.getByProduct(productId, dto);
  }
}
