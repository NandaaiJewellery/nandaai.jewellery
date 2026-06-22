import {
  ConflictException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Op } from 'sequelize';
import { Like } from './likes.model';
import { CreateLikeDto } from './dto/create-like.dto';
import { DeleteLikeDto } from './dto/delete-like.dto';

@Injectable()
export class LikesService {
  constructor(
    @Inject('LIKE_REPOSITORY')
    private readonly likeRepository: typeof Like,
  ) {}

  async like(dto: CreateLikeDto, userId: string): Promise<{ message: string }> {
    const existing = await this.likeRepository.findOne({
      where: { productId: dto.productId, userId },
    });

    if (existing) {
      throw new ConflictException('You have already liked this product');
    }

    await this.likeRepository.create({
      productId: dto.productId,
      userId,
    } as any);

    return { message: 'Product liked successfully' };
  }

  async unlike(dto: DeleteLikeDto, userId: string): Promise<{ message: string }> {
    const like = await this.likeRepository.findOne({
      where: { productId: dto.productId, userId },
    });

    if (!like) {
      throw new NotFoundException('Like not found');
    }

    await like.destroy();
    return { message: 'Product unliked successfully' };
  }

  async getLikeCount(productId: string): Promise<{ productId: string; count: number }> {
    const count = await this.likeRepository.count({
      where: { productId },
    });

    return { productId, count };
  }
}
