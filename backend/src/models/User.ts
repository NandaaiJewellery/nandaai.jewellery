import { Model, DataTypes, Sequelize } from "sequelize";
import { UserAttributes, UserCreationAttributes } from "../types/User";

export class User
  extends Model<UserAttributes, UserCreationAttributes>
  implements UserAttributes {
  [x: string]: any;
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare created_at: Date;
}

export const initUserModel = (sequelize: Sequelize) => {
  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      password: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      created_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
    },
    {
      sequelize,
      tableName: "users",
      timestamps: true,
      createdAt: "created_at",
      updatedAt: false,
      indexes: [
        {
          unique: true,
          name: "users_email_unique",
          fields: ["email"],
        },
      ],
    }
  );

  return User;
}
