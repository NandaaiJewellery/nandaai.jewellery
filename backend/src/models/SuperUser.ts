import { DataTypes, Model } from "sequelize";
import { sequelize } from "../config/database";

export class SuperUser extends Model {
  declare id: number;
  declare name: string;
  declare email: string;
  declare password: string;
  declare createdAt: Date;
}

SuperUser.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    sequelize,
    tableName: "super_users",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: false,
    indexes: [
      {
        unique: true,
        name: "super_users_email_unique",
        fields: ["email"],
      },
    ],
  }
);
