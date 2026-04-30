import { Optional } from "sequelize";

export interface UserAttributes {
  id: number;
  name: string;
  email: string;
  password: string;
  created_at?: Date;
}

export interface UserCreationAttributes
  extends Optional<UserAttributes, "id" | "created_at"> {}
