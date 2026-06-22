import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { CommentsService } from './comments.service';

const mockCommentRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  findAndCountAll: jest.fn(),
};

const buildMockComment = (overrides = {}) => ({
  id: 'comment-uuid',
  productId: 'prod-uuid',
  userId: 'user-1',
  comment: 'Great product!',
  isDeleted: false,
  update: jest.fn().mockResolvedValue(undefined),
  ...overrides,
});

describe('CommentsService', () => {
  let service: CommentsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CommentsService,
        { provide: 'COMMENT_REPOSITORY', useValue: mockCommentRepository },
      ],
    }).compile();

    service = module.get<CommentsService>(CommentsService);
    jest.clearAllMocks();
  });

  describe('create()', () => {
    it('should create a comment', async () => {
      const created = buildMockComment();
      mockCommentRepository.create.mockResolvedValue(created);

      const result = await service.create(
        { productId: 'prod-uuid', comment: 'Great product!' },
        'user-1',
      );

      expect(result.comment).toBe('Great product!');
      expect(mockCommentRepository.create).toHaveBeenCalled();
    });

    it('should throw NotFoundException if parentCommentId does not exist', async () => {
      mockCommentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.create(
          { productId: 'prod-uuid', comment: 'Reply', parentCommentId: 'missing-id' },
          'user-1',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update()', () => {
    it('should update own comment', async () => {
      const mock = buildMockComment();
      mockCommentRepository.findOne.mockResolvedValue(mock);

      await service.update('comment-uuid', { comment: 'Updated text' }, 'user-1');

      expect(mock.update).toHaveBeenCalledWith({ comment: 'Updated text' });
    });

    it('should throw ForbiddenException if not the owner', async () => {
      mockCommentRepository.findOne.mockResolvedValue(buildMockComment({ userId: 'other-user' }));

      await expect(
        service.update('comment-uuid', { comment: 'Updated' }, 'user-1'),
      ).rejects.toThrow(ForbiddenException);
    });

    it('should throw NotFoundException when comment not found', async () => {
      mockCommentRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update('missing-id', { comment: 'Updated' }, 'user-1'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('softDelete()', () => {
    it('should soft-delete own comment', async () => {
      const mock = buildMockComment();
      mockCommentRepository.findOne.mockResolvedValue(mock);

      const result = await service.softDelete('comment-uuid', 'user-1');

      expect(mock.update).toHaveBeenCalledWith({ isDeleted: true });
      expect(result).toEqual({ message: 'Comment deleted successfully' });
    });

    it('should throw ForbiddenException if not the owner', async () => {
      mockCommentRepository.findOne.mockResolvedValue(buildMockComment({ userId: 'other-user' }));

      await expect(service.softDelete('comment-uuid', 'user-1')).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getByProduct()', () => {
    it('should return paginated results', async () => {
      const rows = [buildMockComment(), buildMockComment()];
      mockCommentRepository.findAndCountAll.mockResolvedValue({ rows, count: 2 });

      const result = await service.getByProduct('prod-uuid', { page: 1, limit: 10 });

      expect(result.data).toHaveLength(2);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.totalPages).toBe(1);
    });
  });
});
