import { Test, TestingModule } from '@nestjs/testing';
import { SharesService } from './shares.service';

const mockTransaction = {
  commit: jest.fn(),
  rollback: jest.fn(),
};

const mockShareRepository = {
  findOne: jest.fn(),
  create: jest.fn(),
  findAll: jest.fn(),
};

const mockSequelize = {
  transaction: jest.fn().mockResolvedValue(mockTransaction),
};

describe('SharesService', () => {
  let service: SharesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SharesService,
        { provide: 'SHARE_REPOSITORY', useValue: mockShareRepository },
        { provide: 'SEQUELIZE', useValue: mockSequelize },
      ],
    }).compile();

    service = module.get<SharesService>(SharesService);
    jest.clearAllMocks();
    mockSequelize.transaction.mockResolvedValue(mockTransaction);
  });

  describe('share()', () => {
    it('should create a new share record inside a transaction', async () => {
      mockShareRepository.findOne.mockResolvedValue(null);
      const created = { id: 'share-uuid', shareCount: 1 };
      mockShareRepository.create.mockResolvedValue(created);

      const result = await service.share({ productId: 'prod-uuid' }, 'user-1');

      expect(mockSequelize.transaction).toHaveBeenCalled();
      expect(mockShareRepository.create).toHaveBeenCalled();
      expect(mockTransaction.commit).toHaveBeenCalled();
      expect(result).toEqual(created);
    });

    it('should increment shareCount when share exists', async () => {
      const existing = { shareCount: 3, update: jest.fn().mockResolvedValue(undefined) };
      mockShareRepository.findOne.mockResolvedValue(existing);

      await service.share({ productId: 'prod-uuid' }, 'user-1');

      expect(existing.update).toHaveBeenCalledWith({ shareCount: 4 }, expect.anything());
      expect(mockTransaction.commit).toHaveBeenCalled();
    });

    it('should rollback on error', async () => {
      mockShareRepository.findOne.mockRejectedValue(new Error('DB error'));

      await expect(service.share({ productId: 'prod-uuid' }, 'user-1')).rejects.toThrow('DB error');
      expect(mockTransaction.rollback).toHaveBeenCalled();
    });
  });

  describe('getShareCount()', () => {
    it('should return sum of all share_count for a product', async () => {
      mockShareRepository.findAll.mockResolvedValue([
        { shareCount: 3 },
        { shareCount: 7 },
      ]);

      const result = await service.getShareCount('prod-uuid');

      expect(result).toEqual({ productId: 'prod-uuid', totalShares: 10 });
    });

    it('should return 0 if no shares exist', async () => {
      mockShareRepository.findAll.mockResolvedValue([]);

      const result = await service.getShareCount('prod-uuid');

      expect(result).toEqual({ productId: 'prod-uuid', totalShares: 0 });
    });
  });
});
