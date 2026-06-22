import {
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Comment } from './comments.model';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { GetCommentsDto } from './dto/get-comments.dto';
import { paginate, PaginatedResult } from '../../common/utils/pagination.util';

@Injectable()
export class CommentsService {
  constructor(
    @Inject('COMMENT_REPOSITORY')
    private readonly commentRepository: typeof Comment,
  ) {}

  async create(dto: CreateCommentDto, userId: string): Promise<Comment> {
    if (dto.parentCommentId) {
      const parent = await this.commentRepository.findOne({
        where: { id: dto.parentCommentId, isDeleted: false },
      });
      if (!parent) {
        throw new NotFoundException('Parent comment not found');
      }
    }

    return this.commentRepository.create({
      productId: dto.productId,
      userId,
      comment: dto.comment,
      parentCommentId: dto.parentCommentId ?? null,
    } as any);
  }

  async update(id: string, dto: UpdateCommentDto, userId: string): Promise<Comment> {
    const comment = await this.findActiveOrFail(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only edit your own comments');
    }

    await comment.update({ comment: dto.comment });
    return comment;
  }

  async softDelete(id: string, userId: string): Promise<{ message: string }> {
    const comment = await this.findActiveOrFail(id);

    if (comment.userId !== userId) {
      throw new ForbiddenException('You can only delete your own comments');
    }

    await comment.update({ isDeleted: true });
    return { message: 'Comment deleted successfully' };
  }

  async getByProduct(
    productId: string,
    dto: GetCommentsDto,
  ): Promise<PaginatedResult<Comment>> {
    const page = dto.page ?? 1;
    const limit = dto.limit ?? 10;
    const offset = (page - 1) * limit;

    const { rows, count } = await this.commentRepository.findAndCountAll({
      where: { productId, isDeleted: false },
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    return paginate(rows, count, page, limit);
  }

  private async findActiveOrFail(id: string): Promise<Comment> {
    const comment = await this.commentRepository.findOne({
      where: { id, isDeleted: false },
    });

    if (!comment) {
      throw new NotFoundException('Comment not found');
    }

    return comment;
  }
}
