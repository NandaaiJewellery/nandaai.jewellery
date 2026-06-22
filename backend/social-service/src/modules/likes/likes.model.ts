import {
  Column,
  CreatedAt,
  DataType,
  Default,
  Index,
  Model,
  PrimaryKey,
  Table,
  Unique,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';

@Table({
  tableName: 'likes',
  timestamps: false,
  indexes: [
    { unique: true, fields: ['product_id', 'user_id'] },
  ],
})
export class Like extends Model {
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

  @CreatedAt
  @Column({ type: DataType.DATE, field: 'created_at' })
  createdAt: Date;
}
