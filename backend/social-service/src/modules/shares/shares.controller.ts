import {
  Body,
  Controller,
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
  ApiHeader,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ThrottlerGuard } from '@nestjs/throttler';
import { Request } from 'express';
import { SharesService } from './shares.service';
import { CreateShareDto } from './dto/create-share.dto';

@ApiTags('Shares')
@ApiHeader({ name: 'x-user-id', description: 'Simulated user ID (UUID). Auto-generated if omitted.' })
@UseGuards(ThrottlerGuard)
@Controller('shares')
export class SharesController {
  constructor(private readonly sharesService: SharesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Share a product (increments count if already shared)' })
  @ApiResponse({ status: 201, description: 'Share recorded / incremented via transaction' })
  share(@Body() dto: CreateShareDto, @Req() req: Request) {
    return this.sharesService.share(dto, req.user.id);
  }

  @Get(':productId')
  @ApiOperation({ summary: 'Get total share count for a product' })
  @ApiParam({ name: 'productId', type: 'string', format: 'uuid' })
  @ApiResponse({ status: 200, description: 'Total share count' })
  getShareCount(@Param('productId', ParseUUIDPipe) productId: string) {
    return this.sharesService.getShareCount(productId);
  }
}
