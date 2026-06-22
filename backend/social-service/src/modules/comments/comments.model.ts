import {
  BelongsTo,
  Column,
  CreatedAt,
  DataType,
  Default,
  ForeignKey,
  Index,
  Model,
  PrimaryKey,
  Table,
  UpdatedAt,
} from 'sequelize-typescript';
import { UUIDV4 } from 'sequelize';

@Table({ tableName: 'comments', timestamps: true })
export class Comment extends Model {
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

  @Column({ type: DataType.TEXT, allowNull: false })
  comment: string;

  @ForeignKey(() => Comment)
  @Column({ type: DataType.UUID, allowNull: true, field: 'parent_comment_id' })
  parentCommentId: string | null;

  @BelongsTo(() => Comment, 'parentCommentId')
  parentComment: Comment;

  @Default(false)
  @Column({ type: DataType.BOOLEAN, field: 'is_deleted' })
  isDeleted: boolean;

  @CreatedAt
  @Column({ field: 'created_at' })
  createdAt: Date;

  @UpdatedAt
  @Column({ field: 'updated_at' })
  updatedAt: Date;
}
