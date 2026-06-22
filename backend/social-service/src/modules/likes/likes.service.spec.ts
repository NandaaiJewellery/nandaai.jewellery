import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { LikesService } from './likes.service';

const mockLikeRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  count: jest.fn(),
};

describe('LikesService', () => {
  let service: LikesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        LikesService,
        { provide: 'LIKE_REPOSITORY', useValue: mockLikeRepository },
      ],
    }).compile();

    service = module.get<LikesService>(LikesService);
    jest.clearAllMocks();
  });

  describe('like()', () => {
    it('should create a like when none exists', async () => {
      mockLikeRepository.findOne.mockResolvedValue(null);
      mockLikeRepository.create.mockResolvedValue({ id: 'uuid-1' });

      const result = await service.like({ productId: 'prod-uuid' }, 'user-1');

      expect(result).toEqual({ message: 'Product liked successfully' });
      expect(mockLikeRepository.create).toHaveBeenCalledWith({
        productId: 'prod-uuid',
        userId: 'user-1',
      });
    });

    it('should throw ConflictException if already liked', async () => {
      mockLikeRepository.findOne.mockResolvedValue({ id: 'existing' });

      await expect(service.like({ productId: 'prod-uuid' }, 'user-1')).rejects.toThrow(
        ConflictException,
      );
      expect(mockLikeRepository.create).not.toHaveBeenCalled();
    });
  });

  describe('unlike()', () => {
    it('should destroy the like when it exists', async () => {
      const mockLike = { destroy: jest.fn() };
      mockLikeRepository.findOne.mockResolvedValue(mockLike);

      const result = await service.unlike({ productId: 'prod-uuid' }, 'user-1');

      expect(result).toEqual({ message: 'Product unliked successfully' });
      expect(mockLike.destroy).toHaveBeenCalled();
    });

    it('should throw NotFoundException if like does not exist', async () => {
      mockLikeRepository.findOne.mockResolvedValue(null);

      await expect(service.unlike({ productId: 'prod-uuid' }, 'user-1')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getLikeCount()', () => {
    it('should return count for a product', async () => {
      mockLikeRepository.count.mockResolvedValue(42);

      const result = await service.getLikeCount('prod-uuid');

      expect(result).toEqual({ productId: 'prod-uuid', count: 42 });
    });
  });
});
