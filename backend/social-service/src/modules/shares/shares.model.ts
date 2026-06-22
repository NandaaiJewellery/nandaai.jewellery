import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Index,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';

@Table({
  tableName: 'shares',
  timestamps: true,
  indexes: [
    { unique: true, fields: ['product_id', 'user_id'] },
  ],
})
export class Share extends Model {
  @PrimaryKey
  @Default(UUIDV4)
  @Column(DataType.UUID)
  id: string;

  @Index
  @Column({ type: DataType.UUID, allowNull: false, field: 'product_id' })
  productId: string;

  @Index
  @Column({ type: DataType.STRING, allowNull: false, field: 'user_id' })
  userId: string;

  @Default(1)
  @Column({ type: DataType.INTEGER, field: 'share_count' })
  shareCount: number;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
