import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import {
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
  ApiHeader,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { LikesService } from './likes.service';
import { CreateLikeDto } from './dto/create-like.dto';
import { DeleteLikeDto } from './dto/delete-like.dto';

@ApiTags('Likes')
@ApiHeader({ name: 'x-user-id', description: 'Simulated user ID (UUID). Auto-generated if omitted.' })
@UseGuards(ThrottlerGuard)
@Controller('likes')
export class LikesController {
  constructor(private readonly likesService: LikesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Like a product' })
  @ApiResponse({ status: 201, description: 'Product liked successfully' })
  @ApiResponse({ status: 409, description: 'Already liked' })
  like(@Body() dto: CreateLikeDto, @Req() req: Request) {
    return this.likesService.like(dto, req.user.id);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Unlike a product' })
  @ApiResponse({ status: 200, description: 'Product unliked successfully' })
  @ApiResponse({ status: 404, description: 'Like not found' })
  unlike(@Body() dto: DeleteLikeDto, @Req() req: Request) {
    return this.likesService.unlike(dto, req.user.id);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get total like count for a product' })
  @ApiParam({ name: 'productId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Like count returned' })
  getLikeCount(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.likesService.getLikeCount(productId);
  }
}
