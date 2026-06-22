import { Inject, Injectable } from '@nestjs/common';
import { Sequelize } from 'sequelize-typescript';
import { Share } from './shares.model';
import { CreateShareDto } from './dto/create-share.dto';

@Injectable()
export class SharesService {
  constructor(
    @Inject('SHARE_REPOSITORY')
    private readonly shareRepository: typeof Share,
    @Inject('SEQUELIZE')
    private readonly sequelize: Sequelize,
  ) {}

  async share(dto: CreateShareDto, userId: string): Promise<Share> {
    const transaction = await this.sequelize.transaction();

    try {
      const existing = await this.shareRepository.findOne({
        where: { productId: dto.productId, userId },
        transaction,
        lock: true,
      });

      let share: Share;

      if (existing) {
        await existing.update({ shareCount: existing.shareCount + 1 }, { transaction });
        share = existing;
      } else {
        share = await this.shareRepository.create(
          { productId: dto.productId, userId, shareCount: 1 } as any,
          { transaction },
        );
      }

      await transaction.commit();
      return share;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }

  async getShareCount(
    productId: string,
  ): Promise<{ productId: string; totalShares: number }> {
    const shares = await this.shareRepository.findAll({
      where: { productId },
      attributes: ['shareCount'],
    });

    const totalShares = shares.reduce((sum, s) => sum + s.shareCount, 0);
    return { productId, totalShares };
  }
}
